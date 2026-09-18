import OpenAI from 'openai';
import {GoogleGenAI} from '@google/genai';
import 'dotenv/config';
import {EMBEDDING_DIMENSION} from "../constants.js";
import {ChatMessage} from "../models.js";

const systemRole = 'system'
const assistantRole = 'assistant'
const userRole = 'user'

export interface TopicSuggestion {
    topic: string;
    suggestedQuery: string;
    count: number;
}

export interface AiService {
    generateEmbedding(text: string): Promise<number[]>;
    generateSummary(messages: ChatMessage[], input: string): Promise<string>;
}

export class OpenAiService implements AiService {
    private readonly openai: OpenAI;
    private readonly embeddingModel: string;
    private readonly llmModel: string;

    constructor(apiKey: string, baseURL: string, embeddingModel?: string, llmModel?: string) {
        this.openai = new OpenAI({apiKey, baseURL});
        this.embeddingModel = embeddingModel ?? process.env.EMBEDDING_MODEL ?? "text-embedding-nomic-embed-text-v1.5";
        this.llmModel = llmModel ?? process.env.LLM_MODEL ?? "qwen/qwen3-1.7b";
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: this.embeddingModel,
            input: text,
            dimensions: EMBEDDING_DIMENSION,
            encoding_format: "float"
        });
        return response.data[0].embedding;
    }

    async generateSummary(messages: ChatMessage[], input: string): Promise<string> {
        const openAiMessages = [
            ...messages.map(m => ({role: m.role, content: m.content})),
            {role: `${userRole}` as const, content: input},
        ];

        const response = await this.openai.chat.completions.create({
            model: this.llmModel,
            temperature: 0.3,
            messages: openAiMessages,
        });
        return response?.choices?.[0]?.message?.content?.trim() ?? '';
    }
}

export class GeminiAiService implements AiService {
    private readonly ai: GoogleGenAI;
    private readonly embeddingModel: string;
    private readonly llmModel: string;

    constructor(apiKey: string, embeddingModel?: string, llmModel?: string) {
        this.ai = new GoogleGenAI({apiKey});
        this.embeddingModel = embeddingModel ?? process.env.GEMINI_EMBEDDING_MODEL ?? "text-embedding-004";
        this.llmModel = llmModel ?? process.env.GEMINI_LLM_MODEL ?? "gemini-2.5-flash";
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.ai.models.embedContent({
            model: this.embeddingModel,
            contents: text,
            config: {outputDimensionality: EMBEDDING_DIMENSION},
        });
        const embeddingObj = (response as any).embedding ?? response.embeddings?.[0];
        return embeddingObj?.values ?? [];
    }

    async generateSummary(messages: ChatMessage[], input: string): Promise<string> {
        const systemMessage = messages.find(m => m.role === systemRole);
        const fewShots = messages.filter(m => m.role !== systemRole);

        const contents: any[] = [
            ...fewShots.map(m => ({
                role: m.role === assistantRole ? 'model' : m.role,
                parts: [{text: m.content}],
            })),
            {
                role: userRole,
                parts: [{text: input}],
            },
        ];

        const response = await this.ai.models.generateContent({
            model: this.llmModel,
            contents,
            config: {
                systemInstruction: systemMessage?.content,
                temperature: 0.3,
            },
        });
        return response.text?.trim() ?? '';
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
