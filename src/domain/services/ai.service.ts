import OpenAI from 'openai';
import 'dotenv/config';

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-nomic-embed-text-v1.5";
const LLM_MODEL = process.env.LLM_MODEL ?? "qwen/qwen3-1.7b";

export interface TopicSuggestion {
    topic: string;
    suggestedQuery: string;
    count: number;
}

const discoverTopicsSystemPrompt = `You are an investment analyst. You receive a list of investment idea titles.
Task: Identify the most popular INDUSTRY TOPICS among these titles.

Rules:
1. Group titles by industry/sector theme.
2. Return topics sorted by popularity (most frequent first).
3. For each topic provide a short English search query that would best match related ideas via semantic search.
4. The "count" field is the approximate number of titles that belong to this topic.
5. Return at most 15 topics.`;

export class AiService {
    private readonly openai: OpenAI;

    constructor(apiKey: string, baseURL: string) {
        this.openai = new OpenAI({apiKey, baseURL});
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
            encoding_format: "float"
        });
        return response.data[0].embedding;
    }

    async discoverTopics(titles: string[], hint?: string): Promise<TopicSuggestion[]> {
        if (titles.length === 0) return [];

        const userContent = (hint ? `Focus area: ${hint}\n\n` : '') +
            `Titles:\n${titles.map(t => `- ${t}`).join('\n')}`;

        const response = await this.openai.chat.completions.create({
            model: LLM_MODEL,
            max_completion_tokens: 2048,
            temperature: 0.3,
            messages: [
                {role: "system", content: discoverTopicsSystemPrompt},
                {role: "user", content: userContent},
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "topic_suggestions",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            topics: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        topic: {type: "string"},
                                        suggestedQuery: {type: "string"},
                                        count: {type: "number"},
                                    },
                                    required: ["topic", "suggestedQuery", "count"],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ["topics"],
                        additionalProperties: false,
                    },
                },
            },
        });

        const content = response?.choices?.[0]?.message?.content;
        if (!content) return [];

        try {
            return JSON.parse(content).topics ?? [];
        } catch {
            console.error('Failed to parse topic suggestions:', content);
            return [];
        }
    }
}
