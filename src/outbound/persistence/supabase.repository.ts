import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {InvestmentIdea} from "../../domain/models";
import {Repository} from "./repository";

const TABLE = 'ideas';

export class SupabaseIdeaRepository implements Repository {
    private client: SupabaseClient;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.client = createClient(supabaseUrl, supabaseKey);
    }

    async upsert(idea: InvestmentIdea): Promise<void> {
        const {error} = await this.client.from(TABLE).upsert({
            id: idea.id,
            provider: idea.provider,
            ticker: idea.ticker,
            company_name: idea.companyName,
            title: idea.title,
            categories_json: idea.categories,
            categories: idea.categories,
            target_price: idea.targetPrice,
            currency: idea.currency,
            description: idea.description,
            publish_date: idea.publishDate,
        }, {onConflict: 'id'});

        if (error) throw new Error(`Supabase upsert of idea ${idea.id} failed: ${error.message}`);
    }

    async findById(id: string): Promise<InvestmentIdea | undefined> {
        const {data, error} = await this.client
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(`Supabase findById('${id}') failed: ${error.message}`);
        return data ? this.toIdea(data) : undefined;
    }

    async findCategoriesByIdeaId(id: string): Promise<string[] | undefined> {
        const {data, error} = await this.client
            .from(TABLE)
            .select('categories')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(`Supabase findCategoriesByIdeaId('${id}') failed: ${error.message}`);
        return data?.categories ?? undefined;
    }

    async findAllCategories(): Promise<string[]> {
        const {data, error} = await this.client
            .from(TABLE)
            .select('categories')

        if (error) throw new Error(`Supabase findAllCategories failed: ${error.message}`);
        const set = new Set<string>();
        for (const row of data ?? []) {
            for (const c of row.categories ?? []) set.add(c);
        }
        return [...set];
    }

    async findByCategory(category: string, from?: string, to?: string): Promise<InvestmentIdea[]> {
        let query = this.client
            .from(TABLE)
            .select('*')
            .contains('categories', [category]);

        if (from) query = query.gte('publish_date', from);
        if (to) query = query.lte('publish_date', to);

        const {data, error} = await query;
        if (error) throw new Error(`Supabase findByCategory('${category}') failed: ${JSON.stringify(error)}`);
        return (data ?? []).map(row => this.toIdea(row));
    }

    private toIdea(row: any): InvestmentIdea {
        return {
            id: row.id,
            provider: row.provider,
            ticker: row.ticker,
            companyName: row.company_name,
            title: row.title,
            description: row.description,
            targetPrice: row.target_price,
            currency: row.currency,
            categories: row.categories_json ?? [],
            publishDate: row.publish_date,
        };
    }
}
