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
    summary      TEXT,
    digest       jsonb,
    publish_date timestamptz
);

-- Add digest column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ideas' AND column_name = 'digest'
    ) THEN
        ALTER TABLE ideas ADD COLUMN digest jsonb;
    END IF;
END $$;
