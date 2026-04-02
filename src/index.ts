import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {CallToolRequestSchema, ListToolsRequestSchema} from "@modelcontextprotocol/sdk/types.js";
import {IdeaRepository} from "./outbound/persistence/sqlite.repository";
import {SyncScheduler} from "./domain/services/sync-scheduler";
import {Repository} from "./outbound/persistence/repository";
import 'dotenv/config';

// --- Configuration ---
const repo: Repository = new IdeaRepository();
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
                    // TODO period - filter should be optional period of time
                    category: {type: "string"}
                },
                required: ["category"]
            }
        }
    ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const {name, arguments: args} = request.params;

    if (name === "list_by_category") {
        const ideas = repo.findByCategory(args?.category as string)
        return {content: [{type: "text", text: JSON.stringify(ideas, null, 2)}]};
    }

    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
server.connect(transport).then(
    // nothing
)