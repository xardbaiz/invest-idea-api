import {InvestmentIdea} from "../../domain/models";

export interface Repository {
    upsert(idea: InvestmentIdea): void;

    findById(id: string): InvestmentIdea | undefined

    findCategoriesByIdeaId(id: string): string[] | undefined

    findByCategory(category: string, from?: string, to?: string): InvestmentIdea[]
}