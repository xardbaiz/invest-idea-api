import {InvestmentIdea, SearchResult} from "../../domain/models.js";

export interface Repository {
    upsert(idea: InvestmentIdea): Promise<void>;

    findById(id: string): Promise<InvestmentIdea | undefined>;

    hasEmbedding(ideaId: string): Promise<boolean>;

    saveEmbedding(ideaId: string, embedding: number[]): Promise<void>;

    searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<SearchResult[]>;
}
