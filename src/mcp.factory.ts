import {McpServer} from "@modelcontextprotocol/server";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {createAiService} from "./domain/services/ai.service.js";
import {ApiService} from "./domain/services/api.service.js";
import {z} from "zod";

export const getServer = () => {
    const repo = createRepository();
    const aiService = createAiService();
    const apiService = new ApiService(repo, aiService);

    const server = new McpServer(
        {name: "invest-idea-api", version: "1.0.0"},
        {
            instructions: 'Use discover_topics to find popular industry topics for a date range, then use search_ideas with the suggestedQuery to find specific ideas.'
        }
    );

    server.registerTool(
        "search_ideas",
        {
            description: "Semantic search over stored investment ideas. Returns the most relevant ideas matching the query.",
            inputSchema: z.object({
                query: z.string().describe("Search query describing the investment ideas you are looking for"),
                from: z.string().optional().describe("Start date (inclusive). Format: YYYY-MM-DD"),
                to: z.string().optional().describe("End date (inclusive). Format: YYYY-MM-DD"),
                limit: z.number().optional().describe("Max results to return (default 10)"),
            }),
        },
        async ({query, from, to, limit}) => {
            const results = await apiService.searchIdeas(query, limit ?? 10, from, to);
            return {content: [{type: "text", text: JSON.stringify(results)}]};
        }
    );

    server.registerTool(
        "discover_topics",
        {
            description: "Discovers the most popular industry topics among stored investment ideas for a given date range. Returns topics with suggested search queries to use with search_ideas.",
            inputSchema: z.object({
                from: z.string().describe("Start date (inclusive). Format: YYYY-MM-DD"),
                to: z.string().describe("End date (inclusive). Format: YYYY-MM-DD"),
                hint: z.string().optional().describe("Optional focus area to narrow down topics, e.g. 'healthcare' or 'energy'"),
            }),
        },
        async ({from, to, hint}) => {
            const topics = await apiService.discoverTopics(from, to, hint);
            return {content: [{type: "text", text: JSON.stringify(topics)}]};
        }
    );

    return server;
}
