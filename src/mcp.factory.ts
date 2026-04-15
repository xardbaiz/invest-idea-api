import {McpServer} from "@modelcontextprotocol/server";
import {InvestmentIdeaInfo} from "./domain/models.js";
import {Repository} from "./outbound/persistence/repository.js";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {z} from "zod";

export const getServer = () => {
    let repo: Repository = createRepository();
    const server = new McpServer(
        {name: "invest-idea-api", version: "1.0.0"},
        {
            instructions: 'Always call `list_categories` function before running `list_by_category`.'
        }
    );

    // --- Register Tools ---
    server.registerTool(
        "list_categories",
        {
            description: "Returns a list of all unique investment idea categories."
        },
        async () => {
            const categories = await repo.findAllCategories();
            return {
                content: [{type: "text", text: JSON.stringify(categories)}]
            };
        }
    );
    server.registerTool(
        "list_by_category",
        {
            description: "Lists stored ideas for a specific category.",
            inputSchema: z.object({
                category: z.string().describe("The category to filter by"),
                from: z.string().optional().describe("Start date(inclusive). Mandatory format: `YYYY-MM-DD`"),
                to: z.string().optional().describe("End date(inclusive). Mandatory format: `YYYY-MM-DD`"),
            }),
        },
        async ({category, from, to}) => {
            const ideas = await repo.findByCategory(category, from, to);
            const ideasShortInfo: InvestmentIdeaInfo[] = ideas.map(({
                                                                        ticker,
                                                                        companyName,
                                                                        title,
                                                                        targetPrice,
                                                                        currency,
                                                                        description
                                                                    }) => ({
                ticker,
                companyName,
                title,
                targetPrice,
                currency,
                description
            }));
            return {content: [{type: "text", text: JSON.stringify(ideasShortInfo)}]};
        }
    );
    return server;
}