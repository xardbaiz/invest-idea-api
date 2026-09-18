import {QdrantClient} from '@qdrant/js-client-rest';
import crypto from 'node:crypto';

export interface VectorSearchResult {
    ideaId: string;
    distance: number;
}

export interface VectorStoreService {
    hasEmbedding(ideaId: string): Promise<boolean>;
    saveEmbedding(ideaId: string, embedding: number[], publishDate?: string): Promise<void>;
    searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<VectorSearchResult[]>;
}

const timestampIndexFieldName = 'publish_timestamp';
export class QdrantVectorService implements VectorStoreService {
    private client: QdrantClient;
    private collectionName: string;
    private isCollectionExist = false;

    constructor(
        url?: string,
        apiKey?: string,
        collectionName?: string
    ) {
        const qdrantUrl = url ?? process.env.QDRANT_URL ?? 'http://localhost:6333';
        const qdrantApiKey = apiKey ?? process.env.QDRANT_API_KEY;
        this.collectionName = collectionName ?? process.env.QDRANT_COLLECTION ?? 'invest_ideas';

        this.client = new QdrantClient({
            url: qdrantUrl,
            apiKey: qdrantApiKey,
            checkCompatibility: false,
        });
    }

    async saveEmbedding(ideaId: string, embedding: number[], publishDate?: string): Promise<void> {
        await this.ensureCollection(embedding.length);

        const pointId = this.stringToUuid(ideaId);
        const payload: Record<string, any> = {
            idea_id: ideaId,
        };
        if (publishDate) {
            payload.publish_date = publishDate;
            payload[timestampIndexFieldName] = new Date(publishDate).getTime();
        }

        await this.client.upsert(this.collectionName, {
            wait: true,
            points: [
                {
                    id: pointId,
                    vector: embedding,
                    payload,
                },
            ],
        });
    }

    private stringToUuid(str: string): string {
        const hash = crypto.createHash('sha256').update(str).digest('hex');
        return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-8${hash.substring(17, 20)}-${hash.substring(20, 32)}`;
    }

    async hasEmbedding(ideaId: string): Promise<boolean> {
        try {
            const pointId = this.stringToUuid(ideaId);
            const points = await this.client.retrieve(this.collectionName, {
                ids: [pointId],
                with_payload: false,
                with_vector: false,
            });
            return points.length > 0;
        } catch (e) {
            return false;
        }
    }

    async searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<VectorSearchResult[]> {
        await this.ensureCollection(queryEmbedding.length);

        const filterConditions: any[] = [];

        if (from) {
            const fromTs = new Date(from).getTime();
            if (!isNaN(fromTs)) {
                filterConditions.push({
                    key: timestampIndexFieldName,
                    range: { gte: fromTs },
                });
            }
        }

        if (to) {
            const toTs = new Date(to).getTime();
            if (!isNaN(toTs)) {
                filterConditions.push({
                    key: timestampIndexFieldName,
                    range: { lte: toTs },
                });
            }
        }

        const filter = filterConditions.length > 0 ? { must: filterConditions } : undefined;

        const results = await this.client.query(this.collectionName, {
            query: queryEmbedding,
            limit,
            filter,
            with_payload: true,
        });

        return (results.points ?? []).map((point) => {
            const ideaId = (point.payload?.idea_id as string) ?? String(point.id);
            return {
                ideaId,
                distance: point.score,
            };
        });
    }

    private async ensureCollection(vectorSize: number): Promise<void> {
        if (this.isCollectionExist) return;
        try {
            const exists = await this.client.collectionExists(this.collectionName);
            if (!exists.exists) {
                await this.client.createCollection(this.collectionName, {
                    vectors: {
                        size: vectorSize,
                        distance: 'Cosine',
                    },
                });
            }
            this.isCollectionExist = true;

            await this.client.createPayloadIndex(this.collectionName, {
                field_name: timestampIndexFieldName,
                field_schema: {
                    type: "integer",
                    lookup: true,
                    range: true,
                },
            });
        } catch (e) {
            console.warn(`Failed to ensure Qdrant collection ${this.collectionName}:`, e);
        }
    }
}
