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
            this.sanitize(data.details.about),
            this.sanitize(data.details.idea),
            //this.sanitize(data.details.likeReason) // It's too detailed, including sources and links
        ]
            .filter(Boolean)
            .join('\n')
            .trim();

        return details || undefined;
    }

    private sanitize(data?: any): string {
        if (!data) return '';
        if (typeof data === 'object') data = JSON.stringify(data);
        if (typeof data !== 'string') data = data.toString();
        return data.replaceAll(/<[^>]*>/g, '');
    }
}