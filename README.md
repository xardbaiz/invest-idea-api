# invest-idea-api

Collect, store and categorize invest ideas from broker news

## Environment variables

### AI (any OpenAI-compatible endpoint)

The application has no notion of AI providers. Point it at any endpoint that speaks the
OpenAI API (`/chat/completions` and `/embeddings`) — a router, a gateway, a local server —
and the endpoint decides which upstream model actually answers.

| Variable                 | Required | Description                                                                        |
|--------------------------|----------|------------------------------------------------------------------------------------|
| `OPENAI_API_URL`         | yes      | Base URL of the OpenAI-compatible endpoint, e.g. `https://router.local/v1`.        |
| `OPENAI_MODEL`           | yes      | Model name passed through to `/chat/completions` (and used for embeddings).        |
| `OPENAI_API_KEY`         | no       | Sent as `Authorization: Bearer <key>`; omit for endpoints without auth.            |
| `OPENAI_EMBEDDING_MODEL` | no       | Separate model name for `/embeddings`; defaults to `OPENAI_MODEL`.                 |
| `EMBEDDING_DIMENSION`    | no       | When set, sent as `dimensions` in embedding requests and used by the vector index. |

`OPENAI_BASE_URL` is still accepted as a fallback for `OPENAI_API_URL`.

### Vector store

When `QDRANT_EMBEDDING_MODEL` (or the other `QDRANT_*` variables) is set, Qdrant performs the
inference itself and the AI endpoint is only used for summaries.
