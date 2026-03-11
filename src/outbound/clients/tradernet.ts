import axios from 'axios';
import {InvestmentIdea} from "../../domain/models";

export class TradernetClient {
    private readonly url = 'https://tradernet.com/api?cmd=getInvestIdeas';

    async fetchIdeas(skip: number, take: number): Promise<InvestmentIdea[]> {
        const query = {
            cmd: "getInvestIdeas",
            params: {page: {skip, take}}
        };

        const response = await axios.post(
            this.url,
            `q=${encodeURIComponent(JSON.stringify(query))}`,
            {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
        );

        // Маппинг внешних данных в доменную модель
        return (response.data.list || []).map((item: any): InvestmentIdea => ({
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