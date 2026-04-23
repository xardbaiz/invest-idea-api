import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {InvestmentIdea, SearchResult} from "../../domain/models.js";
import {Repository} from "./repository.js";

const IDEAS_TABLE = 'ideas';
const EMBEDDINGS_TABLE = 'idea_embeddings';

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

    async hasEmbedding(ideaId: string): Promise<boolean> {
        const {data, error} = await this.client
            .from(EMBEDDINGS_TABLE)
            .select('idea_id')
            .eq('idea_id', ideaId)
            .maybeSingle();

        if (error) throw new Error(`Supabase hasEmbedding('${ideaId}') failed: ${error.message}`);
        return !!data;
    }

    async saveEmbedding(ideaId: string, embedding: number[]): Promise<void> {
        const {error} = await this.client.from(EMBEDDINGS_TABLE).upsert({
            idea_id: ideaId,
            embedding: JSON.stringify(embedding),
        }, {onConflict: 'idea_id'});

        if (error) throw new Error(`Supabase saveEmbedding('${ideaId}') failed: ${error.message}`);
    }

    /**
     * Requires a Supabase SQL function:
     *
     * CREATE OR REPLACE FUNCTION search_ideas(query_embedding vector, match_limit int, date_from text DEFAULT NULL, date_to text DEFAULT NULL)
     * RETURNS TABLE(ticker text, company_name text, title text, target_price real, currency text, description text, distance float)
     * LANGUAGE sql STABLE AS $$
     *   SELECT i.ticker, i.company_name, i.title, i.target_price, i.currency, i.description,
     *          1 - (e.embedding <=> query_embedding) AS distance
     *   FROM idea_embeddings e
     *   JOIN ideas i ON i.id = e.idea_id
     *   WHERE (date_from IS NULL OR i.publish_date >= date_from)
     *     AND (date_to IS NULL OR i.publish_date <= date_to)
     *   ORDER BY e.embedding <=> query_embedding
     *   LIMIT match_limit;
     * $$;
     */
    async searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<SearchResult[]> {
        const {data, error} = await this.client.rpc('search_ideas', {
            query_embedding: JSON.stringify(queryEmbedding),
            match_limit: limit,
            date_from: from ?? null,
            date_to: to ?? null,
        });

        if (error) throw new Error(`Supabase searchSimilar failed: ${error.message}`);

        return (data ?? []).map((row: any) => ({
            idea: {
                ticker: row.ticker,
                companyName: row.company_name,
                title: row.title,
                targetPrice: row.target_price,
                currency: row.currency,
                description: row.description,
            },
            distance: row.distance,
        }));
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
