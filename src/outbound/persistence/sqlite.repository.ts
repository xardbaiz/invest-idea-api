import Database from 'better-sqlite3';
import {InvestmentIdea} from "../../domain/models";
import {Repository} from "./repository";

export class SqlLiteIdeaRepository implements Repository {
    private db = new Database('invest_ideas.db');

    constructor() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ideas
            (
                id              TEXT PRIMARY KEY,
                provider        TEXT,
                ticker          TEXT,
                company_name    TEXT,
                title           TEXT,
                categories_json TEXT,
                target_price    REAL,
                currency        TEXT,
                description     TEXT,
                publish_date    TEXT
            )
        `);
    }

    async upsert(idea: InvestmentIdea) {
        const stmt = this.db.prepare(`
            INSERT INTO ideas (id, provider, ticker, company_name, title, categories_json, target_price, currency,
                               description, publish_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET categories_json = excluded.categories_json
        `);

        // TODO return result
        stmt.run(
            idea.id, idea.provider, idea.ticker, idea.companyName,
            idea.title, JSON.stringify(idea.categories),
            idea.targetPrice, idea.currency, idea.description, idea.publishDate
        );
    }

    async findById(id: string): Promise<InvestmentIdea | undefined> {
        const row: any = this.db.prepare(`
            SELECT id,
                   provider,
                   ticker,
                   company_name,
                   title,
                   categories_json,
                   target_price,
                   currency,
                   description,
                   publish_date
            FROM ideas
            WHERE id = ?
        `).get(id);

        if (!row) {
            return undefined;
        }

        let categories: string[];
        try {
            categories = JSON.parse(row.categories_json)
        } catch (e) {
            console.error('Failed to parse categories from DB of idea:', row.id, e);
            categories = [];
        }

        return {
            id: row.id,
            provider: row.provider,
            ticker: row.ticker,
            companyName: row.company_name,
            title: row.title,
            description: row.description,
            targetPrice: row.target_price,
            currency: row.currency,
            categories: categories,
            publishDate: row.publish_date
        };
    }

    async findCategoriesByIdeaId(id: string): Promise<string[] | undefined> {
        const row: any = this.db.prepare("SELECT categories_json FROM ideas WHERE id = ?").get(id);
        return row ? JSON.parse(row.categories_json) : undefined;
    }

    async findByCategory(category: string, from?: string, to?: string): Promise<InvestmentIdea[]> {
        let sql = "SELECT * FROM ideas WHERE LOWER(categories_json) LIKE LOWER(?)";
        const params: any[] = [`%${category}%`];

        if (from) {
            sql += " AND publish_date >= ?";
            params.push(from);
        }
        if (to) {
            sql += " AND publish_date <= ?";
            params.push(to);
        }

        return (this.db.prepare(sql).all(...params) as any[]).map(row => ({
            ...row,
            categories: JSON.parse(row.categories_json)
        }));
    }
}