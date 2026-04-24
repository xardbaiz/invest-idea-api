import {ApiService} from "../api.service.js";
import {AiService} from "../ai.service.js";
import {Repository} from "../../../outbound/persistence/repository.js";
import {jest} from "@jest/globals";

describe("ApiService Integration Tests", () => {
    let apiService: ApiService;
    let aiService: AiService;
    let mockRepo: jest.Mocked<Repository>;

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

        apiService = new ApiService(mockRepo, aiService);
    });

    it("should search ideas correctly", async () => {
        const query = "test query";
        const embedding = [0.1, 0.2, 0.3];
        const searchResults = [{idea: {title: "Test Idea"}, distance: 0.1}];

        // @ts-ignore
        aiService.openai.embeddings.create.mockResolvedValue({
            data: [{embedding}]
        });

        // @ts-ignore
        mockRepo.searchSimilar.mockResolvedValue(searchResults);

        const results = await apiService.searchIdeas(query, 10, "2023-01-01", "2023-01-31");

        expect(results).toEqual(searchResults);
        // @ts-ignore
        expect(aiService.openai.embeddings.create).toHaveBeenCalledWith({
            model: expect.any(String),
            input: query,
            encoding_format: "float"
        });
        expect(mockRepo.searchSimilar).toHaveBeenCalledWith(embedding, 10, "2023-01-01", "2023-01-31");
    });

    it("should discover topics correctly", async () => {
        const from = "2023-01-01";
        const to = "2023-01-31";
        const titles = ["Title 1", "Title 2"];
        const topicSuggestions = [{topic: "Topic 1", suggestedQuery: "Query 1", count: 2}];

        mockRepo.findTitlesByDateRange.mockResolvedValue(titles);

        // @ts-ignore
        aiService.openai.chat.completions.create.mockResolvedValue({
            choices: [{
                message: {
                    content: JSON.stringify({topics: topicSuggestions})
                }
            }]
        });

        const topics = await apiService.discoverTopics(from, to, "hint");

        expect(topics).toEqual(topicSuggestions);
        expect(mockRepo.findTitlesByDateRange).toHaveBeenCalledWith(from, to);
        // @ts-ignore
        expect(aiService.openai.chat.completions.create).toHaveBeenCalled();
    });
});
