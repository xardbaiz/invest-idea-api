import OpenAI from 'openai';

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-nomic-embed-text-v1.5";

export class EmbeddingService {
    private readonly openai: OpenAI;

    constructor(apiKey: string, baseURL: string) {
        this.openai = new OpenAI({apiKey, baseURL});
    }

    async generate(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
            encoding_format: "float"
        });
        return response.data[0].embedding;
    }
}
