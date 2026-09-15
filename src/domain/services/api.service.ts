import {AiService, TopicSuggestion} from "./ai.service.js";
import {Repository} from "../../outbound/persistence/repository.js";
import {SearchResult} from "../models.js";

export class ApiService {
    constructor(
        private readonly repo: Repository,
        private readonly aiService: AiService
    ) {
    }

    async searchIdeas(query: string, limit: number = 10, from?: string, to?: string): Promise<SearchResult[]> {
        const queryEmbedding = await this.aiService.generateEmbedding(query);
        const results = await this.repo.searchSimilar(queryEmbedding, limit, from, to);
        return results.sort((a, b) => {
            if (b.distance !== a.distance) {
                return b.distance - a.distance;
            }
            const dateA = a.idea.publishDate ? new Date(a.idea.publishDate).getTime() : 0;
            const dateB = b.idea.publishDate ? new Date(b.idea.publishDate).getTime() : 0;
            return dateB - dateA;
        });
    }

    async discoverTopics(from: string, to: string, hint?: string): Promise<TopicSuggestion[]> {
        const titles = await this.repo.findTitlesByDateRange(from, to);
        return await this.aiService.discoverTopics(titles, hint);
    }
}
