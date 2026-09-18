import {ApiService} from "../api.service.js";
import {OpenAiService} from "../ai.service.js";
import {Repository} from "../../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../../outbound/vector/qdrant.service.js";
import {jest} from "@jest/globals";
import {InvestmentIdea} from "../../models.js";

describe("ApiService Integration Tests", () => {
    let apiService: ApiService;
    let aiService: OpenAiService;
    let mockRepo: jest.Mocked<Repository>;
    let mockVectorStore: jest.Mocked<VectorStoreService>;

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

        // Mock OpenAI calls within AiService
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

        apiService = new ApiService(mockRepo, aiService, mockVectorStore);
    });

    it("should search ideas correctly", async () => {
        const query = "test query";
        const embedding = [0.1, 0.2, 0.3];
        const idea: InvestmentIdea = {
            id: "tradernet_1",
            provider: "tradernet",
            ticker: "AAPL",
            companyName: "Apple",
            title: "Test Idea",
            description: "Desc",
            targetPrice: 150,
            currency: "USD",
            publishDate: "2023-01-01",
        };

        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding}]
        });

        mockVectorStore.searchSimilar.mockResolvedValue([{ideaId: "tradernet_1", distance: 0.9}]);
        mockRepo.findByIds.mockResolvedValue([idea]);

        const results = await apiService.searchIdeas(query, 10, "2023-01-01", "2023-01-31");

        expect(results).toEqual([{idea, distance: 0.9}]);
        // @ts-ignore
        expect(aiService.openai.embeddings.create).toHaveBeenCalledWith({
            dimensions: expect.any(Number),
            model: expect.any(String),
            input: query,
            encoding_format: "float"
        });
        expect(mockVectorStore.searchSimilar).toHaveBeenCalledWith(embedding, 10, "2023-01-01", "2023-01-31");
        expect(mockRepo.findByIds).toHaveBeenCalledWith(["tradernet_1"]);
    });

    it("should sort search results by vector distance (descending) and publish date (descending)", async () => {
        const query = "apple";
        const embedding = [0.1, 0.2];

        const ideaA: InvestmentIdea = { id: "A", provider: "p", ticker: "A", title: "Idea A", companyName: "A", targetPrice: 10, currency: "USD", description: "A", publishDate: "2023-01-01" };
        const ideaB: InvestmentIdea = { id: "B", provider: "p", ticker: "B", title: "Idea B", companyName: "B", targetPrice: 20, currency: "USD", description: "B", publishDate: "2023-05-01" };
        const ideaC: InvestmentIdea = { id: "C", provider: "p", ticker: "C", title: "Idea C", companyName: "C", targetPrice: 30, currency: "USD", description: "C", publishDate: "2023-01-01" };

        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding}]
        });
        mockVectorStore.searchSimilar.mockResolvedValue([
            { ideaId: "A", distance: 0.8 },
            { ideaId: "B", distance: 0.95 },
            { ideaId: "C", distance: 0.95 },
        ]);
        mockRepo.findByIds.mockResolvedValue([ideaA, ideaB, ideaC]);

        const results = await apiService.searchIdeas(query, 10);

        expect(results.map(r => r.idea.ticker)).toEqual(["B", "C", "A"]);
    });
});
