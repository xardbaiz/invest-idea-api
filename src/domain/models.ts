export interface InvestmentIdeaInfo {
    ticker: string;
    companyName: string;
    title: string;
    targetPrice: number;
    currency: string;
    description: string;
}

export interface InvestmentIdea extends InvestmentIdeaInfo {
    id: string;
    provider: string;
    publishDate: string;
}

export interface SearchResult {
    idea: InvestmentIdeaInfo;
    distance: number;
}
