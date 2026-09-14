import { GeminiAiService, createAiService, OpenAiService } from "../ai.service.js";
import { jest } from "@jest/globals";

describe("GeminiAiService and Factory Tests", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe("GeminiAiService unit tests", () => {
        it("should generate embedding with GeminiAiService", async () => {
            const service = new GeminiAiService("test-gemini-key");
            const mockEmbedContent = jest.fn<any>().mockResolvedValue({
                embedding: { values: [0.1, 0.2, 0.3] }
            });
            // @ts-ignore
            service.ai = {
                models: {
                    embedContent: mockEmbedContent,
                    generateContent: jest.fn(),
                }
            };

            const result = await service.generateEmbedding("hello world");
            expect(result).toEqual([0.1, 0.2, 0.3]);
            expect(mockEmbedContent).toHaveBeenCalledWith({
                model: "text-embedding-004",
                contents: "hello world"
            });
        });

        it("should discover topics with GeminiAiService", async () => {
            const service = new GeminiAiService("test-gemini-key");
            const topicSuggestions = [{ topic: "Tech", suggestedQuery: "Tech stocks", count: 5 }];
            const mockGenerateContent = jest.fn<any>().mockResolvedValue({
                text: JSON.stringify({ topics: topicSuggestions })
            });
            // @ts-ignore
            service.ai = {
                models: {
                    embedContent: jest.fn(),
                    generateContent: mockGenerateContent,
                }
            };

            const topics = await service.discoverTopics(["Title 1", "Title 2"], "tech");
            expect(topics).toEqual(topicSuggestions);
            expect(mockGenerateContent).toHaveBeenCalled();
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
            const service = createAiService();
            expect(service).toBeInstanceOf(GeminiAiService);
        });

        it("should create GeminiAiService when GEMINI_API_KEY is present without AI_PROVIDER", () => {
            delete process.env.AI_PROVIDER;
            process.env.GEMINI_API_KEY = "dummy-key";
            const service = createAiService();
            expect(service).toBeInstanceOf(GeminiAiService);
        });

        it("should create OpenAiService by default", () => {
            delete process.env.AI_PROVIDER;
            delete process.env.GEMINI_API_KEY;
            const service = createAiService();
            expect(service).toBeInstanceOf(OpenAiService);
        });
    });
});
