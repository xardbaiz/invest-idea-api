import {AiService} from "./ai.service.js";
import {CompanyInfo, Repository} from "../../outbound/persistence/repository.js";
import {VectorStoreService} from "../../outbound/vector/qdrant.service.js";
import {InvestmentIdea, QuoteDetails, SearchResult} from "../models.js";
import {createDefaultProviderRegistry, ProviderRegistry} from "./provider.registry.js";

export class ApiService {
    constructor(
        private readonly repo: Repository,
        private readonly aiService: AiService,
        private readonly vectorStore: VectorStoreService,
        private readonly providerRegistry: ProviderRegistry = createDefaultProviderRegistry(),
    ) {
    }

    getIdeaUrl(providerName?: string, ideaId?: string): string {
        return this.providerRegistry.getIdeaUrl(providerName, ideaId);
    }

    getLogoByTicker(ticker: string, providerName: string = 'tradernet'): string {
        const provider = this.providerRegistry.getProvider(providerName);
        if (!provider) {
            return '';
        }
        return provider.getLogoByTicker(ticker);
    }

    async searchCompanies(query: string): Promise<CompanyInfo[]> {
        const companies = await this.repo.findUniqueCompanies(query);
        return companies.map(c => ({
            ...c,
            logoUrl: c.ticker ? this.getLogoByTicker(c.ticker) : undefined,
        }));
    }

    async getIdeasByCompany(companyOrTicker: string): Promise<InvestmentIdea[]> {
        return this.repo.findIdeasByCompany(companyOrTicker);
    }

    async searchIdeas(query: string, limit: number = 10, from?: string, to?: string): Promise<SearchResult[]> {
        let vectorResults;
        if (this.vectorStore.isSupportInference()) {
            vectorResults = await this.vectorStore.searchSimilar(query, limit, from, to);
        } else {
            const queryEmbedding = await this.aiService.generateEmbedding(query);
            vectorResults = await this.vectorStore.searchSimilar(queryEmbedding, limit, from, to);
        }

        if (vectorResults.length === 0) {
            return [];
        }

        const ideaIds = vectorResults.map(r => r.ideaId);
        const ideas = await this.repo.findByIds(ideaIds);
        const ideaMap = new Map(ideas.map(idea => [idea.id, idea]));

        const results: SearchResult[] = [];
        for (const vr of vectorResults) {
            const idea = ideaMap.get(vr.ideaId);
            if (idea) {
                results.push({
                    idea,
                    distance: vr.distance,
                });
            }
        }

        return results.sort((a, b) => {
            if (b.distance !== a.distance) {
                return b.distance - a.distance;
            }
            const dateA = a.idea.publishDate ? new Date(a.idea.publishDate).getTime() : 0;
            const dateB = b.idea.publishDate ? new Date(b.idea.publishDate).getTime() : 0;
            return dateB - dateA;
        });
    }

    async getQuoteDetails(tickers: string[], providerName: string = 'tradernet'): Promise<QuoteDetails[]> {
        const provider = this.providerRegistry.getProvider(providerName);
        if (!provider) {
            return [];
        }
        return provider.getQuoteDetails(tickers);
    }
}
