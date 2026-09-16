import {SyncScheduler} from "../sync-scheduler.js";
import {OpenAiService} from "../ai.service.js";
import {TradernetClient} from "../../../outbound/clients/tradernet.js";
import {Repository} from "../../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../../outbound/vector/qdrant.service.js";
import {jest} from "@jest/globals";
import {InvestmentIdea} from "../../models.js";

describe("SyncScheduler Integration Tests", () => {
    let syncScheduler: SyncScheduler;
    let mockRepo: jest.Mocked<Repository>;
    let mockVectorStore: jest.Mocked<VectorStoreService>;
    let aiService: OpenAiService;
    let mockTradernetClient: jest.Mocked<TradernetClient>;

    beforeEach(() => {
        mockRepo = {
            upsert: jest.fn(),
            findById: jest.fn(),
            findByIds: jest.fn(),
            findTitlesByDateRange: jest.fn(),
        } as unknown as jest.Mocked<Repository>;

        mockVectorStore = {
            hasEmbedding: jest.fn(),
            saveEmbedding: jest.fn(),
            searchSimilar: jest.fn(),
        } as unknown as jest.Mocked<VectorStoreService>;

        aiService = new OpenAiService("test-key", "https://api.openai.com/v1");
        // @ts-ignore
        aiService.openai = {
            embeddings: {
                create: jest.fn(),
            },
        };

        mockTradernetClient = {
            fetchIdeas: jest.fn(),
            getDetails: jest.fn(),
        } as unknown as jest.Mocked<TradernetClient>;

        syncScheduler = new SyncScheduler(mockRepo, mockVectorStore, aiService, mockTradernetClient);
    });

    afterEach(() => {
        syncScheduler.stop();
    });

    it("should sync and embed new ideas", async () => {
        const idea: InvestmentIdea = {
            id: "123",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple",
            title: "Buy Apple",
            description: "Good stock",
            targetPrice: 200,
            currency: "USD",
            publishDate: "2023-01-01"
        };

        mockTradernetClient.fetchIdeas.mockResolvedValue([idea]);
        mockRepo.findById.mockResolvedValue(undefined);
        mockTradernetClient.getDetails.mockResolvedValue("Some details");
        mockVectorStore.hasEmbedding.mockResolvedValue(false);
        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding: [0.1, 0.2]}]
        });

        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        expect(mockRepo.upsert).toHaveBeenCalled();
        expect(mockVectorStore.saveEmbedding).toHaveBeenCalledWith("tradernet_123", [0.1, 0.2], "2023-01-01");
    });

    it("should skip embedding if it already exists", async () => {
        const idea: InvestmentIdea = {
            id: "123",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple",
            title: "Buy Apple",
            description: "Good stock",
            targetPrice: 200,
            currency: "USD",
            publishDate: "2023-01-01"
        };

        mockTradernetClient.fetchIdeas.mockResolvedValue([idea]);
        mockRepo.findById.mockResolvedValue(idea);
        mockVectorStore.hasEmbedding.mockResolvedValue(true);

        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        expect(mockRepo.upsert).not.toHaveBeenCalled();
        // @ts-ignore
        expect(aiService.openai.embeddings.create).not.toHaveBeenCalled();
        expect(mockVectorStore.saveEmbedding).not.toHaveBeenCalled();
    });
});
