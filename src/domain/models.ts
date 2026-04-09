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
    categories: string[];
    publishDate: string;
}