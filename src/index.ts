import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {CallToolRequestSchema, ListToolsRequestSchema} from "@modelcontextprotocol/sdk/types.js";
import {IdeaClassifier} from "./domain/services/classifier";
import {TradernetClient} from "./outbound/clients/tradernet";
import {IdeaRepository} from "./outbound/persistence/repository";

// --- Configuration ---
const OPENAI_BASE_URL = "http://localhost:1234/v1"; // Or your compatible provider
const OPENAI_API_KEY = "lmstudio";

const repo = new IdeaRepository();
const tradernetClient = new TradernetClient();
const classifier = new IdeaClassifier(OPENAI_API_KEY, OPENAI_BASE_URL);

// --- MCP Server Setup ---
const server = new Server({name: "invest-idea-api", version: "1.0.0"}, {capabilities: {tools: {}}});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [

        // TODO should be scheduled background job
        {
            name: "sync_and_categorize",
            description: "Fetches last ideas from broker(s), categorizes them, and stores in DB.",
            inputSchema: {
                type: "object",
                properties: {
                    size: {type: "number", description: "Number of ideas to fetch", default: 5}
                }
            }
        },
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

    // TODO should be scheduled background job
    if (name === "sync_and_categorize") {
        const size = (args?.size as number) || 5;
        const ideas = await tradernetClient.fetchIdeas(0, size);

        for (const idea of ideas) {
            // Step 1: Check if it's already categorized to save LLM tokens
            repo.upsert(idea);
            let categories = repo.findCategoriesByIdeaId(idea.id);
            if (!categories) {
                // Step 2: Use LLM for new ideas
                idea.categories = await classifier.classify(idea);
                repo.upsert(idea);
            }
        }

        return {content: [{type: "text", text: `Processed ${ideas.length} ideas with AI categorization.`}]};
    }

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