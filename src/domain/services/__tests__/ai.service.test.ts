import { createAiService, GenkitAiService } from "../ai.service.js";
import { jest } from "@jest/globals";
import { Genkit } from "genkit";
import { textEmbedding004, gemini15Flash } from "@genkit-ai/googleai";
import { textEmbedding3Small, gpt4oMini } from "genkitx-openai";
import { EMBEDDING_DIMENSION } from "../../constants.js";

describe("GenkitAiService Unit Tests", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    describe("GenkitAiService core methods", () => {
        let mockGenkit: jest.Mocked<Genkit>;

        beforeEach(() => {
            mockGenkit = {
                embed: jest.fn(),
                generate: jest.fn(),
            } as unknown as jest.Mocked<Genkit>;
        });

        it("should generate embedding correctly", async () => {
            const service = new GenkitAiService(mockGenkit, "test-embedder", "test-model");
            mockGenkit.embed.mockResolvedValue([
                { embedding: [0.1, 0.2, 0.3] }
            ] as any);

            const result = await service.generateEmbedding("hello world");
            expect(result).toEqual([0.1, 0.2, 0.3]);
            expect(mockGenkit.embed).toHaveBeenCalledWith({
                embedder: "test-embedder",
                content: "hello world",
                options: {
                    dimensions: EMBEDDING_DIMENSION,
                },
            });
        });

        it("should generate summary correctly with system instructions and user/model messages", async () => {
            const service = new GenkitAiService(mockGenkit, "test-embedder", "test-model");
            mockGenkit.generate.mockResolvedValue({
                text: "Generated summary text",
            } as any);

            const messages = [
                { role: "system" as const, content: "System instructions" },
                { role: "user" as const, content: "First user msg" },
                { role: "assistant" as const, content: "First assistant msg" },
            ];

            const result = await service.generateSummary(messages, "Current input");
            expect(result).toBe("Generated summary text");
            expect(mockGenkit.generate).toHaveBeenCalledWith({
                model: "test-model",
                system: "System instructions",
                messages: [
                    { role: "user", content: [{ text: "First user msg" }] },
                    { role: "model", content: [{ text: "First assistant msg" }] },
                    { role: "user", content: [{ text: "Current input" }] },
                ],
                config: {
                    temperature: 0.3,
                },
            });
        });

        it("should return empty string if generate returns no text", async () => {
            const service = new GenkitAiService(mockGenkit, "test-embedder", "test-model");
            mockGenkit.generate.mockResolvedValue({} as any);

            const result = await service.generateSummary([], "input");
            expect(result).toBe("");
        });
    });

    describe("createAiService Factory & Model Env Vars", () => {
        it("should create Gemini-configured GenkitAiService when AI_PROVIDER=gemini", () => {
            process.env.AI_PROVIDER = "gemini";
            process.env.GEMINI_API_KEY = "test-gemini-key";

            const service = createAiService();
            expect(service).toBeInstanceOf(GenkitAiService);
            expect(service["embeddingModelName"]).toBe(textEmbedding004.name);
            expect(service["llmModelName"]).toBe(gemini15Flash.name);
        });

        it("should parse gemini/ model prefix from LLM_MODEL and EMBEDDING_MODEL env vars", () => {
            delete process.env.AI_PROVIDER;
            delete process.env.GEMINI_API_KEY;

            process.env.LLM_MODEL = "gemini/gemini-2.0-flash";
            process.env.EMBEDDING_MODEL = "gemini/text-embedding-004";

            const service = GenkitAiService.createAiService();
            expect(service).toBeInstanceOf(GenkitAiService);
            expect(service["llmModelName"]).toBe("googleai/gemini-2.0-flash");
            expect(service["embeddingModelName"]).toBe("googleai/text-embedding-004");
        });

        it("should parse openai/ model prefix from LLM_MODEL and EMBEDDING_MODEL env vars", () => {
            delete process.env.AI_PROVIDER;
            delete process.env.GEMINI_API_KEY;

            process.env.LLM_MODEL = "openai/gpt-4o";
            process.env.EMBEDDING_MODEL = "openai/text-embedding-3-large";

            const service = createAiService();
            expect(service).toBeInstanceOf(GenkitAiService);
            expect(service["llmModelName"]).toBe("openai/gpt-4o");
            expect(service["embeddingModelName"]).toBe("openai/text-embedding-3-large");
        });

        it("should fallback to OpenAI-configured GenkitAiService by default", () => {
            delete process.env.AI_PROVIDER;
            delete process.env.GEMINI_API_KEY;
            delete process.env.LLM_MODEL;
            delete process.env.EMBEDDING_MODEL;

            const service = createAiService();
            expect(service).toBeInstanceOf(GenkitAiService);
            expect(service["embeddingModelName"]).toBe(textEmbedding3Small.name);
            expect(service["llmModelName"]).toBe(gpt4oMini.name);
        });
    });
});
