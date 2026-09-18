import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {InvestmentIdea} from "../../domain/models.js";
import {Repository} from "./repository.js";

const IDEAS_TABLE = 'ideas';

export class SupabaseIdeaRepository implements Repository {
    private client: SupabaseClient;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.client = createClient(supabaseUrl, supabaseKey);
    }

    async upsert(idea: InvestmentIdea): Promise<void> {
        const {error} = await this.client.from(IDEAS_TABLE).upsert({
            id: idea.id,
            provider: idea.provider,
            ticker: idea.ticker,
            company_name: idea.companyName,
            title: idea.title,
            target_price: idea.targetPrice,
            currency: idea.currency,
            description: idea.description,
            publish_date: idea.publishDate,
        }, {onConflict: 'id'});

        if (error) throw new Error(`Supabase upsert of idea ${idea.id} failed: ${error.message}`);
    }

    async findById(id: string): Promise<InvestmentIdea | undefined> {
        const {data, error} = await this.client
            .from(IDEAS_TABLE)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(`Supabase findById('${id}') failed: ${error.message}`);
        return data ? this.toIdea(data) : undefined;
    }

    async findByIds(ids: string[]): Promise<InvestmentIdea[]> {
        if (ids.length === 0) return [];
        const {data, error} = await this.client
            .from(IDEAS_TABLE)
            .select('*')
            .in('id', ids);

        if (error) throw new Error(`Supabase findByIds failed: ${error.message}`);
        return (data ?? []).map((row: any) => this.toIdea(row));
    }

    async findTitlesByDateRange(from: string, to: string): Promise<string[]> {
        const {data, error} = await this.client
            .from(IDEAS_TABLE)
            .select('title')
            .gte('publish_date', from)
            .lte('publish_date', to);

        if (error) throw new Error(`Supabase findTitlesByDateRange failed: ${error.message}`);
        return (data ?? []).map(r => r.title);
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
            publishDate: row.publish_date,
        };
    }
}
