import {InvestmentIdea, QuoteDetails} from "../../domain/models.js";

export class TradernetClient {
    private readonly host = 'https://tradernet.com';
    private readonly apiUrl = this.host + '/api';

    async fetchIdeas(skip: number, take: number): Promise<InvestmentIdea[]> {
        const response = await fetch(this.apiUrl, {
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
            targetPrice: this.parseFloatFromStr(item.targetPrice, 0)!!,
            currency: item.currency,
            publishDate: item.rawDate
        }));
    }

    async getDetails(id: string): Promise<string | undefined> {
        const data = await this.fetchIdea(id);
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

    async getQuoteDetails(tickers: string[]): Promise<QuoteDetails[]> {
        const response = await fetch(
            this.host + `/securities/export?tickers=${encodeURIComponent(tickers.join(' '))}`
        );

        if (!response.ok) {
            throw new Error(`Tradernet request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as any[];
        return data.map((q): QuoteDetails => ({
            ticker: q.c,
            bap: q.bap,
            bbp: q.bbp,
            ClosePrice: q.ClosePrice,
            ltp: q.ltp,
        }));
    }

    private async fetchIdea(id: string): Promise<any> {
        const response = await fetch(this.apiUrl, {
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

        return await response.json();
    }

    private sanitize(data?: any): string {
        if (!data) return '';
        if (typeof data === 'object') data = JSON.stringify(data);
        if (typeof data !== 'string') data = data.toString();
        return data.replaceAll(/<[^>]*>/g, '');
    }

    private parseFloatFromStr(floatStr: string, def: number | undefined) {
        return floatStr ? Number.parseFloat(floatStr.replace(/\s/g, '')) : def;
    }
}