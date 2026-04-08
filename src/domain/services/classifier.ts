import OpenAI from 'openai';
import {InvestmentIdea} from "../models";

const LLM_MODEL = "gemma-2-2b-it";

const predefinedCategories = ['Europe',
    'Healthcare', 'Insurance',
    'Energy', 'Electric', 'Vehicles', 'Batteries',
    'Financial', 'Gambling',
    'Estate',
];

const systemPrompt = `You are a professional investment analyst. 
Task: Classify the business idea into 1-3 most relevant MAIN categories.

Rules:
1. Use categories from the PREDEFINED LIST below if they strictly match.
2. If no category from the list matches, create a new concise (1-2 words) category.
3. Strict constraint: ONLY return categories that are directly related to the idea. Do NOT add irrelevant categories.

PREDEFINED LIST:
${predefinedCategories.join(', ')}`;

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
                    {role: "system", content: systemPrompt},
                    {
                        role: "user",
                        content: "Title: Crypto Exchange\nDescription: Platform for trading digital assets."
                    },
                    {role: "assistant", content: JSON.stringify({categories: ["Financial", "Crypto"]})},
                    {role: "user", content: `Title: ${title}\nDescription: ${description}`},
                ],
                temperature: 0.1,
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "invest_categories",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                categories: {
                                    type: "array",
                                    description: "Top 1-4 most relevant industry categories only.",
                                    items: {type: "string"},
                                    minItems: 1,
                                    maxItems: 4
                                }
                            },
                            required: ["categories"],
                            additionalProperties: false
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