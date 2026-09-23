import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {InvestmentIdea} from "../../domain/models.js";
import {CompanyInfo, Repository} from "./repository.js";

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
            summary: idea.summary,
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

    async findUniqueCompanies(query: string): Promise<CompanyInfo[]> {
        if (!query || !query.trim()) return [];
        const pattern = `%${query.trim()}%`;
        const {data, error} = await this.client
            .from(IDEAS_TABLE)
            .select('ticker, company_name')
            .or(`ticker.ilike.${pattern},company_name.ilike.${pattern}`)
            .limit(50);

        if (error) throw new Error(`Supabase findUniqueCompanies failed: ${error.message}`);

        const result: CompanyInfo[] = [];
        const seen = new Set<string>();

        for (const r of data ?? []) {
            const ticker = r.ticker || '';
            const companyName = r.company_name || '';
            if (!ticker && !companyName) continue;
            const key = `${ticker}:${companyName}`;
            if (!seen.has(key)) {
                seen.add(key);
                result.push({ ticker, companyName });
            }
        }

        return result.slice(0, 20);
    }

    async findIdeasByCompany(companyOrTicker: string): Promise<InvestmentIdea[]> {
        if (!companyOrTicker || !companyOrTicker.trim()) return [];
        const val = companyOrTicker.trim();
        const {data, error} = await this.client
            .from(IDEAS_TABLE)
            .select('*')
            .or(`ticker.eq.${val},company_name.eq.${val}`)
            .order('publish_date', {ascending: false});

        if (error) throw new Error(`Supabase findIdeasByCompany failed: ${error.message}`);

        return (data ?? []).map((row: any) => this.toIdea(row));
    }

    private toIdea(row: any): InvestmentIdea {
        return {
            id: row.id,
            provider: row.provider,
            ticker: row.ticker,
            companyName: row.company_name,
            title: row.title,
            description: row.description,
            summary: row.summary ?? undefined,
            targetPrice: row.target_price,
            currency: row.currency,
            publishDate: row.publish_date,
        };
    }
}
