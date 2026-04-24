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
        return await this.repo.searchSimilar(queryEmbedding, limit, from, to);
    }

    async discoverTopics(from: string, to: string, hint?: string): Promise<TopicSuggestion[]> {
        const titles = await this.repo.findTitlesByDateRange(from, to);
        return await this.aiService.discoverTopics(titles, hint);
    }
}
