import {IdeaClassifier} from "./classifier";
import {TradernetClient} from "../../outbound/clients/tradernet";
import {Repository} from "../../outbound/persistence/repository";
import {INVEST_IDEA_DETAILS_MARK} from "../constants";
import {InvestmentIdea} from "../models";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "http://127.0.0.1:1234/v1"; // Or your compatible provider
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "lmstudio";

export class SyncScheduler {
    private isRunning = false;
    private timer: NodeJS.Timeout | null = null;
    private skip: number = 0;

    constructor(
        private readonly repo: Repository,
        private readonly classifier: IdeaClassifier = new IdeaClassifier(OPENAI_API_KEY, OPENAI_BASE_URL),
        private readonly tradernetClient: TradernetClient = new TradernetClient(),
    ) {
    }

    start(intervalMs: number, size: number): void {
        const runSafely = async () => {
            if (this.isRunning) {
                console.warn("sync_and_categorize is still running, skipping this cycle");
                return;
            }

            this.isRunning = true;

            try {
                const processed = await this.syncAndCategorize(size);
                console.log(`sync_and_categorize completed, processed ${processed} ideas`);
            } catch (error) {
                console.error("sync_and_categorize failed", error);
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

    private async syncAndCategorize(size: number): Promise<number> {
        const ideas = await this.tradernetClient.fetchIdeas(this.skip, size);

        for (const idea of ideas) {
            const externalId = idea.id;
            const internalId = `${idea.provider}_${idea.id}`;
            const existingIdea = await this.repo.findById(internalId)
            if (!existingIdea) {
                idea.id = internalId;
                idea.categories = await this.classifier.classify(idea);
                await this.enrichWithDetails(externalId, idea);
                await this.repo.upsert(idea);
            } else {
                const existingCategories = existingIdea.categories;
                if (!existingCategories || existingCategories.length == 0) {
                    existingIdea.categories = await this.classifier.classify(existingIdea);
                    if (!existingIdea.description?.includes(INVEST_IDEA_DETAILS_MARK)) {
                        await this.enrichWithDetails(externalId, existingIdea);
                    }
                    await this.repo.upsert(existingIdea);
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