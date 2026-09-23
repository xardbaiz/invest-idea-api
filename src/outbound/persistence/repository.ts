import {InvestmentIdea} from "../../domain/models.js";

export interface CompanyInfo {
    ticker: string;
    companyName: string;
    logoUrl?: string;
}

export interface Repository {
    upsert(idea: InvestmentIdea): Promise<void>;

    findById(id: string): Promise<InvestmentIdea | undefined>;

    findByIds(ids: string[]): Promise<InvestmentIdea[]>;

    findTitlesByDateRange(from: string, to: string): Promise<string[]>;

    findUniqueCompanies(query: string): Promise<CompanyInfo[]>;

    findIdeasByCompany(companyOrTicker: string): Promise<InvestmentIdea[]>;
}
