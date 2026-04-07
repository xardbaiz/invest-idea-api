import OpenAI from 'openai';
import {InvestmentIdea} from "../models";

const LLM_MODEL = "gemma-2-2b-it";

const predefinedCategories = ['Europe',
    'Healthcare', 'Insurance',
    'Energy', 'Electric', 'Vehicles', 'Batteries',
    'Financial', 'Estate',
];

export class IdeaClassifier {
    private readonly openai: OpenAI;

    constructor(apiKey: string, baseURL: string) {
        this.openai = new OpenAI({apiKey, baseURL});
    }

    async classify(idea: InvestmentIdea): Promise<string[]> {
        const title = idea.title;
        const description = idea.description;

        try {
            const response = await this.openai.chat.completions.create({
                model: LLM_MODEL,
                max_completion_tokens: 1024,
                messages: [
                    {
                        role: "system",
                        content: "Analyze the investment idea. Return a JSON array of applicable categories (e.g. " + JSON.stringify(predefinedCategories) + ")."
                    },
                    {role: "user", content: `Title: ${title}\nDescription: ${description}`}
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "invest categories",
                        schema: {
                            type: "object",
                            properties: {
                                categories: {
                                    type: "array",
                                    description: "List of categories. Words only",
                                    uniqueItems: true,
                                    items: {
                                        type: "string",
                                    },
                                    minItems: 1, maxItems: 10
                                }
                            },
                            required: ["categories"]
                        },
                    }
                }
            });

            const responseMessage = response?.choices?.[0]?.message;
            const responseContent: string = responseMessage?.content || (responseMessage as any)?.reasoning_content || '{"categories" :[]}';
            const assignedCategories = JSON.parse(responseContent).categories;
            if (!Array.isArray(assignedCategories)) {
                console.error('Expected categories to be an array, got:', typeof assignedCategories, assignedCategories);
                return [];
            }

            const filtered = assignedCategories.filter(c => c?.trim() && c.trim() !== ',').slice(0, 10);
            return filtered.length ? filtered : [];
        } catch (e) {
            console.error(`Failed to get categories for idea ${idea.id} from LLM response:`, e);
            return [];
        }
    }
}