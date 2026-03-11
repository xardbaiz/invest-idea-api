import OpenAI from 'openai';

export class IdeaClassifier {
    private openai: OpenAI;

    constructor(apiKey: string, baseURL: string) {
        this.openai = new OpenAI({apiKey, baseURL});
    }

    async classify(title: string, description: string): Promise<string[]> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Analyze the investment idea. Return a JSON array of applicable categories (e.g. ['Aviation', 'Low-cost', 'Europe']). Return ONLY the array."
                },
                {role: "user", content: `Title: ${title}\nDescription: ${description}`}
            ],
            response_format: {type: "json_object"}
        });

        const content = response?.choices ? [0].message?.content || '{"categories": ["General"]}';
        return JSON.parse(content).categories;
    }
}