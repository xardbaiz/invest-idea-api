import Database from 'better-sqlite3';
import {InvestmentIdea, SearchResult} from "../../domain/models.js";
import {Repository} from "./repository.js";
import {getExtensionPath} from '@sqliteai/sqlite-vector';

const EMBEDDING_DIMENSION = Number(process.env.EMBEDDING_DIMENSION ?? 256);

export class SqlLiteIdeaRepository implements Repository {
    private db: Database.Database;

    constructor() {
        this.db = new Database('invest_ideas.db');
        this.db.loadExtension(getExtensionPath());

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
                publish_date TEXT
            )
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS idea_embeddings
            (
                idea_id   TEXT PRIMARY KEY REFERENCES ideas (id),
                embedding BLOB NOT NULL
            )
        `);

        this.db.exec(`SELECT vector_init('idea_embeddings', 'embedding', 'dimension=${EMBEDDING_DIMENSION},type=FLOAT32,distance=COSINE')`);
    }

    async upsert(idea: InvestmentIdea) {
        this.db.prepare(`
            INSERT INTO ideas (id, provider, ticker, company_name, title, target_price, currency, description,
                               publish_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET description  = excluded.description,
                                          target_price = excluded.target_price
        `).run(
            idea.id, idea.provider, idea.ticker, idea.companyName,
            idea.title, idea.targetPrice, idea.currency,
            idea.description, idea.publishDate
        );
    }

    async findById(id: string): Promise<InvestmentIdea | undefined> {
        const row: any = this.db.prepare(`SELECT *
                                          FROM ideas
                                          WHERE id = ?`).get(id);
        return row ? this.toIdea(row) : undefined;
    }

    async hasEmbedding(ideaId: string): Promise<boolean> {
        const row = this.db.prepare(`SELECT 1
                                     FROM idea_embeddings
                                     WHERE idea_id = ?`).get(ideaId);
        return !!row;
    }

    async saveEmbedding(ideaId: string, embedding: number[]): Promise<void> {
        const blob = Buffer.from(new Float32Array(embedding).buffer);
        this.db.prepare(`
            INSERT INTO idea_embeddings (idea_id, embedding)
            VALUES (?, vector_as_f32(?))
            ON CONFLICT(idea_id) DO UPDATE SET embedding = vector_as_f32(excluded.embedding)
        `).run(ideaId, blob);
    }

    async searchSimilar(queryEmbedding: number[], limit: number, from?: string, to?: string): Promise<SearchResult[]> {
        const queryBlob = Buffer.from(new Float32Array(queryEmbedding).buffer);

        let dateFilter = '';
        const params: any[] = [];

        if (from) {
            dateFilter += ' AND i.publish_date >= ?';
            params.push(from);
        }
        if (to) {
            dateFilter += ' AND i.publish_date <= ?';
            params.push(to);
        }

        // Streaming mode with JOIN and date filtering
        const rows: any[] = this.db.prepare(`
            SELECT i.ticker, i.company_name, i.title, i.target_price, i.currency, i.description, v.distance
            FROM vector_full_scan('idea_embeddings', 'embedding', ?) AS v
                     JOIN idea_embeddings e ON e.rowid = v.rowid
                     JOIN ideas i ON i.id = e.idea_id
            WHERE 1 = 1 ${dateFilter}
            LIMIT ?
        `).all(queryBlob, ...params, limit);

        return rows.map(row => ({
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
            targetPrice: row.target_price,
            currency: row.currency,
            publishDate: row.publish_date,
        };
    }
}
