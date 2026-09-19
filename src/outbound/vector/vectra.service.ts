import {LocalIndex} from 'vectra';
import path from 'node:path';
import {VectorSearchResult, VectorStoreService} from './qdrant.service.js';
import {INVEST_IDEA_DETAILS_MARK} from "../../domain/constants.js";

export class VectraVectorService implements VectorStoreService {
    private index: LocalIndex;
    private initialized = false;

    constructor(indexPath?: string) {
        const folderPath = indexPath ?? process.env.VECTRA_INDEX_PATH ?? path.join(process.cwd(), 'vectra_index');
        this.index = new LocalIndex(folderPath);
    }

    isSupportInference(): boolean {
        return false;
    }

    private async ensureIndex(): Promise<void> {
        if (this.initialized) return;
        if (!await this.index.isIndexCreated()) {
            await this.index.createIndex();
        }
        this.initialized = true;
    }

    async hasEmbedding(ideaId: string): Promise<boolean> {
        await this.ensureIndex();
        const existing = await this.index.listItemsByMetadata({ ideaId });
        return existing.length > 0;
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

        if (!embedding || !Array.isArray(embedding)) {
            throw new Error("VectraVectorService does not support server-side inference. Embedding array is required.");
        }

        await this.ensureIndex();
        const publishTimestamp = actualPublishDate ? new Date(actualPublishDate).getTime() : undefined;
        const metadata: Record<string, any> = { ideaId };
        if (actualPublishDate) metadata.publishDate = actualPublishDate;
        if (publishTimestamp !== undefined && !Number.isNaN(publishTimestamp)) {
            metadata.publishTimestamp = publishTimestamp;
        }
        if (!text.includes(INVEST_IDEA_DETAILS_MARK)) {
            metadata.text = text;
        }

        const existing = await this.index.listItemsByMetadata({ ideaId });
        if (existing.length > 0) {
            await this.index.upsertItem({
                id: existing[0].id,
                vector: embedding,
                metadata,
            });
        } else {
            await this.index.insertItem({
                vector: embedding,
                metadata,
            });
        }
    }

    async searchSimilar(
        query: string | number[],
        limit: number,
        from?: string,
        to?: string
    ): Promise<VectorSearchResult[]> {
        if (typeof query === 'string') {
            throw new Error("VectraVectorService does not support server-side inference. Query vector array is required.");
        }
        await this.ensureIndex();

        const fromTs = from ? new Date(from).getTime() : undefined;
        const toTs = to ? new Date(to).getTime() : undefined;

        let filter: Record<string, any> | undefined;

        if (fromTs !== undefined && !Number.isNaN(fromTs) && toTs !== undefined && !Number.isNaN(toTs)) {
            filter = { publishTimestamp: { $gte: fromTs, $lte: toTs } };
        } else if (fromTs !== undefined && !Number.isNaN(fromTs)) {
            filter = { publishTimestamp: { $gte: fromTs } };
        } else if (toTs !== undefined && !Number.isNaN(toTs)) {
            filter = { publishTimestamp: { $lte: toTs } };
        }

        const queryResults = await this.index.queryItems(query, '', limit, filter);

        return queryResults.map(res => ({
            ideaId: (res.item.metadata?.ideaId as string) ?? res.item.id,
            distance: res.score,
        }));
    }
}
