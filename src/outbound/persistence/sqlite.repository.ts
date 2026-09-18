import Database from 'better-sqlite3';
import {InvestmentIdea} from "../../domain/models.js";
import {Repository} from "./repository.js";

export class SqlLiteIdeaRepository implements Repository {
    private db: Database.Database;

    constructor() {
        this.db = new Database('invest_ideas.db');

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ideas
            (
                id           TEXT PRIMARY KEY,
                provider     TEXT,
                ticker       TEXT,
                company_name TEXT,
                title        TEXT,
                target_price REAL,
                currency     TEXT,
                description  TEXT,
                summary      TEXT,
                publish_date TEXT
            )
        `);

        try {
            this.db.exec(`ALTER TABLE ideas ADD COLUMN summary TEXT`);
        } catch {
            // Column already exists
        }
    }

    async upsert(idea: InvestmentIdea) {
        this.db.prepare(`
            INSERT INTO ideas (id, provider, ticker, company_name, title, target_price, currency, description, summary,
                               publish_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET description  = excluded.description,
                                          target_price = excluded.target_price,
                                          summary      = excluded.summary
        `).run(
            idea.id, idea.provider, idea.ticker, idea.companyName,
            idea.title, idea.targetPrice, idea.currency,
            idea.description, idea.summary ?? null, idea.publishDate
        );
    }

    async findById(id: string): Promise<InvestmentIdea | undefined> {
        const row: any = this.db.prepare(`SELECT *
                                          FROM ideas
                                          WHERE id = ?`).get(id);
        return row ? this.toIdea(row) : undefined;
    }

    async findByIds(ids: string[]): Promise<InvestmentIdea[]> {
        if (ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const rows: any[] = this.db.prepare(`SELECT *
                                              FROM ideas
                                              WHERE id IN (${placeholders})`).all(...ids);
        return rows.map(row => this.toIdea(row));
    }

    async findTitlesByDateRange(from: string, to: string): Promise<string[]> {
        const rows: any[] = this.db.prepare(`
            SELECT title
            FROM ideas
            WHERE publish_date >= ?
              AND publish_date <= ?
        `).all(from, to);
        return rows.map(r => r.title);
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
