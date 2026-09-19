import {VectraVectorService} from "../vectra.service.js";
import {createVectorStoreService} from "../vector-store.factory.js";
import {QdrantVectorService} from "../qdrant.service.js";
import {jest} from "@jest/globals";
import fs from "fs/promises";
import path from "path";

describe("VectorStore Service Tests", () => {
    let originalEnv: NodeJS.ProcessEnv;
    const testFolder = path.join(process.cwd(), "test_vectra_index");

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(async () => {
        process.env = originalEnv;
        await fs.rm(testFolder, { recursive: true, force: true }).catch(() => {});
    });

    describe("VectraVectorService unit tests", () => {
        it("should return false for isSupportInference", () => {
            const service = new VectraVectorService(testFolder);
            expect(service.isSupportInference()).toBe(false);
        });

        it("should save and check embedding presence", async () => {
            const service = new VectraVectorService(testFolder);
            expect(await service.hasEmbedding("idea_1")).toBe(false);

            await service.saveEmbedding("idea_1", "text_1", [1, 0, 0], "2023-01-01");
            expect(await service.hasEmbedding("idea_1")).toBe(true);
        });

        it("should search similar vectors with cosine similarity and date filter", async () => {
            const service = new VectraVectorService(testFolder);

            await service.saveEmbedding("idea_1", "text_1", [1, 0, 0], "2023-01-01");
            await service.saveEmbedding("idea_2", "text_2", [0, 1, 0], "2023-02-01");
            await service.saveEmbedding("idea_3", "text_3", [0.9, 0.1, 0], "2023-03-01");

            // Query with vector similar to [1, 0, 0]
            const results = await service.searchSimilar([1, 0, 0], 10);
            expect(results.map(r => r.ideaId)).toEqual(["idea_1", "idea_3", "idea_2"]);
            expect(results[0].distance).toBeCloseTo(1.0);

            // Filter with date range
            const filteredResults = await service.searchSimilar([1, 0, 0], 10, "2023-02-01", "2023-03-31");
            expect(filteredResults.map(r => r.ideaId)).toEqual(["idea_3", "idea_2"]);
        });

        it("should throw error if inference save or search is attempted without vector", async () => {
            const service = new VectraVectorService(testFolder);
            await expect(service.saveEmbedding("idea_1", "text_1", "2023-01-01")).rejects.toThrow(
                "VectraVectorService does not support server-side inference. Embedding array is required."
            );
            await expect(service.searchSimilar("query string", 10)).rejects.toThrow(
                "VectraVectorService does not support server-side inference. Query vector array is required."
            );
        });
    });

    describe("QdrantVectorService unit tests", () => {
        it("should report isSupportInference based on QDRANT_EMBEDDING_MODEL", () => {
            delete process.env.QDRANT_EMBEDDING_MODEL;
            const serviceWithoutModel = new QdrantVectorService();
            expect(serviceWithoutModel.isSupportInference()).toBe(false);

            process.env.QDRANT_EMBEDDING_MODEL = "intfloat/multilingual-e5-small";
            const serviceWithModel = new QdrantVectorService();
            expect(serviceWithModel.isSupportInference()).toBe(true);
        });

        it("should save point and search using inference model when configured", async () => {
            const modelName = "intfloat/multilingual-e5-small";
            const service = new QdrantVectorService("http://localhost:6333", undefined, "test_collection", modelName);

            const mockClient = (service as any).client;
            mockClient.collectionExists = (jest.fn() as any).mockResolvedValue({ exists: true });
            mockClient.createPayloadIndex = (jest.fn() as any).mockResolvedValue({});
            mockClient.upsert = (jest.fn() as any).mockResolvedValue({});
            mockClient.query = (jest.fn() as any).mockResolvedValue({
                points: [{ id: "uuid-1", score: 0.95, payload: { idea_id: "idea_1" } }]
            });

            await service.saveEmbedding("idea_1", "Recipe for baking chocolate chip cookies", "2023-01-01");

            expect(mockClient.upsert).toHaveBeenCalledWith("test_collection", {
                wait: true,
                points: [
                    {
                        id: expect.any(String),
                        vector: {
                            text: "Recipe for baking chocolate chip cookies",
                            model: modelName,
                        },
                        payload: expect.objectContaining({
                            idea_id: "idea_1",
                            text: "Recipe for baking chocolate chip cookies",
                            publish_date: "2023-01-01",
                        }),
                    },
                ],
            });

            const results = await service.searchSimilar("What ingredients are needed?", 10);

            expect(mockClient.query).toHaveBeenCalledWith("test_collection", {
                query: {
                    text: "What ingredients are needed?",
                    model: modelName,
                },
                limit: 10,
                filter: undefined,
                with_payload: true,
            });

            expect(results).toEqual([{ ideaId: "idea_1", distance: 0.95 }]);
        });
    });

    describe("createVectorStoreService factory tests", () => {
        it("should create QdrantVectorService when QDRANT_URL is present", () => {
            process.env.QDRANT_URL = "http://localhost:6333";
            delete process.env.QDRANT_API_KEY;
            delete process.env.QDRANT_EMBEDDING_MODEL;
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(QdrantVectorService);
        });

        it("should create QdrantVectorService when QDRANT_API_KEY is present", () => {
            delete process.env.QDRANT_URL;
            process.env.QDRANT_API_KEY = "test-key";
            delete process.env.QDRANT_EMBEDDING_MODEL;
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(QdrantVectorService);
        });

        it("should create QdrantVectorService when QDRANT_EMBEDDING_MODEL is present", () => {
            delete process.env.QDRANT_URL;
            delete process.env.QDRANT_API_KEY;
            process.env.QDRANT_EMBEDDING_MODEL = "intfloat/multilingual-e5-small";
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(QdrantVectorService);
            expect(service.isSupportInference()).toBe(true);
        });

        it("should fallback to VectraVectorService when no Qdrant env vars are present", () => {
            delete process.env.QDRANT_URL;
            delete process.env.QDRANT_API_KEY;
            delete process.env.QDRANT_EMBEDDING_MODEL;
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(VectraVectorService);
        });
    });
});
