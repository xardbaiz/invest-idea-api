import {jest} from "@jest/globals";
import {ChatMessage} from "../../models.js";

const embeddingsCreate = jest.fn<(...args: any[]) => Promise<any>>();
const chatCompletionsCreate = jest.fn<(...args: any[]) => Promise<any>>();
const constructorSpy = jest.fn<(config: unknown) => void>();

jest.unstable_mockModule("openai", () => ({
    __esModule: true,
    default: function FakeOpenAI(this: unknown, config: unknown) {
        constructorSpy(config);
        return {
            embeddings: {create: embeddingsCreate},
            chat: {completions: {create: chatCompletionsCreate}},
        };
    },
}));

const {createAiService, OpenAiCompatibleAiService} = await import("../ai.service.js");

type AiServiceImpl = InstanceType<typeof OpenAiCompatibleAiService>;

describe("OpenAiCompatibleAiService", () => {
    const originalEnv = {...process.env};

    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.EMBEDDING_DIMENSION;
    });

    afterEach(() => {
        process.env = {...originalEnv};
    });

    describe("client configuration", () => {
        it("should talk to the configured base url only", () => {
            createAiServiceWith({apiKey: "key", baseURL: "http://router.local/v1", model: "any-model"});

            expect(constructorSpy).toHaveBeenCalledWith({apiKey: "key", baseURL: "http://router.local/v1"});
        });
    });

    describe("generateEmbedding", () => {
        it("should request an embedding for the configured model", async () => {
            const service = createAiServiceWith({model: "router-embedding-model"});
            embeddingsCreate.mockResolvedValue({data: [{embedding: [0.1, 0.2, 0.3]}]});

            const result = await service.generateEmbedding("hello world");

            expect(result).toEqual([0.1, 0.2, 0.3]);
            expect(embeddingsCreate).toHaveBeenCalledWith({
                model: "router-embedding-model",
                input: "hello world",
                encoding_format: "float",
            });
            expect(embeddingsCreate.mock.calls[0][0]).not.toHaveProperty("dimensions");
        });

        it("should allow overriding the embedding model per call", async () => {
            const service = createAiServiceWith({model: "chat-model"});
            embeddingsCreate.mockResolvedValue({data: [{embedding: [1]}]});

            await service.generateEmbedding("text", "other-embedding-model");

            expect(embeddingsCreate).toHaveBeenCalledWith(expect.objectContaining({model: "other-embedding-model"}));
        });

        it("should send dimensions when they are explicitly configured", async () => {
            process.env.EMBEDDING_DIMENSION = "1536";
            const service = createAiServiceWith({model: "embedding-model", embeddingDimensions: 1536});
            embeddingsCreate.mockResolvedValue({data: [{embedding: [1]}]});

            await service.generateEmbedding("text");

            expect(embeddingsCreate).toHaveBeenCalledWith(expect.objectContaining({dimensions: 1536}));
        });
    });

    describe("generateSummary", () => {
        it("should forward system, few-shot and user messages untouched", async () => {
            const service = createAiServiceWith({model: "chat-model"});
            chatCompletionsCreate.mockResolvedValue({choices: [{message: {content: "  Generated summary  "}}]});

            const messages: ChatMessage[] = [
                {role: "system", content: "System instructions"},
                {role: "user", content: "First user msg"},
                {role: "assistant", content: "First assistant msg"},
            ];

            const result = await service.generateSummary(messages, "Current input");

            expect(result).toBe("Generated summary");
            expect(chatCompletionsCreate).toHaveBeenCalledWith({
                model: "chat-model",
                temperature: 0.3,
                messages: [
                    {role: "system", content: "System instructions"},
                    {role: "user", content: "First user msg"},
                    {role: "assistant", content: "First assistant msg"},
                    {role: "user", content: "Current input"},
                ],
            });
        });

        it("should drop empty system messages", async () => {
            const service = createAiServiceWith({model: "chat-model"});
            chatCompletionsCreate.mockResolvedValue({choices: [{message: {content: "ok"}}]});

            await service.generateSummary([{role: "system", content: ""}], "input");

            expect(chatCompletionsCreate.mock.calls[0][0]).toMatchObject({
                messages: [{role: "user", content: "input"}],
            });
        });

        it("should return an empty string when the model returns no content", async () => {
            const service = createAiServiceWith({model: "chat-model"});
            chatCompletionsCreate.mockResolvedValue({choices: [{message: {content: null}}]});

            await expect(service.generateSummary([], "input")).resolves.toBe("");
        });
    });
});

describe("createAiService", () => {
    const originalEnv = {...process.env};

    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.EMBEDDING_DIMENSION;
        delete process.env.OPENAI_BASE_URL;
        delete process.env.OPENAI_EMBEDDING_MODEL;
    });

    afterEach(() => {
        process.env = {...originalEnv};
    });

    it("should build the service from OPENAI_API_URL, OPENAI_MODEL and OPENAI_API_KEY only", () => {
        process.env.OPENAI_API_URL = "https://router.local/v1";
        process.env.OPENAI_MODEL = "gemini-2.5-flash";
        process.env.OPENAI_API_KEY = "secret";

        const service = createAiService() as AiServiceImpl;

        expect(service).toBeInstanceOf(OpenAiCompatibleAiService);
        expect(constructorSpy).toHaveBeenCalledWith({apiKey: "secret", baseURL: "https://router.local/v1"});
        expect(service["llmModel"]).toBe("gemini-2.5-flash");
        expect(service["embeddingModel"]).toBe("gemini-2.5-flash");
    });

    it("should accept OPENAI_BASE_URL as a fallback for OPENAI_API_URL", () => {
        process.env.OPENAI_MODEL = "model";
        process.env.OPENAI_BASE_URL = "http://localhost:1234/v1";

        createAiService();

        expect(constructorSpy).toHaveBeenCalledWith({apiKey: "", baseURL: "http://localhost:1234/v1"});
    });

    it("should use OPENAI_EMBEDDING_MODEL when configured", () => {
        process.env.OPENAI_API_URL = "https://router.local/v1";
        process.env.OPENAI_MODEL = "chat-model";
        process.env.OPENAI_EMBEDDING_MODEL = "embedding-model";

        const service = createAiService() as AiServiceImpl;

        expect(service["embeddingModel"]).toBe("embedding-model");
        expect(service["llmModel"]).toBe("chat-model");
    });

    it("should throw when OPENAI_MODEL is missing", () => {
        process.env.OPENAI_API_URL = "https://router.local/v1";
        delete process.env.OPENAI_MODEL;

        expect(() => createAiService()).toThrow(/OPENAI_MODEL/);
    });

    it("should throw when OPENAI_API_URL is missing", () => {
        process.env.OPENAI_MODEL = "model";
        delete process.env.OPENAI_API_URL;

        expect(() => createAiService()).toThrow(/OPENAI_API_URL/);
    });
});

function createAiServiceWith(options: {
    apiKey?: string;
    baseURL?: string;
    model: string;
    embeddingModel?: string;
    embeddingDimensions?: number;
}): AiServiceImpl {
    return new OpenAiCompatibleAiService(
        options.apiKey ?? "test-key",
        options.baseURL ?? "http://router.local/v1",
        options.model,
        options.embeddingModel,
        options.embeddingDimensions,
    );
}
