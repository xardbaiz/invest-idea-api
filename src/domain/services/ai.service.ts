import OpenAI from 'openai';
import 'dotenv/config';
import {EMBEDDING_DIMENSION} from "../constants.js";
import {ChatMessage} from "../models.js";

const systemRole = 'system';
const userRole = 'user';

export interface TopicSuggestion {
    topic: string;
    suggestedQuery: string;
    count: number;
}

export interface AiService {
    generateEmbedding(text: string, model?: string): Promise<number[]>;

    generateSummary(messages: ChatMessage[], input: string): Promise<string>;
}

/**
 * Talks to any OpenAI-compatible endpoint. Provider routing (Gemini, local models, aggregators, ...)
 * is a concern of whatever sits behind OPENAI_API_URL, so this service never branches on a provider name.
 */
export class OpenAiCompatibleAiService implements AiService {
    private readonly client: OpenAI;
    private readonly llmModel: string;
    private readonly embeddingModel: string;
    private readonly embeddingDimensions?: number;

    constructor(
        apiKey: string,
        baseURL: string,
        llmModel: string,
        embeddingModel?: string,
        embeddingDimensions?: number,
    ) {
        this.client = new OpenAI({apiKey, baseURL});
        this.llmModel = llmModel;
        this.embeddingModel = embeddingModel ?? process.env.OPENAI_EMBEDDING_MODEL ?? llmModel;
        this.embeddingDimensions = embeddingDimensions;
    }

    async generateEmbedding(text: string, model?: string): Promise<number[]> {
        const response = await this.client.embeddings.create({
            model: model ?? this.embeddingModel,
            input: text,
            // Only send `dimensions` when explicitly configured: many OpenAI-compatible
            // routers reject unknown request fields.
            ...(this.embeddingDimensions ? {dimensions: this.embeddingDimensions} : {}),
            encoding_format: "float",
        });
        return response.data[0].embedding;
    }

    async generateSummary(messages: ChatMessage[], input: string): Promise<string> {
        const openAiMessages = [
            ...messages
                .filter(m => m.role !== systemRole || m.content)
                .map(m => ({role: m.role, content: m.content})),
            {role: `${userRole}` as const, content: input},
        ];

        const response = await this.client.chat.completions.create({
            model: this.llmModel,
            temperature: 0.3,
            messages: openAiMessages,
        });
        return response?.choices?.[0]?.message?.content?.trim() ?? '';
    }
}

export function createAiService(): AiService {
    const model = process.env.OPENAI_MODEL;
    if (!model) {
        throw new Error("OPENAI_MODEL environment variable is required");
    }

    const apiKey = process.env.OPENAI_API_KEY ?? '';
    const baseURL = process.env.OPENAI_API_URL ?? process.env.OPENAI_BASE_URL;
    if (!baseURL) {
        throw new Error("OPENAI_API_URL environment variable is required");
    }

    const embeddingDimensions = process.env.EMBEDDING_DIMENSION ? EMBEDDING_DIMENSION : undefined;

    return new OpenAiCompatibleAiService(apiKey, baseURL, model, undefined, embeddingDimensions);
}
