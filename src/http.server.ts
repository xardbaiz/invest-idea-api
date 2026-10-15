import express, {Express} from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {getMcpServer} from "./mcp.factory.js";
import {getLanguageFromHeader} from "./views/ui/i18n/i18n.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import {createRepository} from "./outbound/persistence/repository.factory.js";
import {createVectorStoreService} from "./outbound/vector/vector-store.factory.js";
import {createAiService} from "./domain/services/ai.service.js";
import {ApiService} from "./domain/services/api.service.js";
import 'dotenv/config';

const isHttpServerEnabled = process.env.HTTP_SERVER_ENABLED !== 'false';
if (isHttpServerEnabled) {
    const repo = createRepository();
    const vectorStore = createVectorStoreService();
    const aiService = createAiService();
    const apiService = new ApiService(repo, aiService, vectorStore);

    const app: Express = express();
    app.disable('x-powered-by');

    // Static assets from Vite build (do not automatically serve static index.html for root)
    app.use(express.static(path.join(process.cwd(), 'dist', 'public'), { index: false }));

    // GET /api/logo/:ticker
    app.get(['/api/logo/:ticker', '/api/logos/:ticker'], (req: any, res: any) => {
        const {ticker} = req.params;
        if (!ticker) {
            return res.status(400).send('Missing ticker');
        }
        try {
            const logoUrl = apiService.getLogoByTicker(ticker);
            res.json({url: logoUrl});
        } catch (e: any) {
            console.error('GET /api/logo/:ticker error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/ideas/:id/digest
    app.get(['/api/ideas/:id/digest', '/api/ideas/digest/:id'], async (req: any, res: any) => {
        const {id} = req.params;
        if (!id) {
            return res.status(400).send('Missing idea id parameter');
        }
        const langParam = typeof req.query.lang === 'string' ? req.query.lang : undefined;
        const acceptLang = langParam || req.headers['accept-language'];
        const lang = getLanguageFromHeader(acceptLang);

        try {
            const digest = await apiService.getIdeaDigest(id, lang);
            if (!digest) {
                return res.status(404).send('Idea not found');
            }
            res.json({ digest });
        } catch (e: any) {
            console.error('GET /api/ideas/:id/digest error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/:ticker/risk-return
    app.get(['/api/:ticker/risk-return', '/api/risk-return/:ticker'], async (req: any, res: any) => {
        const {ticker} = req.params;
        if (!ticker) {
            return res.status(400).send('Missing ticker parameter');
        }
        try {
            const data = await apiService.getRiskReturnInfo(ticker);
            res.json(data);
        } catch (e: any) {
            console.error('GET /api/:ticker/risk-return error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/:ticker/recommendations
    app.get(['/api/:ticker/recommendations', '/api/recommendations/:ticker'], async (req: any, res: any) => {
        const {ticker} = req.params;
        if (!ticker) {
            return res.status(400).send('Missing ticker parameter');
        }
        try {
            const data = await apiService.getRecommendations(ticker);
            res.json(data);
        } catch (e: any) {
            console.error('GET /api/:ticker/recommendations error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/companies?query=...
    app.get(['/api/companies', '/api/companies/search'], async (req: any, res: any) => {
        const {query} = req.query;
        if (!query) {
            return res.json([]);
        }
        try {
            const companies = await apiService.searchCompanies(String(query));
            res.json(companies);
        } catch (e: any) {
            console.error('GET /api/companies error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/companies/ideas?company=...
    app.get(['/api/companies/ideas', '/api/ideas/company'], async (req: any, res: any) => {
        const company = req.query.company || req.query.ticker;
        if (!company) {
            return res.status(400).send('Missing required company or ticker parameter');
        }
        try {
            res.json(await getCompanyIdeasWithQuotes(String(company)));
        } catch (e: any) {
            console.error('GET /api/companies/ideas error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/ideas?query=...&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10
    app.get('/api/ideas', async (req: any, res: any) => {
        const {query, from, to, limit} = req.query;
        if (!query) {
            return res.status(400).send('Missing required query parameter: query');
        }
        try {
            res.json(await searchIdeasWithQuotes(query, Number(limit) || 10, from, to));
        } catch (e: any) {
            console.error('GET /api/ideas error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // GET /api/:ticker/quota/details
    app.get('/api/:ticker/quota/details', async (req: any, res: any) => {
        const {ticker} = req.params;
        try {
            const details = await apiService.getQuoteDetails([ticker]);
            if (!details.length) return res.status(404).send('Quote not found');
            res.json(details[0]);
        } catch (e: any) {
            console.error('GET /api/:ticker/quota/details error:', e);
            res.status(500).send(`Error: ${e.message}`);
        }
    });

    // HTML WebUI pages served via client index.html with language detection
    app.get(['/', '/ideas'], (req: any, res: any) => {
        const langParam = typeof req.query.lang === 'string' ? req.query.lang : undefined;
        const acceptLang = langParam || req.headers['accept-language'];
        const lang = getLanguageFromHeader(acceptLang);

        const indexPath = path.join(process.cwd(), 'dist', 'public', 'index.html');
        if (fs.existsSync(indexPath)) {
            let html = fs.readFileSync(indexPath, 'utf8');
            html = html.replace(/lang="[a-zA-Z-]+"/, `lang="${lang}"`);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        }
        res.sendFile(indexPath);
    });

    async function getCompanyIdeasWithQuotes(company: string) {
        const ideas = await apiService.getIdeasByCompany(company);
        const tickers = ideas.map(r => r.ticker).filter(Boolean) as string[];
        const quotes = tickers.length ? await apiService.getQuoteDetails(tickers).catch(() => []) : [];
        const quoteMap = new Map(quotes.map(q => [q.ticker, q]));
        return ideas.map(idea => {
            const q = idea.ticker ? quoteMap.get(idea.ticker) : undefined;
            const currentPrice = q?.bap || q?.bbp || q?.ClosePrice || q?.ltp || null;
            return {
                id: idea.id,
                idea,
                ticker: idea.ticker,
                companyName: idea.companyName,
                summary: idea.summary || idea.description,
                digest: idea.digest,
                targetPrice: idea.targetPrice,
                currentPrice,
                url: apiService.getIdeaUrl(idea.provider, idea.id),
                logoUrl: idea.ticker ? apiService.getLogoByTicker(idea.ticker) : null,
                publishDate: idea.publishDate,
                similarity: null,
            };
        });
    }

    async function searchIdeasWithQuotes(query: string, limit: number, from?: string, to?: string) {
        const results = await apiService.searchIdeas(query, limit, from, to);
        const tickers = results.map(r => r.idea.ticker).filter(Boolean) as string[];
        const quotes = tickers.length ? await apiService.getQuoteDetails(tickers).catch(() => []) : [];
        const quoteMap = new Map(quotes.map(q => [q.ticker, q]));
        return results.map(r => {
            const q = r.idea.ticker ? quoteMap.get(r.idea.ticker) : undefined;
            const currentPrice = q?.bap || q?.bbp || q?.ClosePrice || q?.ltp || null;
            return {
                ...r,
                id: r.idea.id,
                ticker: r.idea.ticker,
                companyName: r.idea.companyName,
                summary: r.idea.summary || r.idea.description,
                digest: r.idea.digest,
                targetPrice: r.idea.targetPrice,
                currentPrice,
                url: apiService.getIdeaUrl(r.idea.provider, r.idea.id),
                logoUrl: r.idea.ticker ? apiService.getLogoByTicker(r.idea.ticker) : null,
                publishDate: r.idea.publishDate,
                similarity: typeof r.distance === 'number' ? (1 - r.distance) : null,
            };
        });
    }

    if (process.env.MCP_SERVER_HTTP_TRANSPORT_ENABLED === 'true') {
        const mcpServer = getMcpServer(apiService);
        const transport: NodeStreamableHTTPServerTransport = new NodeStreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        await mcpServer.connect(transport);
        console.log(`MCP Stateless Streamable HTTP Server initialized`);

        app.all('/mcp', async (req: any, res: any) => {
            try {
                await transport.handleRequest(req, res, req.body);
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
    }

    const expressPort = process.env.PORT ?? 3000;
    app.listen(expressPort, (error: any) => {
        if (error) {
            console.error('Failed to start server:', error);
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        }
        console.log(`HTTP Server listening on port ${expressPort}`);
    });

    // Handle server shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    });
}
