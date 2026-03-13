import {InvestmentIdea} from "../../domain/models";

export class TradernetClient {
    private readonly url = 'https://tradernet.com/api';

    async fetchIdeas(skip: number, take: number): Promise<InvestmentIdea[]> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `q=${encodeURIComponent(JSON.stringify({
                cmd: "getInvestIdeas",
                params: {page: {skip, take}}
            }))}`
        });

        if (!response.ok) {
            throw new Error(`Tradernet request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as { list?: any[] };

        return (data.list || []).map((item: any): InvestmentIdea => ({
            id: `${item.id}`,
            provider: 'tradernet',
            ticker: item.ticker,
            companyName: item.company,
            title: item.title,
            description: this.sanitize(item.about),
            targetPrice: parseFloat(item.targetPrice.replace(/\s/g, '')),
            currency: item.currency,
            categories: [],
            publishDate: item.rawDate
        }));
    }

    async getDetails(id: string): Promise<string | undefined> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `q=${encodeURIComponent(JSON.stringify({
                cmd: "getInvestIdeaDetails",
                params: {id: id},
            }))}`
        });

        if (!response.ok) {
            throw new Error(`Tradernet request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json()
        const details: string = [
            this.sanitize(data.about),
            this.sanitize(data.idea),
            this.sanitize(data.likeReason)
        ]
            .filter(Boolean)
            .join('\n')
            .trim();

        return details || undefined;
    }

    private sanitize(text?: any): string {
        if (!text || typeof text !== 'string') return '';
        return text.replaceAll(/<[^>]*>/g, '');
    }
}