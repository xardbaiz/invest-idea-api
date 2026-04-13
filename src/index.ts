import {SyncScheduler} from "./domain/services/sync-scheduler.js";
import {Repository} from "./outbound/persistence/repository.js";
import 'dotenv/config';
import {StdioServerTransport} from "@modelcontextprotocol/server";
import {getRepository} from "./outbound/persistence/repo-getter.js";
import {getServer} from "./mcp-server-factory.js";

// --- Configuration ---
let repo: Repository = getRepository();

if (process.env.SYNC_JOB_ENABLED === 'true') {
    const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 2 * 60 * 1000); // each two minutes
    const SYNC_BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE ?? 5);
    const syncScheduler = new SyncScheduler(repo);
    syncScheduler.start(SYNC_INTERVAL_MS, SYNC_BATCH_SIZE);
}

if (process.env.MCP_SERVER_ENABLED === 'true') {
    const startTransports = async () => {
        if (process.env.MCP_SERVER_STDIO_TRANSPORT_ENABLED === 'true') {
            const stdioTransport = new StdioServerTransport();
            await getServer().connect(stdioTransport);
            console.info("MCP Server started on Stdio transport");
        }
    }

    startTransports().catch((err) => {
        console.error("Failed to start MCP server:", err);
        process.exit(1);
    });
}