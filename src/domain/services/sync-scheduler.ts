import {AiService, createAiService} from "./ai.service.js";
import {TradernetClient} from "../../outbound/clients/tradernet.js";
import {Repository} from "../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../outbound/vector/qdrant.service.js";
import {INVEST_IDEA_DETAILS_MARK} from "../constants.js";
import {ChatMessage, InvestmentIdea} from "../models.js";

export const summaryPromptMessages: ChatMessage[] = [
    {
        role: "system",
        content: `You are an expert financial analyst assistant. Your task is to extract core information from investment descriptions and output ONLY a short, structured summary for vector search indexing and human operator review.

RULES:
1. Output ONLY the formatted summary. No preamble, no introductory text, no reasoning, no markdown wrappers, no company names.
2. Keep the summary concise (25 to 50 words maximum).
3. Do not invent facts or metrics not present in the input text.
4. Focus field "Idea" strictly on growth factors, key reasons to buy, and core growth drivers from the text.
5. Always follow the exact output template structure with newlines.

OUTPUT TEMPLATE:
Sector: [Primary Sector / Industry / Asset Class]
Business: [1 short sentence on what the business does]
Idea: [1-2 sentences listing key growth drivers, reasons to buy, and facts supporting the thesis]`
    },
    {
        role: "user",
        content: "SPIE SE is a European technical services provider for energy, industrial, and digital infrastructure. The company designs, installs, and maintains engineering systems, power grids, and data centers. SPIE generates revenue from project execution and recurring asset maintenance, with major markets in Germany and France. Growth is driven by long-term power grid modernization contracts, including the TenneT substations project. Organic revenue growth reached 7.3% in Germany, supported by high contract renewal rates of 90% and inorganic growth via five strategic acquisitions adding €670 million in annual revenue."
    },
    {
        role: "assistant",
        content: `Sector: Industrials / Technical Services
Business: Provides technical services for energy, industrial, and digital infrastructure across Europe.
Idea: Growth driven by power grid upgrades, accelerating organic growth, and strategic acquisitions, supported by high-margin recurring maintenance revenue and strong order backlogs.`
    },
    {
        role: "user",
        content: "Vertex is a US enterprise software provider specializing in tax compliance and indirect tax calculations integrated with ERP and e-commerce platforms. European mandates for mandatory e-invoicing starting in France, Germany, and Spain expand Vertex's total addressable market by $7 billion. New AI-driven offerings like Smart Categorization are accelerating large enterprise contract wins and customer engagement, while a 4.19% share buyback program supports capital return."
    },
    {
        role: "assistant",
        content: `Sector: Software / Enterprise Tech
Business: Develops tax compliance and automated e-invoicing software for international trade.
Idea: Massive $7B addressable market expansion driven by mandatory e-invoicing rollouts in Europe. Further growth fueled by new AI product launches and a 4.19% share buyback program.`
    }
];

export class SyncScheduler {
    private isRunning = false;
    private timer: NodeJS.Timeout | null = null;
    private skip: number = 0;

    constructor(
        private readonly repo: Repository,
        private readonly vectorStore: VectorStoreService,
        private readonly aiService: AiService = createAiService(),
        private readonly tradernetClient: TradernetClient = new TradernetClient(),
    ) {
    }

    start(intervalMs: number, size: number): void {
        const runSafely = async () => {
            if (this.isRunning) {
                console.warn("sync is still running, skipping this cycle");
                return;
            }

            this.isRunning = true;

            try {
                const processed = await this.syncAndEmbed(size);
                console.log(`sync completed, processed ${processed} ideas`);
            } catch (error) {
                console.error("sync failed", error);
            } finally {
                this.isRunning = false;
            }
        };

        void runSafely();
        this.timer = setInterval(() => {
            void runSafely();
        }, intervalMs);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private async syncAndEmbed(size: number): Promise<number> {
        const ideas = await this.tradernetClient.fetchIdeas(this.skip, size);

        for (const idea of ideas) {
            const externalId = idea.id;
            const internalId = `${idea.provider}_${idea.id}`;
            idea.id = internalId;

            const existing = await this.repo.findById(internalId);
            if (!existing) {
                await this.enrichWithDetails(externalId, idea);
                await this.repo.upsert(idea);
            }

            const target = existing ?? idea;

            if (!target.summary) {
                const text = `${target.title}\n${target.description}`;
                try {
                    const summary = await this.aiService.generateSummary(summaryPromptMessages, text);
                    if (summary) {
                        target.summary = summary;
                        await this.repo.upsert(target);
                    }
                } catch (e) {
                    console.error(`Failed to generate summary for idea ${internalId}:`, e);
                }
            }

            if (!await this.vectorStore.hasEmbedding(internalId)) {
                const embeddingText = target.summary || `${target.title}\n${target.description}`;
                try {
                    const embedding = await this.aiService.generateEmbedding(embeddingText);
                    await this.vectorStore.saveEmbedding(internalId, embedding, target.publishDate);
                } catch (e) {
                    console.error(`Failed to generate embedding for idea ${internalId}:`, e);
                }
            }
        }

        if (ideas.length >= size) {
            this.skip += ideas.length;
        } else {
            this.skip = 0;
        }
        return ideas.length;
    }

    private async enrichWithDetails(ideaExternalId: string, idea: InvestmentIdea) {
        let details = await this.tradernetClient.getDetails(ideaExternalId);
        if (details) {
            idea.description += `\n\n----${INVEST_IDEA_DETAILS_MARK}----\n\n` + details;
        }
    }
}
