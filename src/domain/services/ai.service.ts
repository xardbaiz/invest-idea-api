import OpenAI from 'openai';
import {GoogleGenAI, Type} from '@google/genai';
import 'dotenv/config';

export interface TopicSuggestion {
    topic: string;
    suggestedQuery: string;
    count: number;
}

export interface AiService {
    generateEmbedding(text: string): Promise<number[]>;
    discoverTopics(titles: string[], hint?: string): Promise<TopicSuggestion[]>;
}

const discoverTopicsSystemPrompt = `You are an investment analyst. You receive a list of investment idea titles.
Task: Identify the most popular INDUSTRY TOPICS among these titles.

Rules:
1. Group titles by industry/sector theme.
2. Return topics sorted by popularity (most frequent first).
3. For each topic provide a short English search query that would best match related ideas via semantic search.
4. The "count" field is the approximate number of titles that belong to this topic.
5. Return at most 15 topics.`;

export class OpenAiService implements AiService {
    private readonly openai: OpenAI;
    private readonly embeddingModel: string;
    private readonly llmModel: string;

    constructor(apiKey: string, baseURL: string, embeddingModel?: string, llmModel?: string) {
        this.openai = new OpenAI({ apiKey, baseURL });
        this.embeddingModel = embeddingModel ?? process.env.EMBEDDING_MODEL ?? "text-embedding-nomic-embed-text-v1.5";
        this.llmModel = llmModel ?? process.env.LLM_MODEL ?? "qwen/qwen3-1.7b";
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: this.embeddingModel,
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
            model: this.llmModel,
            max_completion_tokens: 2048,
            temperature: 0.3,
            messages: [
                { role: "system", content: discoverTopicsSystemPrompt },
                { role: "user", content: userContent },
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
                                        topic: { type: "string" },
                                        suggestedQuery: { type: "string" },
                                        count: { type: "number" },
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

export class GeminiAiService implements AiService {
    private readonly ai: GoogleGenAI;
    private readonly embeddingModel: string;
    private readonly llmModel: string;

    constructor(apiKey: string, embeddingModel?: string, llmModel?: string) {
        this.ai = new GoogleGenAI({ apiKey });
        this.embeddingModel = embeddingModel ?? process.env.GEMINI_EMBEDDING_MODEL ?? "text-embedding-004";
        this.llmModel = llmModel ?? process.env.GEMINI_LLM_MODEL ?? "gemini-2.5-flash";
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.ai.models.embedContent({
            model: this.embeddingModel,
            contents: text,
            config: {outputDimensionality: 1024},
        });
        const embeddingObj = (response as any).embedding ?? response.embeddings?.[0];
        return embeddingObj?.values ?? [];
    }

    async discoverTopics(titles: string[], hint?: string): Promise<TopicSuggestion[]> {
        if (titles.length === 0) return [];

        const userContent = (hint ? `Focus area: ${hint}\n\n` : '') +
            `Titles:\n${titles.map(t => `- ${t}`).join('\n')}`;

        const response = await this.ai.models.generateContent({
            model: this.llmModel,
            contents: userContent,
            config: {
                systemInstruction: discoverTopicsSystemPrompt,
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    topic: { type: Type.STRING },
                                    suggestedQuery: { type: Type.STRING },
                                    count: { type: Type.NUMBER },
                                },
                                required: ["topic", "suggestedQuery", "count"],
                            },
                        },
                    },
                    required: ["topics"],
                },
            },
        });

        const content = response.text;
        if (!content) return [];

        try {
            return JSON.parse(content).topics ?? [];
        } catch {
            console.error('Failed to parse topic suggestions:', content);
            return [];
        }
    }
}

export function createAiService(): AiService {
    const provider = (process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? 'gemini' : 'openai')).toLowerCase();

    if (provider === 'gemini') {
        const apiKey = process.env.GEMINI_API_KEY ?? '';
        return new GeminiAiService(apiKey);
    }

    const openAiApiKey = process.env.OPENAI_API_KEY ?? 'lmstudio';
    const openAiBaseUrl = process.env.OPENAI_BASE_URL ?? 'http://127.0.0.1:1234/v1';
    return new OpenAiService(openAiApiKey, openAiBaseUrl);
}
