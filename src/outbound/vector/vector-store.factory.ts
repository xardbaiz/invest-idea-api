import {QdrantVectorService, VectorStoreService} from "./qdrant.service.js";
import {VectraVectorService} from "./vectra.service.js";

export function createVectorStoreService(): VectorStoreService {
    const qdrantUrl = process.env.QDRANT_URL;
    const qdrantApiKey = process.env.QDRANT_API_KEY;
    const qdrantCollection = process.env.QDRANT_COLLECTION;
    const qdrantEmbeddingModel = process.env.QDRANT_EMBEDDING_MODEL;

    if (qdrantUrl || qdrantApiKey || qdrantEmbeddingModel) {
        return new QdrantVectorService(qdrantUrl, qdrantApiKey, qdrantCollection, qdrantEmbeddingModel);
    }

    return new VectraVectorService();
}
