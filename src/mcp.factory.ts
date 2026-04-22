import {McpServer} from "@modelcontextprotocol/server";
import {Repository} from "./outbound/persistence/repository.js";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {EmbeddingService} from "./domain/services/embedding.service.js";
import {z} from "zod";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "http://127.0.0.1:1234/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "lmstudio";

export const getServer = () => {
    const repo: Repository = createRepository();
    const embeddingService = new EmbeddingService(OPENAI_API_KEY, OPENAI_BASE_URL);

    const server = new McpServer(
        {name: "invest-idea-api", version: "1.0.0"},
        {
            instructions: 'Use search_ideas to find investment ideas by semantic query. Optionally filter by date range.'
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
            const queryEmbedding = await embeddingService.generate(query);
            const results = await repo.searchSimilar(queryEmbedding, limit ?? 10, from, to);
            return {content: [{type: "text", text: JSON.stringify(results)}]};
        }
    );

    return server;
}
