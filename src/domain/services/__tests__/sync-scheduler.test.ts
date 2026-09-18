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
            isSupportInference: jest.fn().mockReturnValue(false),
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
            chat: {
                completions: {
                    create: jest.fn(),
                },
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

    it("should sync, generate summary if missing, and embed summary for new ideas", async () => {
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
        aiService.openai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: "Sector: Tech\nBusiness: Apple\nIdea: Buy" } }]
        });
        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding: [0.1, 0.2]}]
        });

        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        expect(idea.summary).toBe("Sector: Tech\nBusiness: Apple\nIdea: Buy");
        expect(mockRepo.upsert).toHaveBeenCalledWith(idea);
        // @ts-ignore
        expect(aiService.openai.embeddings.create).toHaveBeenCalledWith({
            dimensions: expect.any(Number),
            model: expect.any(String),
            input: "Sector: Tech\nBusiness: Apple\nIdea: Buy",
            encoding_format: "float"
        });
        expect(mockVectorStore.saveEmbedding).toHaveBeenCalledWith("tradernet_123", "Sector: Tech\nBusiness: Apple\nIdea: Buy", [0.1, 0.2], "2023-01-01");
    });

    it("should use vector store inference when isSupportInference is true", async () => {
        const idea: InvestmentIdea = {
            id: "123",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple",
            title: "Buy Apple",
            description: "Good stock",
            summary: "Sector: Tech\nBusiness: Apple\nIdea: Buy",
            targetPrice: 200,
            currency: "USD",
            publishDate: "2023-01-01"
        };

        mockVectorStore.isSupportInference.mockReturnValue(true);
        mockTradernetClient.fetchIdeas.mockResolvedValue([idea]);
        mockRepo.findById.mockResolvedValue(idea);
        mockVectorStore.hasEmbedding.mockResolvedValue(false);

        // @ts-ignore
        const processed = await syncScheduler.syncAndEmbed(1);

        expect(processed).toBe(1);
        // @ts-ignore
        expect(aiService.openai.embeddings.create).not.toHaveBeenCalled();
        expect(mockVectorStore.saveEmbedding).toHaveBeenCalledWith("tradernet_123", "Sector: Tech\nBusiness: Apple\nIdea: Buy", "2023-01-01");
    });

    it("should skip summary generation if idea already has summary and embedding exists", async () => {
        const idea: InvestmentIdea = {
            id: "123",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple",
            title: "Buy Apple",
            description: "Good stock",
            summary: "Existing summary",
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
        expect(aiService.openai.chat.completions.create).not.toHaveBeenCalled();
        // @ts-ignore
        expect(aiService.openai.embeddings.create).not.toHaveBeenCalled();
        expect(mockVectorStore.saveEmbedding).not.toHaveBeenCalled();
    });
});
