import {createMcpExpressApp} from "@modelcontextprotocol/express";
import {getServer} from "./mcp.factory.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {AiService} from "./domain/services/ai.service.js";
import 'dotenv/config';

if (process.env.MCP_SERVER_HTTP_TRANSPORT_ENABLED === 'true') {
    const app = createMcpExpressApp({
        allowedHosts: ['localhost', '127.0.0.1', 'invest-idea-api.onrender.com', 'onrender.com']
    });
    const expressPort = process.env.PORT ?? 3000;
    const server = getServer();
    const transport: NodeStreamableHTTPServerTransport = new NodeStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
    });
    await server.connect(transport);

    app.post('/mcp', async (req: any, res: any) => {
        try {
            await transport.handleRequest(req, res, req.body);
            res.on('close', () => {
                console.log('Request closed');
                transport.close();
                server.close();
            });
        } catch (error) {
            console.error('Error handling MCP request:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32_603,
                        message: 'Internal server error'
                    },
                    id: null
                });
            }
        }
    });

    const repo = createRepository();
    const aiService = new AiService(
        process.env.OPENAI_API_KEY ?? 'lmstudio',
        process.env.OPENAI_BASE_URL ?? 'http://127.0.0.1:1234/v1',
    );

    // GET /ideas?query=...&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10
    app.get('/ideas', async (req: any, res: any) => {
        const {query, from, to, limit} = req.query;
        if (!query) {
            return res.status(400).send('Missing required query parameter: query');
        }
        try {
            const queryEmbedding = await aiService.generateEmbedding(query);
            const results = await repo.searchSimilar(queryEmbedding, Number(limit) || 10, from, to);
            const text = results.map((r, i) =>
                `#${i + 1} [${r.idea.ticker}] ${r.idea.companyName}\n` +
                `   ${r.idea.title}\n` +
                `   Price target: ${r.idea.targetPrice} ${r.idea.currency}\n` +
                `   Distance: ${r.distance.toFixed(4)}\n` +
                `   ${r.idea.description?.slice(0, 200)}...`
            ).join('\n\n');
            res.type('text/plain').send(text || 'No results found.');
        } catch (e: any) {
            console.error('GET /ideas error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /topics?from=YYYY-MM-DD&to=YYYY-MM-DD&hint=healthcare
    app.get('/topics', async (req: any, res: any) => {
        const {from, to, hint} = req.query;
        if (!from || !to) {
            return res.status(400).send('Missing required query parameters: from, to');
        }
        try {
            const titles = await repo.findTitlesByDateRange(from, to);
            const topics = await aiService.discoverTopics(titles, hint);
            const text = topics.map((t, i) =>
                `#${i + 1} ${t.topic} (${t.count} ideas)\n` +
                `   Query: ${t.suggestedQuery}`
            ).join('\n\n');
            res.type('text/plain').send(text || 'No topics found for this date range.');
        } catch (e: any) {
            console.error('GET /topics error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    app.get('/mcp', async (req: any, res: any) => {
        console.log('Received GET MCP request');
        res.writeHead(405).end(
            JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32_000,
                    message: 'App is healthy, but method not allowed.'
                },
                id: null
            })
        );
    });

    app.listen(expressPort, (error: any) => {
        if (error) {
            console.error('Failed to start server:', error);
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        }
        console.log(`MCP Stateless Streamable HTTP Server listening on port ${expressPort}`);
    });
}

// Handle server shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
});
