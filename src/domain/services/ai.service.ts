import {genkit, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai'
import {defineCompatOpenAIEmbedder, openAICompatible} from '@genkit-ai/compat-oai';
import {OpenAI} from 'openai';
import 'dotenv/config';
import {EMBEDDING_DIMENSION} from "../constants.js";
import {ChatMessage} from "../models.js";

const systemRole = 'system';
const assistantRole = 'assistant';
const userRole = 'user';

export class GenkitAiService {
    private readonly ai: Genkit;
    private readonly embedder: any;
    private readonly llmModelName: string;

    constructor(ai: Genkit, embedder: any, llmModelName: string) {
        this.ai = ai;
        this.embedder = embedder;
        this.llmModelName = llmModelName;
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const result = await this.ai.embed({
            embedder: this.embedder,
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




export function createAiService(): GenkitAiService {
    const normalizedLlm = normalizeModelName(process.env.LLM_MODEL);
    const normalizedEmbedder = normalizeModelName(process.env.EMBEDDING_MODEL);

    const detectedProvider = normalizedLlm.provider ?? normalizedEmbedder.provider;
    const provider = (detectedProvider ?? process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? 'gemini' : 'openai')).toLowerCase();

    let plugins: any[] = [];
    let embeddingModel = normalizedEmbedder.model;
    let llmModel = normalizedLlm.model;

    let embedder: any;

    if (provider === 'gemini') {
        plugins = [googleAI({apiKey: process.env.GEMINI_API_KEY ?? ''})]
        embedder = googleAI.embedder("gemini-embedding-2");// TODO get by embedding model name from env
        llmModel = llmModel || process.env.GEMINI_LLM_MODEL || googleAI.model("gemini-flash-lite-latest").name;
    } else {
        const OPEN_AI_COMPATIBLE = 'compat-oai';
        const openAiConfigs = {
            apiKey: process.env.OPENAI_API_KEY ?? 'lmstudio',
            baseURL: process.env.OPENAI_BASE_URL ?? 'http://127.0.0.1:1234/v1',
        }
        plugins = [openAICompatible({
            name: OPEN_AI_COMPATIBLE,
            ...openAiConfigs,
        })]

        embedder = defineCompatOpenAIEmbedder({
            client: new OpenAI(openAiConfigs) as any,
            name: embeddingModel || 'text-embedding-multilingual-e5-small'
        });

        llmModel = OPEN_AI_COMPATIBLE + '/' + (llmModel || 'nvidia/nemotron-3-nano-4b');
    }

    return new GenkitAiService(genkit({plugins}), embedder, llmModel);
}

function normalizeModelName(modelEnv?: string, defaultModel?: string): { provider?: string; model: string } {
    const raw = modelEnv ?? defaultModel ?? '';
    if (!raw) return { model: '' };

    const geminiProvider = 'gemini';
    if (raw.startsWith(geminiProvider + '/') || raw.startsWith('googleai/')) {
        return {provider: geminiProvider, model: raw.replace(/^gemini\//, 'googleai/')};
    }

    return { model: raw };
}
