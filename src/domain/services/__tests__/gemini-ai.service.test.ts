import {createAiService, GeminiAiService, OpenAiService} from "../ai.service.js";
import {jest} from "@jest/globals";
import {EMBEDDING_DIMENSION} from "../../constants.js";

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
                    outputDimensionality: EMBEDDING_DIMENSION,
                },
            });
        });

        it("should generate summary with GeminiAiService", async () => {
            const service = new GeminiAiService("test-gemini-key");
            const summaryOutput = "Sector: Tech\nBusiness: Apple\nIdea: Growth";
            jest.spyOn(service["ai"].models, "generateContent").mockResolvedValue(
                {text: summaryOutput} as any
            );

            const messages = [
                { role: "system" as const, content: "system instruction" },
                { role: "user" as const, content: "ex user" },
                { role: "assistant" as const, content: "ex assistant" },
            ];

            const result = await service.generateSummary(messages, "user input text");
            expect(result).toBe(summaryOutput);
            expect(service["ai"].models.generateContent).toHaveBeenCalledWith({
                model: expect.any(String),
                contents: [
                    { role: "user", parts: [{ text: "ex user" }] },
                    { role: "model", parts: [{ text: "ex assistant" }] },
                    { role: "user", parts: [{ text: "user input text" }] },
                ],
                config: {
                    systemInstruction: "system instruction",
                    temperature: 0.3,
                },
            });
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
