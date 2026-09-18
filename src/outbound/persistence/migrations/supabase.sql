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
    publish_date timestamptz
);
