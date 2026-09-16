import {createAiService, GeminiAiService, OpenAiService} from "../ai.service.js";
import {jest} from "@jest/globals";

describe("GeminiAiService and Factory Tests", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    describe("GeminiAiService unit tests", () => {
        it("should generate embedding with GeminiAiService", async () => {
            const service = new GeminiAiService("test-gemini-key");
            jest.spyOn(service["ai"].models, "embedContent").mockResolvedValue(
                {embeddings: [{values: [0.1, 0.2, 0.3]}]} as any
            );

            const result = await service.generateEmbedding("hello world");
            expect(result).toEqual([0.1, 0.2, 0.3]);
            expect(service["ai"].models.embedContent).toHaveBeenCalledWith({
                model: "text-embedding-004",
                contents: "hello world",
                config: {
                    outputDimensionality: 1024,
                },
            });
        });

        it("should discover topics with GeminiAiService", async () => {
            const topicSuggestions = [{ topic: "Tech", suggestedQuery: "Tech stocks", count: 5 }];
            const service = new GeminiAiService("test-gemini-key");
            jest.spyOn(service["ai"].models, "generateContent").mockResolvedValue(
                {text: JSON.stringify({topics: topicSuggestions})} as any
            );

            const topics = await service.discoverTopics(["Title 1", "Title 2"], "tech");
            expect(topics).toEqual(topicSuggestions);
            expect(service["ai"].models.generateContent).toHaveBeenCalled();
        });

        it("should return empty array when titles list is empty in discoverTopics", async () => {
            const service = new GeminiAiService("test-gemini-key");
            const topics = await service.discoverTopics([]);
            expect(topics).toEqual([]);
        });
    });

    describe("createAiService factory tests", () => {
        it("should create GeminiAiService when AI_PROVIDER=gemini", () => {
            process.env.AI_PROVIDER = "gemini";
            process.env.GEMINI_API_KEY = "dummy-key";
            expect(createAiService()).toBeInstanceOf(GeminiAiService);
        });

        it("should create GeminiAiService when GEMINI_API_KEY is present without AI_PROVIDER", () => {
            delete process.env.AI_PROVIDER;
            process.env.GEMINI_API_KEY = "dummy-key";
            expect(createAiService()).toBeInstanceOf(GeminiAiService);
        });

        it("should create OpenAiService by default", () => {
            delete process.env.AI_PROVIDER;
            delete process.env.GEMINI_API_KEY;
            expect(createAiService()).toBeInstanceOf(OpenAiService);
        });
    });
});
