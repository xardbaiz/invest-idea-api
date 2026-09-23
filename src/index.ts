import {SyncScheduler} from "./domain/services/sync-scheduler.js";
import {Repository} from "./outbound/persistence/repository.js";
import 'dotenv/config';
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {createVectorStoreService} from "./outbound/vector/vector-store.factory.js";
import {getMcpServer} from "./mcp.factory.js";
import {StdioServerTransport} from "@modelcontextprotocol/server/stdio";

// --- Configuration ---
let repo: Repository = createRepository();
let vectorStore = createVectorStoreService();

if (process.env.SYNC_JOB_ENABLED === 'true') {
    const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 2 * 60 * 1000); // each two minutes
    const SYNC_BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE ?? 5);
    const syncScheduler = new SyncScheduler(repo, vectorStore);
    syncScheduler.start(SYNC_INTERVAL_MS, SYNC_BATCH_SIZE);
}

if (process.env.MCP_SERVER_STDIO_TRANSPORT_ENABLED === 'true') {
    try {
        const stdioTransport = new StdioServerTransport();
        await getMcpServer().connect(stdioTransport);
        console.info("MCP Server started on Stdio transport");
    } catch (err) {
        console.error("Failed to start MCP StdIO server:", err);
        process.exit(1);
    }
}