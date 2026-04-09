import {InvestmentIdea} from "../../domain/models";

export interface Repository {
    upsert(idea: InvestmentIdea): Promise<void>;

    findById(id: string): Promise<InvestmentIdea | undefined>

    findCategoriesByIdeaId(id: string): Promise<string[] | undefined>

    findByCategory(category: string, from?: string, to?: string): Promise<InvestmentIdea[]>

    findAllCategories(): Promise<string[]>
}