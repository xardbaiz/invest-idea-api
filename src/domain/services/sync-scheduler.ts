import {AiService, createAiService} from "./ai.service.js";
import {TradernetClient} from "../../outbound/clients/tradernet.js";
import {Repository} from "../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../outbound/vector/qdrant.service.js";
import {INVEST_IDEA_DETAILS_MARK} from "../constants.js";
import {InvestmentIdea} from "../models.js";

export const summarySystemPrompt = `You are an expert financial analyst assistant. Your task is to extract core information from investment descriptions and output ONLY a short, structured summary for vector search indexing and human operator review.

RULES:
1. Output ONLY the formatted summary. No preamble, no introductory text, no reasoning, no markdown wrappers, no company names.
2. Keep the summary concise (25 to 50 words maximum).
3. Do not invent facts or metrics not present in the input text.
4. Focus field "Idea" strictly on growth factors, key reasons to buy, and core growth drivers from the text.
5. Always follow the exact output template structure with newlines.

OUTPUT TEMPLATE:
Sector: [Primary Sector / Industry / Asset Class]
Business: [1 short sentence on what the business does]
Idea: [1-2 sentences listing key growth drivers, reasons to buy, and facts supporting the thesis]

EXAMPLES:

Input:
Medical Properties Trust Inc. (MPT) is a real estate investment trust (REIT) specialising in the investment, ownership and leasing of healthcare properties. It has operations in the US, Europe, Australia and South America. The trust operates in the health sector, which is less exposed to volatility. The new deals will bring in additional cash flows. A further increase in interest rates would increase rental payments without affecting the cost of servicing own debt.

Output:
Sector: Real Estate / REIT
Business: Owns and leases healthcare real estate properties globally.
Idea: Low volatility healthcare sector. Growth driven by new cash-flowing deals, inflation-indexed rent increases, and debt service costs unaffected by rising interest rates.

Input:
Novo Nordisk is a global healthcare company specializing in diabetes and obesity care treatments. The massive demand for GLP-1 weight-loss medications like Wegovy continues to outpace supply. Expanding production capacity and upcoming clinical trials for next-generation oral treatments position the firm for sustained market dominance and revenue expansion.

Output:
Sector: Healthcare / Pharmaceuticals
Business: Develops and manufactures GLP-1 treatments for diabetes and obesity care.
Idea: Demand for weight-loss drugs significantly exceeds supply. Key growth reasons include manufacturing expansion and upcoming clinical trials for next-gen oral treatments.

Input:
ASML Holding NV manufactures photolithography systems critical for semiconductor fabrication. The rapid adoption of artificial intelligence and advanced computing creates strong structural demand for extreme ultraviolet (EUV) lithography tools. High order backlogs and technological monopoly status ensure strong long-term pricing power and margin growth.

Output:
Sector: Hardware / Semiconductors
Business: Manufactures advanced EUV photolithography systems for semiconductor fabrication.
Idea: Monopoly position in photolithography. Core reasons to buy are high pricing power, massive order backlog, and booming AI demand for chips.

Input:
Palantir Technologies provides AI-driven data analytics and decision-making platforms for defense and commercial enterprises. Accelerated enterprise adoption of its Artificial Intelligence Platform (AIP) is driving rapid customer acquisition and expanding profit margins, supported by high customer retention and strong US government contracts.

Output:
Sector: AI / Enterprise Software
Business: Provides AI-driven enterprise analytics and decision-making software platform.
Idea: High customer retention and strong US government contracts. Rapid commercial adoption of AIP platform is expanding market share and profit margins.`;

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
                    const summary = await this.aiService.generateSummary(summarySystemPrompt, text);
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
