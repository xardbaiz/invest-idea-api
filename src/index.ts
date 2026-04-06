import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {CallToolRequestSchema, ListToolsRequestSchema} from "@modelcontextprotocol/sdk/types.js";
import {SqlLiteIdeaRepository} from "./outbound/persistence/sqlite.repository";
import {SyncScheduler} from "./domain/services/sync-scheduler";
import {Repository} from "./outbound/persistence/repository";
import 'dotenv/config';
import {SupabaseIdeaRepository} from "./outbound/persistence/supabase.repository";

// --- Configuration ---
let repo: Repository;
const supabaseUrl = process.env.SUPABASE_PUBLIC_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_PUBLISHABLE_KEY;
if (supabaseUrl && supabaseKey) {
    repo = new SupabaseIdeaRepository(supabaseUrl, supabaseKey)
} else {
    repo = new SqlLiteIdeaRepository();
}

const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 2 * 60 * 1000); // each two minutes
const SYNC_BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE ?? 5);
const syncScheduler = new SyncScheduler(repo);
syncScheduler.start(SYNC_INTERVAL_MS, SYNC_BATCH_SIZE);

// --- MCP Server Setup ---
const server = new Server({name: "invest-idea-api", version: "1.0.0"}, {capabilities: {tools: {}}});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "list_by_category",
            description: "Lists stored ideas for a specific category.",
            inputSchema: {
                type: "object",
                properties: {
                    category: {type: "string"},
                    from: {
                        type: "string",
                        description: "Start date (inclusive)",
                        example: "2025-01-01",
                        format: "date"
                    },
                    to: {
                        type: "string",
                        description: "End date (inclusive)",
                        example: "2025-01-30",
                        format: "date"
                    }
                },
                required: ["category"]
            }
        }
    ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const {name, arguments: args} = request.params;

    if (name === "list_by_category") {
        const ideas = await repo.findByCategory(args?.category as string, args?.from as string | undefined, args?.to as string | undefined)
        return {content: [{type: "text", text: JSON.stringify(ideas, null, 2)}]};
    }

    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
server.connect(transport).then(
    // nothing
)