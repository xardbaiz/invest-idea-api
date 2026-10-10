import {InvestmentIdea, QuoteDetails} from "../models.js";

export interface InvestmentProvider {
    readonly name: string;

    getIdeaUrl(ideaId: string): string;

    getLogoByTicker(ticker: string): string;

    fetchIdeas(skip: number, take: number): Promise<InvestmentIdea[]>;

    getDetails(id: string): Promise<string | undefined>;

    getQuoteDetails(tickers: string[]): Promise<QuoteDetails[]>;

    getPraamsStockInfoByTicker?(ticker: string): Promise<any>;

    getQuoteCardInfo?(ticker: string): Promise<any>;
}
