import {createMcpExpressApp} from "@modelcontextprotocol/express";
import {getServer} from "./mcp.factory.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {createAiService} from "./domain/services/ai.service.js";
import {ApiService} from "./domain/services/api.service.js";
import {ProviderUrlService} from "./domain/services/provider-url.service.js";
import {renderIdeasPage} from "./views/ideas-page.js";
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
    const aiService = createAiService();
    const apiService = new ApiService(repo, aiService);
    const providerUrlService = new ProviderUrlService();

    // GET /api/ideas?query=...&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10
    app.get('/api/ideas', async (req: any, res: any) => {
        const {query, from, to, limit} = req.query;
        if (!query) {
            return res.status(400).send('Missing required query parameter: query');
        }
        try {
            const results = await apiService.searchIdeas(query, Number(limit) || 10, from, to);
            const enriched = results.map(r => ({
                ...r,
                url: providerUrlService.getIdeaUrl(r.idea.provider, r.idea.id),
            }));
            res.json(enriched);
        } catch (e: any) {
            console.error('GET /api/ideas error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /ideas -> HTML Page
    app.get('/ideas', async (req: any, res: any) => {
        const { query, from, to, limit } = req.query;
        let ideas: any[] = [];
        let searched = false;

        if (query) {
            searched = true;
            try {
                const results = await apiService.searchIdeas(query, Number(limit) || 10, from, to);
                ideas = results.map(r => ({
                    ticker: r.idea.ticker,
                    companyName: r.idea.companyName,
                    description: r.idea.description,
                    targetPrice: r.idea.targetPrice,
                    url: providerUrlService.getIdeaUrl(r.idea.provider, r.idea.id),
                    publishDate: r.idea.publishDate,
                    similarity: typeof r.distance === 'number' ? (1 - r.distance) : null,
                }));
            } catch (e: any) {
                console.error('GET /ideas search error:', e);
            }
        }

        res.type('html').send(renderIdeasPage({
            query: query ? String(query) : '',
            from: from ? String(from) : '',
            to: to ? String(to) : '',
            limit: limit ? Number(limit) : 10,
            ideas,
            searched
        }));
    });

    // GET /topics?from=YYYY-MM-DD&to=YYYY-MM-DD&hint=healthcare
    app.get('/topics', async (req: any, res: any) => {
        const {from, to, hint} = req.query;
        if (!from || !to) {
            return res.status(400).send('Missing required query parameters: from, to');
        }
        try {
            const topics = await apiService.discoverTopics(from, to, hint);
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
