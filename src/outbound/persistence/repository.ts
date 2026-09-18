import {InvestmentIdea} from "../../domain/models.js";

export interface Repository {
    upsert(idea: InvestmentIdea): Promise<void>;

    findById(id: string): Promise<InvestmentIdea | undefined>;

    findByIds(ids: string[]): Promise<InvestmentIdea[]>;

    findTitlesByDateRange(from: string, to: string): Promise<string[]>;
}
