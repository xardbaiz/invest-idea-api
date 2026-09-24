import { genkit, Genkit } from 'genkit';
import { googleAI, textEmbedding004, gemini15Flash } from '@genkit-ai/googleai';
import { openAI, textEmbedding3Small, gpt4oMini } from 'genkitx-openai';
import 'dotenv/config';
import { EMBEDDING_DIMENSION } from "../constants.js";
import { ChatMessage } from "../models.js";

const systemRole = 'system';
const assistantRole = 'assistant';
const userRole = 'user';

export interface TopicSuggestion {
    topic: string;
    suggestedQuery: string;
    count: number;
}

export interface AiService {
    generateEmbedding(text: string): Promise<number[]>;
    generateSummary(messages: ChatMessage[], input: string): Promise<string>;
}

export class GenkitAiService implements AiService {
    private readonly ai: Genkit;
    private readonly embeddingModelName: string;
    private readonly llmModelName: string;

    constructor(ai: Genkit, embeddingModelName: string, llmModelName: string) {
        this.ai = ai;
        this.embeddingModelName = embeddingModelName;
        this.llmModelName = llmModelName;
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const result = await this.ai.embed({
            embedder: this.embeddingModelName,
            content: text,
            options: {
                dimensions: EMBEDDING_DIMENSION,
            },
        });
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0].embedding)) {
            return result[0].embedding;
        }
        return (result as any)?.embedding ?? [];
    }

    async generateSummary(messages: ChatMessage[], input: string): Promise<string> {
        const systemMessage = messages.find(m => m.role === systemRole);
        const conversationMessages = messages.filter(m => m.role !== systemRole);

        const promptMessages: Array<{ role: 'user' | 'model'; content: Array<{ text: string }> }> = [
            ...conversationMessages.map(m => ({
                role: (m.role === assistantRole ? 'model' : userRole) as 'user' | 'model',
                content: [{ text: m.content }],
            })),
            {
                role: 'user' as const,
                content: [{ text: input }],
            },
        ];

        const response = await this.ai.generate({
            model: this.llmModelName,
            system: systemMessage?.content,
            messages: promptMessages,
            config: {
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
        const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL ?? process.env.EMBEDDING_MODEL ?? textEmbedding004.name;
        const llmModel = process.env.GEMINI_LLM_MODEL ?? process.env.LLM_MODEL ?? gemini15Flash.name;

        const ai = genkit({
            plugins: [googleAI({ apiKey })],
        });

        return new GenkitAiService(ai, embeddingModel, llmModel);
    }

    const openAiApiKey = process.env.OPENAI_API_KEY ?? process.env.LMSTUDIO_API_KEY ?? 'lmstudio';
    const openAiBaseUrl = process.env.OPENAI_BASE_URL ?? process.env.LMSTUDIO_BASE_URL ?? 'http://127.0.0.1:1234/v1';
    const embeddingModel = process.env.EMBEDDING_MODEL ?? textEmbedding3Small.name;
    const llmModel = process.env.LLM_MODEL ?? gpt4oMini.name;

    const ai = genkit({
        plugins: [openAI({ apiKey: openAiApiKey, baseURL: openAiBaseUrl })],
    });

    return new GenkitAiService(ai, embeddingModel, llmModel);
}
