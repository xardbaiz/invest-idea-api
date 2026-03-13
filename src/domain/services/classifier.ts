import OpenAI from 'openai';
import {InvestmentIdea} from "../models";

const predefinedCategories = ['Europe',
    'Healthcare', 'Insurance',
    'Energy', 'Electric', 'Vehicles', 'Batteries',
    'Financial', 'Estate',
];

export class IdeaClassifier {
    private readonly openai: OpenAI;
    private readonly model: string;

    constructor(apiKey: string, model: string, baseURL: string) {
        this.openai = new OpenAI({apiKey, baseURL});
        this.model = model;
    }

    async classify(idea: InvestmentIdea): Promise<string[]> {
        const title = idea.title;
        const description = idea.description;
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: "Analyze the investment idea. Return a JSON array of applicable categories (e.g. " + JSON.stringify(predefinedCategories) + ")"
                },
                {role: "user", content: `Title: ${title}\nDescription: ${description}`}
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "invest categories",
                    schema: {
                        type: "object",
                        properties: {categories: {type: "array", items: {type: "string"}}},
                        required: ["categories"]
                    },
                }
            }
        });

        const content: string = response?.choices?.[0]?.message?.content || '{"categories" :["General"]}';
        return JSON.parse(content).categories;
    }
}