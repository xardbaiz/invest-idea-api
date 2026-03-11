import {InvestmentIdea} from "../../domain/models";

export class TradernetClient {
    private readonly url = 'https://tradernet.com/api';

    async fetchIdeas(skip: number, take: number): Promise<InvestmentIdea[]> {
        const query = {
            cmd: "getInvestIdeas",
            params: {page: {skip, take}}
        };

        const response = await fetch(this.url, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `q=${encodeURIComponent(JSON.stringify(query))}`
        });

        if (!response.ok) {
            throw new Error(`Tradernet request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as { list?: any[] };

        // Маппинг внешних данных в доменную модель
        return (data.list || []).map((item: any): InvestmentIdea => ({
            id: `tradernet_${item.id}`,
            provider: 'tradernet',
            ticker: item.ticker,
            companyName: item.company,
            title: item.title,
            description: item.about.replace(/<[^>]*>/g, ''), // Чистим HTML
            targetPrice: parseFloat(item.targetPrice.replace(/\s/g, '')),
            currency: item.currency,
            categories: [], // Категории заполнит AI позже
            publishDate: item.rawDate
        }));
    }
}