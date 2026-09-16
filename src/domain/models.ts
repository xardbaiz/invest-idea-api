export interface InvestmentIdeaInfo {
    id?: string;
    provider?: string;
    ticker: string;
    companyName: string;
    title: string;
    targetPrice: number;
    currency: string;
    description: string;
    publishDate?: string;
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

export interface QuoteDetails {
    ticker: string;
    bap: number;
    bbp: number;
    ClosePrice: number;
    ltp: number;
}
