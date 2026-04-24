import {SyncScheduler} from "../sync-scheduler.js";
import {AiService} from "../ai.service.js";
import {TradernetClient} from "../../../outbound/clients/tradernet.js";
import {Repository} from "../../../outbound/persistence/repository.js";
import {jest} from "@jest/globals";
import {InvestmentIdea} from "../../models.js";

describe("SyncScheduler Integration Tests", () => {
    let syncScheduler: SyncScheduler;
    let mockRepo: jest.Mocked<Repository>;
    let aiService: AiService;
    let mockTradernetClient: jest.Mocked<TradernetClient>;

    beforeEach(() => {
        mockRepo = {
            upsert: jest.fn(),
            findById: jest.fn(),
            hasEmbedding: jest.fn(),
            saveEmbedding: jest.fn(),
            searchSimilar: jest.fn(),
            findTitlesByDateRange: jest.fn(),
        } as unknown as jest.Mocked<Repository>;

        aiService = new AiService("test-key", "https://api.openai.com/v1");
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

        syncScheduler = new SyncScheduler(mockRepo, aiService, mockTradernetClient);
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
        mockRepo.hasEmbedding.mockResolvedValue(false);
        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding: [0.1, 0.2]}]
        });

        // We need to access the private method for testing or call start and wait.
        // For integration test of the logic, calling the private method via any is an option,
        // or just calling a sync method if it was public.
        // Since it's private, I'll use start(..., size) but I need to be careful with timers.

        // Let's use the private method for logic testing as it's cleaner than dealing with intervals in tests.
        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        expect(mockRepo.upsert).toHaveBeenCalled();
        expect(mockRepo.saveEmbedding).toHaveBeenCalledWith("tradernet_123", [0.1, 0.2]);
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
        mockRepo.hasEmbedding.mockResolvedValue(true);

        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        expect(mockRepo.upsert).not.toHaveBeenCalled();
        // @ts-ignore
        expect(aiService.openai.embeddings.create).not.toHaveBeenCalled();
        expect(mockRepo.saveEmbedding).not.toHaveBeenCalled();
    });
});
