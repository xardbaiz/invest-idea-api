import { jest } from '@jest/globals';
import { getMcpServer } from '../mcp.factory.js';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import express, { Express } from 'express';
import http from 'node:http';
import { ApiService } from '../domain/services/api.service.js';

describe('MCP Server HTTP Transport Integration', () => {
    let mockApiService: Record<string, any>;
    let app: Express;
    let server: http.Server;
    let serverUrl: string;

    beforeEach(async () => {
        const searchIdeasFn = jest.fn();
        (searchIdeasFn as any).mockResolvedValue([
            {
                idea: {
                    id: '1',
                    title: 'Buy AAPL',
                    description: 'Apple stock analysis',
                    ticker: 'AAPL',
                    companyName: 'Apple Inc.',
                    provider: 'test',
                    publishDate: '2025-01-01',
                },
                distance: 0.1,
            },
        ]);

        mockApiService = {
            searchIdeas: searchIdeasFn,
        };

        const mcpServer = getMcpServer(mockApiService as unknown as ApiService);
        const transport = new NodeStreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        await mcpServer.connect(transport);

        app = express();
        app.use(express.json());

        app.all('/mcp', async (req, res) => {
            try {
                await transport.handleRequest(req, res, req.body);
            } catch (error) {
                res.status(500).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32603,
                        message: 'Internal server error',
                    },
                    id: null,
                });
            }
        });

        await new Promise<void>((resolve) => {
            server = app.listen(0, () => {
                const address = server.address() as { port: number };
                serverUrl = `http://localhost:${address.port}/mcp`;
                resolve();
            });
        });
    });

    afterEach((done) => {
        if (server) {
            server.closeAllConnections?.();
            server.close(done);
        } else {
            done();
        }
    });

    it('should handle initialize request via POST', async () => {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'test-client', version: '1.0.0' },
                },
            }),
        });

        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('event: message');
        expect(text).toContain('invest-idea-api');
    });

    it('should list tools via POST tools/list', async () => {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
            }),
        });

        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('search_ideas');
    });

    it('should execute search_ideas tool via POST tools/call', async () => {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 3,
                method: 'tools/call',
                params: {
                    name: 'search_ideas',
                    arguments: { query: 'Apple' },
                },
            }),
        });

        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('Buy AAPL');
        expect(mockApiService.searchIdeas).toHaveBeenCalledWith('Apple', 10, undefined, undefined);
    });

    it('should open SSE stream on GET with Accept: text/event-stream', async () => {
        const controller = new AbortController();
        const response = await fetch(serverUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream',
            },
            signal: controller.signal,
        });

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/event-stream');
        controller.abort();
    });
});
