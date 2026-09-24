import {genkit, Genkit, modelRef} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai'
import {openAICompatible} from '@genkit-ai/compat-oai';
import 'dotenv/config';
import {EMBEDDING_DIMENSION} from "../constants.js";
import {ChatMessage} from "../models.js";

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


const OPEN_AI_COMPATIBLE = 'compat-oai';

export function createAiService(): GenkitAiService {
    const normalizedLlm = normalizeModelName(process.env.LLM_MODEL);
    const normalizedEmbedder = normalizeModelName(process.env.EMBEDDING_MODEL);

    const detectedProvider = normalizedLlm.provider ?? normalizedEmbedder.provider;
    const provider = (detectedProvider ?? process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? 'gemini' : 'openai')).toLowerCase();

    let plugins: any[] = [];
    let embeddingModel = normalizedEmbedder.model;
    let llmModel = normalizedLlm.model;
    if (provider === 'gemini') {
        plugins = [googleAI({apiKey: process.env.GEMINI_API_KEY ?? ''})]

        embeddingModel = embeddingModel || process.env.GEMINI_EMBEDDING_MODEL || googleAI.embedder("gemini-embedding-2").name;
        llmModel = llmModel || process.env.GEMINI_LLM_MODEL || googleAI.model("gemini-flash-lite-latest").name;
    } else {
        plugins = [openAICompatible({
            name: OPEN_AI_COMPATIBLE,
            apiKey: process.env.OPENAI_API_KEY ?? 'lmstudio',
            baseURL: process.env.OPENAI_BASE_URL ?? 'http://127.0.0.1:1234/v1',
        })]

        embeddingModel = embeddingModel || OPEN_AI_COMPATIBLE + '/text-embedding-multilingual-e5-small';
        llmModel = llmModel || OPEN_AI_COMPATIBLE + '/nvidia/nemotron-3-nano-4b';
    }

    return new GenkitAiService(genkit({plugins}), embeddingModel, llmModel);
}

function normalizeModelName(modelEnv?: string, defaultModel?: string): { provider?: string; model: string } {
    const raw = modelEnv ?? defaultModel ?? '';
    if (!raw) return { model: '' };

    const geminiProvider = 'gemini';
    const openaiProvider = 'openai';

    if (raw.startsWith(geminiProvider + '/') || raw.startsWith('googleai/')) {
        return {provider: geminiProvider, model: raw.replace(/^gemini\//, 'googleai/')};
    }
    if (raw.startsWith(openaiProvider + '/')) {
        return {
            provider: openaiProvider, model: modelRef({
                name: OPEN_AI_COMPATIBLE + '/llama3',
            }).name
        };
    }
    return { model: raw };
}
