import {VectorSearchResult, VectorStoreService} from "./qdrant.service.js";

interface StoredVector {
    ideaId: string;
    embedding: number[];
    publishDate?: string;
    publishTimestamp?: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class InMemoryVectorService implements VectorStoreService {
    private vectors: Map<string, StoredVector> = new Map();

    async hasEmbedding(ideaId: string): Promise<boolean> {
        return this.vectors.has(ideaId);
    }

    async saveEmbedding(ideaId: string, embedding: number[], publishDate?: string): Promise<void> {
        const publishTimestamp = publishDate ? new Date(publishDate).getTime() : undefined;
        this.vectors.set(ideaId, {
            ideaId,
            embedding,
            publishDate,
            publishTimestamp,
        });
    }

    async searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<VectorSearchResult[]> {
        const fromTs = from ? new Date(from).getTime() : undefined;
        const toTs = to ? new Date(to).getTime() : undefined;

        const results: VectorSearchResult[] = [];

        for (const item of this.vectors.values()) {
            if (fromTs !== undefined && !isNaN(fromTs)) {
                if (!item.publishTimestamp || item.publishTimestamp < fromTs) {
                    continue;
                }
            }
            if (toTs !== undefined && !isNaN(toTs)) {
                if (!item.publishTimestamp || item.publishTimestamp > toTs) {
                    continue;
                }
            }

            const distance = cosineSimilarity(queryEmbedding, item.embedding);
            results.push({
                ideaId: item.ideaId,
                distance,
            });
        }

        results.sort((a, b) => b.distance - a.distance);
        return results.slice(0, limit);
    }
}
