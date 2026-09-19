import {QdrantClient} from '@qdrant/js-client-rest';
import crypto from 'node:crypto';
import {EMBEDDING_DIMENSION, INVEST_IDEA_DETAILS_MARK} from "../../domain/constants.js";

export interface VectorSearchResult {
    ideaId: string;
    distance: number;
}

export interface VectorStoreService {
    isSupportInference(): boolean;
    hasEmbedding(ideaId: string): Promise<boolean>;

    saveEmbedding(ideaId: string, text: string, publishDate?: string): Promise<void>;
    saveEmbedding(ideaId: string, text: string, embedding: number[], publishDate?: string): Promise<void>;

    searchSimilar(queryText: string, limit: number, from?: string, to?: string): Promise<VectorSearchResult[]>;
    searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<VectorSearchResult[]>;
}

const timestampIndexFieldName = 'publish_timestamp';
export class QdrantVectorService implements VectorStoreService {
    private client: QdrantClient;
    private collectionName: string;
    private embeddingModel?: string;
    private isCollectionExist = false;

    constructor(
        url?: string,
        apiKey?: string,
        collectionName?: string,
        embeddingModel?: string
    ) {
        const qdrantUrl = url ?? process.env.QDRANT_URL ?? 'http://localhost:6333';
        const qdrantApiKey = apiKey ?? process.env.QDRANT_API_KEY;
        this.collectionName = collectionName ?? process.env.QDRANT_COLLECTION ?? 'invest_ideas';
        this.embeddingModel = embeddingModel ?? process.env.QDRANT_EMBEDDING_MODEL;

        this.client = new QdrantClient({
            url: qdrantUrl,
            apiKey: qdrantApiKey,
            checkCompatibility: false,
        });
    }

    isSupportInference(): boolean {
        return Boolean(this.embeddingModel);
    }

    async saveEmbedding(
        ideaId: string,
        text: string,
        embeddingOrPublishDate?: number[] | string,
        publishDate?: string
    ): Promise<void> {
        let embedding: number[] | undefined;
        let actualPublishDate: string | undefined;

        if (Array.isArray(embeddingOrPublishDate)) {
            embedding = embeddingOrPublishDate;
            actualPublishDate = publishDate;
        } else if (typeof embeddingOrPublishDate === 'string') {
            actualPublishDate = embeddingOrPublishDate;
        } else {
            actualPublishDate = publishDate;
        }

        let vectorValue: any;
        if (embedding) {
            vectorValue = embedding;
        } else if (this.isSupportInference()) {
            vectorValue = {
                text: text,
                model: this.embeddingModel!,
            };
        } else {
            throw new Error("Embedding array is required when server-side inference is not configured.");
        }

        await this.ensureCollection(Array.isArray(vectorValue) ? vectorValue.length : EMBEDDING_DIMENSION);

        const pointId = this.stringToUuid(ideaId);
        const payload: Record<string, any> = {
            idea_id: ideaId,
        };
        if (!text.includes(INVEST_IDEA_DETAILS_MARK)) {
            payload.text = text;
        }
        if (actualPublishDate) {
            payload.publish_date = actualPublishDate;
            payload[timestampIndexFieldName] = new Date(actualPublishDate).getTime();
        }

        await this.client.upsert(this.collectionName, {
            wait: true,
            points: [
                {
                    id: pointId,
                    vector: vectorValue,
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

    async searchSimilar(
        query: string | number[],
        limit: number,
        from?: string,
        to?: string
    ): Promise<VectorSearchResult[]> {
        let queryValue: any;
        if (typeof query === 'string') {
            if (this.isSupportInference()) {
                queryValue = {
                    text: query,
                    model: this.embeddingModel!,
                };
            } else {
                throw new Error("Server-side inference is not configured for QdrantVectorService.");
            }
        } else {
            queryValue = query;
        }

        await this.ensureCollection(Array.isArray(queryValue) ? queryValue.length : EMBEDDING_DIMENSION);

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
            query: queryValue,
            limit,
            filter,
            with_payload: true,
        });

        return (results.points ?? []).map((point) => {
            const ideaId = (point.payload?.idea_id as string) ?? String(point.id);
            return {
                ideaId,
                distance: (1 - point.score),
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
