import OpenAI from 'openai';
import {InvestmentIdea} from "../models.js";
import fewShotExamples from './few-shot-examples.json' with {type: 'json'};

const LLM_MODEL = "nvidia/nemotron-3-nano-4b";

const predefinedCategories: string[] = [
    "Aerospace",      // Aeronautics, Aerospace, Airline, Aviation, Satellite, Space
    "Agriculture",    // Agricultural, Biofuels
    "Automotive",     // Automotive, Vehicles, Transport
    "Chemicals",      // Chemicals, Materials, Refining
    "Communications", // Audio, Communications, Media, Social Media, Telecom
    "Consulting",     // Consulting, Services, Certification, Design
    "Education",
    "Energy",         // Energy, Hydrocarbons, Renewables, Water
    "Entertainment",  // Entertainment, Gambling, Sports
    "Finance",        // Banking, Credit, Equities, Financial Services, Fintech, Investment, Private Equity
    "Food",           // Food, Beverage
    "Government",     // Security, Defense
    "Healthcare",     // Biotechnology, Medical
    "Hospitality",    // Travel, Cruises
    "Realty",         // Housing, Real Estate, Residential
    "Rental",
    "Industrial",     // Manufacturing, Engineering, HVAC
    "Insurance",      // Insurance
    "Logistics",      // Logistics, Transportation
    "Marketing",      // Advertising, Marketing
    "Property",       // Commercial (offices, real estate)
    "Retail",         // E-commerce, Franchise
    "Technology",     // AI, Analytics, Cloud, Electronics, Hardware, IP, Semiconductor, Software
    "Web3"            // Cryptocurrency, Digital Assets
];

const systemPrompt = `You are a professional investment analyst.
Task: Identify the core INDUSTRIES of the company described. 

Rules:
1. Focus ONLY on what the company produces or what services it provides (e.g., cars, medicine, energy).
2. Investment method (stocks, options, calls, puts, or trading advice) is not an industry!
3. Use categories from the PREDEFINED LIST if they match the company's business, If no list category matches, create a new 1-2 word industry name.
4. Return 1-4 most relevant categories.

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
            const request: any = {
                model: LLM_MODEL,
                max_completion_tokens: 2048,
                messages: [
                    {role: "system", content: systemPrompt},

                    ...fewShotExamples.flatMap(example => [
                        {role: "user" as const, content: example.request},
                        {role: "assistant" as const, content: JSON.stringify({categories: example.response})},
                    ]),

                    {role: "user", content: `Title: ${title}.\nDescription: ${description}`},
                ],
                temperature: 0.3,
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
            }
            const response = await this.openai.chat.completions.create(request);
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