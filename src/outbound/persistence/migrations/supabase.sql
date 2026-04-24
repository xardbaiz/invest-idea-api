-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the ideas table if it doesn't exist
CREATE TABLE IF NOT EXISTS ideas
(
    id           TEXT PRIMARY KEY,
    provider     varchar NOT NULL,
    ticker       varchar,
    company_name varchar,
    title        varchar,
    target_price numeric,
    currency     varchar,
    description  TEXT,
    publish_date timestamptz
);

-- Create the idea_embeddings table if it doesn't exist
-- We use the vector type without a fixed dimension to support different models (e.g., 256, 768, 1536)
CREATE TABLE IF NOT EXISTS idea_embeddings
(
    idea_id   TEXT PRIMARY KEY REFERENCES ideas (id) ON DELETE CASCADE,
    embedding vector
);

-- Create or replace the search_ideas RPC function
CREATE OR REPLACE FUNCTION search_ideas(
    query_embedding vector,
    match_limit int,
    date_from text DEFAULT NULL,
    date_to text DEFAULT NULL
)
    RETURNS TABLE
            (
                ticker       text,
                company_name text,
                title        text,
                target_price real,
                currency     text,
                description  text,
                distance     float
            )
    LANGUAGE sql
    STABLE
AS
$$
SELECT i.ticker,
       i.company_name,
       i.title,
       i.target_price,
       i.currency,
       i.description,
       1 - (e.embedding <=> query_embedding) AS distance
FROM idea_embeddings e
         JOIN ideas i ON i.id = e.idea_id
WHERE (date_from IS NULL OR i.publish_date >= date_from::timestamptz)
  AND (date_to IS NULL OR i.publish_date <= date_to::timestamptz)
ORDER BY e.embedding <=> query_embedding
LIMIT match_limit;
$$;