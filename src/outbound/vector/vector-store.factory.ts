import {QdrantVectorService, VectorStoreService} from "./qdrant.service.js";
import {VectraVectorService} from "./vectra.service.js";

export function createVectorStoreService(): VectorStoreService {
    const qdrantUrl = process.env.QDRANT_URL;
    const qdrantApiKey = process.env.QDRANT_API_KEY;

    if (qdrantUrl || qdrantApiKey) {
        return new QdrantVectorService(qdrantUrl, qdrantApiKey);
    }

    return new VectraVectorService();
}
