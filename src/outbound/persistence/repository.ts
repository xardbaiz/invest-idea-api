import Database from 'better-sqlite3';
import {InvestmentIdea} from "../../domain/models";

export class IdeaRepository {
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

    upsert(idea: InvestmentIdea) {
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

    findCategoriesByIdeaId(id: string): string[] | undefined {
        const row: any = this.db.prepare("SELECT categories_json FROM ideas WHERE id = ?").get(id);
        return row ? JSON.parse(row.categories_json) : undefined;
    }
    findByCategory(category: string): InvestmentIdea[] {
        // Используем SQL оператор LIKE для поиска в JSON массиве
        const rows = this.db.prepare("SELECT * FROM ideas WHERE categories_json LIKE ?")
            .all(`%${category}%`);

        return (rows as any[]).map(row => ({
            ...row,
            categories: JSON.parse(row.categories_json)
        }));
    }
}