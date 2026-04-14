import {createMcpExpressApp} from "@modelcontextprotocol/express";
import {getServer} from "./mcp-server-factory.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";

if (process.env.MCP_SERVER_HTTP_TRANSPORT_ENABLED === 'true') {
    const app = createMcpExpressApp();
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

    app.get('/mcp', async (req: any, res: any) => {
        console.log('Received GET MCP request');
        res.writeHead(405).end(
            JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32_000,
                    message: 'Method not allowed.'
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