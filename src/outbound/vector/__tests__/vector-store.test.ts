import {VectraVectorService} from "../vectra.service.js";
import {createVectorStoreService} from "../vector-store.factory.js";
import {QdrantVectorService} from "../qdrant.service.js";
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
        it("should save and check embedding presence", async () => {
            const service = new VectraVectorService(testFolder);
            expect(await service.hasEmbedding("idea_1")).toBe(false);

            await service.saveEmbedding("idea_1", [1, 0, 0], "2023-01-01");
            expect(await service.hasEmbedding("idea_1")).toBe(true);
        });

        it("should search similar vectors with cosine similarity and date filter", async () => {
            const service = new VectraVectorService(testFolder);

            await service.saveEmbedding("idea_1", [1, 0, 0], "2023-01-01");
            await service.saveEmbedding("idea_2", [0, 1, 0], "2023-02-01");
            await service.saveEmbedding("idea_3", [0.9, 0.1, 0], "2023-03-01");

            // Query with vector similar to [1, 0, 0]
            const results = await service.searchSimilar([1, 0, 0], 10);
            expect(results.map(r => r.ideaId)).toEqual(["idea_1", "idea_3", "idea_2"]);
            expect(results[0].distance).toBeCloseTo(1.0);

            // Filter with date range
            const filteredResults = await service.searchSimilar([1, 0, 0], 10, "2023-02-01", "2023-03-31");
            expect(filteredResults.map(r => r.ideaId)).toEqual(["idea_3", "idea_2"]);
        });
    });

    describe("createVectorStoreService factory tests", () => {
        it("should create QdrantVectorService when QDRANT_URL is present", () => {
            process.env.QDRANT_URL = "http://localhost:6333";
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(QdrantVectorService);
        });

        it("should create QdrantVectorService when QDRANT_API_KEY is present", () => {
            delete process.env.QDRANT_URL;
            process.env.QDRANT_API_KEY = "test-key";
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(QdrantVectorService);
        });

        it("should fallback to VectraVectorService when no Qdrant env vars are present", () => {
            delete process.env.QDRANT_URL;
            delete process.env.QDRANT_API_KEY;
            const service = createVectorStoreService();
            expect(service).toBeInstanceOf(VectraVectorService);
        });
    });
});
