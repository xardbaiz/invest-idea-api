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

export class GenkitAiService {
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

    static createAiService(): GenkitAiService {
        return createAiService();
    }
}

function normalizeModelName(modelEnv?: string, defaultModel?: string): { provider?: string; model: string } {
    const raw = modelEnv ?? defaultModel ?? '';
    if (!raw) return { model: '' };

    if (raw.startsWith('gemini/')) {
        return { provider: 'gemini', model: raw.replace(/^gemini\//, 'googleai/') };
    }
    if (raw.startsWith('openai/')) {
        return { provider: 'openai', model: raw };
    }
    return { model: raw };
}

export function createAiService(): GenkitAiService {
    const llmEnv = process.env.LLM_MODEL;
    const embEnv = process.env.EMBEDDING_MODEL;

    const normLlm = normalizeModelName(llmEnv);
    const normEmb = normalizeModelName(embEnv);

    const detectedProvider = normLlm.provider ?? normEmb.provider;
    const provider = (detectedProvider ?? process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? 'gemini' : 'openai')).toLowerCase();

    const isGemini = provider === 'gemini';

    const plugins = isGemini
        ? [googleAI({ apiKey: process.env.GEMINI_API_KEY ?? '' })]
        : [openAI({
            apiKey: process.env.OPENAI_API_KEY ?? process.env.LMSTUDIO_API_KEY ?? 'lmstudio',
            baseURL: process.env.OPENAI_BASE_URL ?? process.env.LMSTUDIO_BASE_URL ?? 'http://127.0.0.1:1234/v1',
        })];

    const defaultEmbedding = isGemini ? textEmbedding004.name : textEmbedding3Small.name;
    const defaultLlm = isGemini ? gemini15Flash.name : gpt4oMini.name;

    const embeddingModel = normEmb.model || (isGemini ? process.env.GEMINI_EMBEDDING_MODEL : undefined) || defaultEmbedding;
    const llmModel = normLlm.model || (isGemini ? process.env.GEMINI_LLM_MODEL : undefined) || defaultLlm;

    return new GenkitAiService(genkit({ plugins }), embeddingModel, llmModel);
}
