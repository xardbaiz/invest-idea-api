import {IdeaClassifier} from "./classifier";
import {TradernetClient} from "../../outbound/clients/tradernet";
import {Repository} from "../../outbound/persistence/repository";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "http://localhost:1234/v1"; // Or your compatible provider
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
            const internalId = `${idea.provider}_${idea.id}`;
            const existing = this.repo.findById(internalId)
            if (!existing?.categories || existing.categories.length == 0) {
                let details = await this.tradernetClient.getDetails(idea.id);

                idea.id = internalId;
                if (details) {
                    idea.description += "\n\n--------details----\n\n" + details;
                }
                this.repo.upsert(idea);

                const categories = this.repo.findCategoriesByIdeaId(idea.id);
                if (!categories || categories.length === 0) {
                    idea.categories = await this.classifier.classify(idea);
                    this.repo.upsert(idea);
                }
            }
        }

        this.skip += ideas.length;
        return ideas.length;
    }
}