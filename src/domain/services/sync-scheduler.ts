import {GenkitAiService, createAiService} from "./ai.service.js";
import {TradernetClient} from "../../outbound/clients/tradernet.js";
import {Repository} from "../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../outbound/vector/qdrant.service.js";
import {INVEST_IDEA_DETAILS_MARK} from "../constants.js";
import {ChatMessage, InvestmentIdea} from "../models.js";
// @ts-ignore
import summaryPromptMessages from './summary.messages.json' with {type: 'json'};

const embeddingSourcePrefix = process.env.EMBEDDING_SOURCE_PREFIX;

export class SyncScheduler {
    private isRunning = false;
    private timer: NodeJS.Timeout | null = null;
    private skip: number = 0;

    constructor(
        private readonly repo: Repository,
        private readonly vectorStore: VectorStoreService,
        private readonly aiService: GenkitAiService = createAiService(),
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
            const ideaText = `${target.title}\n${target.description}`;

            if (!target.summary) {
                try {
                    const summary = await this.aiService.generateSummary(summaryPromptMessages as ChatMessage[], ideaText);
                    if (summary) {
                        target.summary = summary;
                        await this.repo.upsert(target);
                    }
                } catch (e) {
                    console.error(`Failed to generate summary for idea ${internalId}:`, e);
                }
            }

            if (!await this.vectorStore.hasEmbedding(internalId)) {
                let payloadText = target.summary || ideaText;
                try {
                    if (this.vectorStore.isSupportInference()) {
                        await this.vectorStore.saveEmbedding(internalId, payloadText, target.publishDate);
                    } else {
                        const embedding = await this.aiService.generateEmbedding(embeddingSourcePrefix ? embeddingSourcePrefix + payloadText : payloadText);
                        await this.vectorStore.saveEmbedding(internalId, payloadText, embedding, target.publishDate);
                    }
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
