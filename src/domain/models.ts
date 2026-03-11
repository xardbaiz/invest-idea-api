export interface InvestmentIdea {
    id: string; // Универсальный ID (напр. "tradernet_20394")
    provider: string; // 'tradernet', 'bloomberg' и т.д.
    ticker: string;
    companyName: string;
    title: string;
    description: string;
    targetPrice: number;
    currency: string;
    categories: string[]; // Массив категорий по твоему запросу
    publishDate: string;
}