import {InvestmentIdea, QuoteDetails} from "../../domain/models.js";
import {InvestmentProvider} from "../../domain/services/investment-provider.js";

export class TradernetProvider implements InvestmentProvider {
    readonly name = 'tradernet';
    private readonly host = 'https://tradernet.com';
    private readonly apiUrl = this.host + '/api';

    getIdeaUrl(ideaId: string): string {
        if (!ideaId) {
            return '#';
        }
        const prefix = `${this.name}_`;
        const rawId = ideaId.toLowerCase().startsWith(prefix)
            ? ideaId.slice(prefix.length)
            : ideaId;

        return `https://freedom24.com/ideas/details/${rawId}`;
    }

    getLogoByTicker(ticker: string): string {
        return `${this.host}/logos/get-logo-by-ticker?ticker=${encodeURIComponent(ticker.toLowerCase())}`;
    }

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
            provider: this.name,
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

    async getPraamsStockInfoByTicker(ticker: string): Promise<{
        risk: {
            characteristic?: string;
            scores: Record<string, number>;
            factors: any[];
        };
        return: {
            characteristic?: string;
            scores: Record<string, number>;
            factors: any[];
        };
    }> {
        const data = await this.sendApiRequest("getPraamsStockInfoByTicker", { ticker });
        const generalData = data?.generalData || {};
        const scores = generalData.scores || {};
        const keyFactors = generalData.keyFactors || {};

        const riskKeys = ['countryRisk', 'volatility', 'stressTest', 'liquidity', 'solvency', 'other'];
        const returnKeys = ['dividends', 'growthMom', 'valuation', 'analystView', 'performance', 'profitability'];

        const riskScores: Record<string, number> = {};
        for (const k of riskKeys) {
            if (k in scores) riskScores[k] = scores[k];
        }

        const returnScores: Record<string, number> = {};
        for (const k of returnKeys) {
            if (k in scores) returnScores[k] = scores[k];
        }

        return {
            risk: {
                characteristic: keyFactors.risk?.characteristic,
                scores: riskScores,
                factors: keyFactors.risk?.factors || []
            },
            return: {
                characteristic: keyFactors.return?.characteristic,
                scores: returnScores,
                factors: keyFactors.return?.factors || []
            }
        };
    }

    async getQuoteCardInfo(ticker: string): Promise<any> {
        const data = await this.sendApiRequest("getQuoteCardInfo", { ticker });
        return data;
    }

    private async sendApiRequest(cmd: string, params: Record<string, any>): Promise<any> {
        const response = await fetch(`${this.apiUrl}?cmd=${cmd}`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `q=${encodeURIComponent(JSON.stringify({
                cmd,
                params
            }))}`
        });

        if (!response.ok) {
            throw new Error(`Tradernet request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
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

export const TradernetClient = TradernetProvider;
