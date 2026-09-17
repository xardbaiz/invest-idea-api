import {LocalIndex} from 'vectra';
import path from 'path';
import {VectorSearchResult, VectorStoreService} from './qdrant.service.js';

export class VectraVectorService implements VectorStoreService {
    private index: LocalIndex;
    private initialized = false;

    constructor(indexPath?: string) {
        const folderPath = indexPath ?? process.env.VECTRA_INDEX_PATH ?? path.join(process.cwd(), 'vectra_index');
        this.index = new LocalIndex(folderPath);
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

    async saveEmbedding(ideaId: string, embedding: number[], publishDate?: string): Promise<void> {
        await this.ensureIndex();
        const publishTimestamp = publishDate ? new Date(publishDate).getTime() : undefined;
        const metadata: Record<string, any> = { ideaId };
        if (publishDate) metadata.publishDate = publishDate;
        if (publishTimestamp !== undefined && !isNaN(publishTimestamp)) {
            metadata.publishTimestamp = publishTimestamp;
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

    async searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<VectorSearchResult[]> {
        await this.ensureIndex();

        const fromTs = from ? new Date(from).getTime() : undefined;
        const toTs = to ? new Date(to).getTime() : undefined;

        let filter: Record<string, any> | undefined;

        if (fromTs !== undefined && !isNaN(fromTs) && toTs !== undefined && !isNaN(toTs)) {
            filter = { publishTimestamp: { $gte: fromTs, $lte: toTs } };
        } else if (fromTs !== undefined && !isNaN(fromTs)) {
            filter = { publishTimestamp: { $gte: fromTs } };
        } else if (toTs !== undefined && !isNaN(toTs)) {
            filter = { publishTimestamp: { $lte: toTs } };
        }

        const queryResults = await this.index.queryItems(queryEmbedding, '', limit, filter);

        return queryResults.map(res => ({
            ideaId: (res.item.metadata?.ideaId as string) ?? res.item.id,
            distance: res.score,
        }));
    }
}
