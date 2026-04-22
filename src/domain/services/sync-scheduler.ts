import {EmbeddingService} from "./embedding.service.js";
import {TradernetClient} from "../../outbound/clients/tradernet.js";
import {Repository} from "../../outbound/persistence/repository.js";
import {INVEST_IDEA_DETAILS_MARK} from "../constants.js";
import {InvestmentIdea} from "../models.js";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "http://127.0.0.1:1234/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "lmstudio";

export class SyncScheduler {
    private isRunning = false;
    private timer: NodeJS.Timeout | null = null;
    private skip: number = 0;

    constructor(
        private readonly repo: Repository,
        private readonly embeddingService: EmbeddingService = new EmbeddingService(OPENAI_API_KEY, OPENAI_BASE_URL),
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

            if (!await this.repo.hasEmbedding(internalId)) {
                const target = existing ?? idea;
                const text = `${target.title}\n${target.description}`;
                try {
                    const embedding = await this.embeddingService.generate(text);
                    await this.repo.saveEmbedding(internalId, embedding);
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
