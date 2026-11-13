# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

TypeScript repository using native ES modules (`"type": "module"` in `package.json`).

Import statements in TypeScript source files include the `.js` extension (e.g.
`import { Service } from "./service.js"`).

## Architecture

- `src/domain/services/api.service.ts` — `ApiService` centralizes core business logic for searching investment ideas and
  discovering topics. It is the shared layer for both the MCP factory and the HTTP server.
- `src/http.server.ts` — Express HTTP server.
    - Only starts and listens on port 3000 when the environment variable `HTTP_SERVER_ENABLED` is set to `'true'`.
      Otherwise `npm run http:run` exits immediately without opening a network port.
    - `/` serves the project landing page and `/ideas` serves the investment ideas search interface.
    - `express.static` uses `{ index: false }` so that routes inspect `req.query.lang` or
      `req.headers['accept-language']` via `getLanguageFromHeader` (`src/views/ui/i18n/i18n.ts`) to dynamically inject
      `lang="..."` into `dist/public/index.html`.
    - MCP integration uses NodeStreamableHTTPServerTransport from `@modelcontextprotocol/node` handling all HTTP methods
      on `/mcp`. `getMcpServer` in `src/mcp.factory.ts` accepts an optional `ApiService` parameter to reuse existing
      service instances.
- `src/views/client.tsx` — client hydration detects language from `?lang=...`, `document.documentElement.lang`, or
  `navigator.language` fallback.

## HTTP API endpoints (src/http.server.ts)

- `GET /api/:ticker/risk-return` — stock risk/return score breakdowns.
- `GET /api/:ticker/recommendations` — recommendation consensus data.
- `GET /api/ideas/:id/digest` — localized markdown digest for an investment idea.

## Investment ideas and digests

- Investment ideas support a localized markdown digest JSON field stored in database repositories.
- `ApiService.getIdeaDigest` retrieves existing digests or requests new markdown digests from an external n8n webhook
  (`https://n8n.app.xardbaiz.im/webhook/BuIOXzq5LNfrt8sP/api/ideas/digests`).
- `InvestmentIdeaInfo` model contains an optional `summary` field.
- `SyncScheduler` checks for `summary` and generates it via `AiService.generateSummary` before calculating vector
  embeddings.
- Vector embeddings are generated from `summary`; search API results and UI render `summary` instead of the full
  description.

## Vector store

- `VectorStoreService` is instantiated by `createVectorStoreService()` (`src/outbound/vector/vector-store.factory.ts`).
- Uses `QdrantVectorService` if Qdrant environment variables (`QDRANT_URL`, `QDRANT_API_KEY`, or
  `QDRANT_EMBEDDING_MODEL`) are present, otherwise falls back to `VectraVectorService`.
- `VectorStoreService` supports `isSupportInference()`, enabling server-side inference in Qdrant when
  `QDRANT_EMBEDDING_MODEL` is set.

## Tradernet client

- `TradernetProvider` (`src/outbound/clients/tradernet.ts`) routes command-based API requests through `sendApiRequest`.
- Supports optional HMAC-SHA256 signature authentication headers (`X-NtApi-PublicKey`, `X-NtApi-Timestamp`,
  `X-NtApi-Sig`) when Tradernet public/private key environment variables (`TRADERNET_PUBLIC_KEY`/`TRADERNET_API_KEY` and
  `TRADERNET_PRIVATE_KEY`/`TRADERNET_SECRET_KEY`) are set.
- Logs API errors using `console.error`.

## UI conventions

UI views live in `src/views/ui/` (Header, SearchForm, IdeasTable, IdeaRow, App, AnalyticsDiagrams).

- Always prefer Material UI components over custom HTML when working with React pages (`.tsx` files).
- UI views utilize `@mui/material` and `@mui/x-charts` components for styling, layout, and visualization, wrapped in the
  theme exported from `src/views/ui/theme.ts`.
- `AnalyticsDiagrams` (`src/views/ui/AnalyticsDiagrams.tsx`) uses `@mui/x-charts` (`PieChart` for the recommendations
  doughnut chart and `RadarChart` for the risk/return diagram) to render animated visualizations.
- `IdeasTable` and `IdeaRow` render investment ideas using `@mui/material` table components with a 3-column header
  layout (Ticker/Company, Current Price/Target Price/Relevance, Analytics) and an expandable analytics diagrams view
  along with a full-width summary and digest block underneath.
- Expansion of summary (`isSummaryExpanded`) and AI markdown digest (`isDigestExpanded`) are controlled independently
  and default to collapsed (`false`).
- Markdown digests in `IdeaRow` are rendered using `react-markdown` with `remark-gfm` mapped to Material UI components.
- `SearchForm` and `App` default the `to` date picker parameter to today's date (`YYYY-MM-DD`) and the `from` parameter
  to the 1st day of the month 2 months prior, if not explicitly provided.

## Working with concurrent user changes

Even while a task or agent session is still in progress and awaiting user input, the user may edit the same files
directly.

- Treat unexpected changes to code that is still in progress as user-made changes.
- Do not revert, overwrite, or "restore" such changes if they look functional.
- Inspect the current file state before editing, merge your changes with the existing ones, and only replace user edits
  when they are clearly broken or the user explicitly asks for it.

## Database migrations

SQL migration scripts for Supabase are stored in `src/outbound/persistence/migrations/` and must be idempotent,
utilizing `CREATE TABLE IF NOT EXISTS` and `CREATE OR REPLACE FUNCTION`.

## Testing

- Execution command for tests: `node --experimental-vm-modules node_modules/jest/bin/jest.js`.
- The project uses Jest with ts-jest. Jest is configured to handle ESM via `useESM: true` and a `moduleNameMapper` that
  strips `.js` extensions for compatibility with ts-jest.
- Integration tests should use real internal service implementations (like `AiService`) but mock external service calls
  (OpenAI, Tradernet) and the Repository layer. Real database implementations (Supabase, SQLite) must be avoided in
  tests.
