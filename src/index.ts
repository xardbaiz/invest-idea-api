import {InvestmentIdeaInfo} from "./domain/models.js";
import {SqlLiteIdeaRepository} from "./outbound/persistence/sqlite.repository.js";
import {SyncScheduler} from "./domain/services/sync-scheduler.js";
import {Repository} from "./outbound/persistence/repository.js";
import 'dotenv/config';
import {z} from "zod";
import {SupabaseIdeaRepository} from "./outbound/persistence/supabase.repository.js";
import {McpServer, StdioServerTransport} from "@modelcontextprotocol/server";

// --- Configuration ---
let repo: Repository;
const supabaseUrl = process.env.SUPABASE_PUBLIC_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_PUBLISHABLE_KEY;
if (supabaseUrl && supabaseKey) {
    repo = new SupabaseIdeaRepository(supabaseUrl, supabaseKey)
} else {
    repo = new SqlLiteIdeaRepository();
}

if (process.env.SYNC_JOB_ENABLED === 'true') {
    const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 2 * 60 * 1000); // each two minutes
    const SYNC_BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE ?? 5);
    const syncScheduler = new SyncScheduler(repo);
    syncScheduler.start(SYNC_INTERVAL_MS, SYNC_BATCH_SIZE);
}


if (process.env.MCP_SERVER_ENABLED === 'true') {
    // --- MCP Server Implementation ---
    const server = new McpServer(
        {name: "invest-idea-api", version: "1.0.0"},
        {
            instructions: 'Always call list_categories before running list_by_category.'
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
                from: z.string().optional().describe("Start date(inclusive) YYYY-MM-DD"),
                to: z.string().optional().describe("End date(inclusive) YYYY-MM-DD"),
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

    const startTransports = async () => {
        if (process.env.MCP_SERVER_STDIO_TRANSPORT_ENABLED === 'true') {
            const stdioTransport = new StdioServerTransport();
            await server.connect(stdioTransport);
            console.info("MCP Server started on Stdio transport");
        }
    }

    startTransports().catch((err) => {
        console.error("Failed to start MCP server:", err);
        process.exit(1);
    });
}