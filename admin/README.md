# DRPE Admin Console

Next.js operations UI for the Data Retention Policy Engine API.

## Setup

```bash
cd admin
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with the same Bearer key as `DRPE_API_KEY` on the API (leave blank if API auth is disabled).

Ensure the API is running:

```bash
# from repo root
uvicorn drpe.api.app:app --reload --port 8000
```

Optional CORS (only needed for browser→API calls; the admin BFF talks server-to-server):

```bash
DRPE_CORS_ORIGINS=http://localhost:3000
```

## Design system

See [`design-system/MASTER.md`](design-system/MASTER.md) (ui-ux-pro-max). Tokens: Fira Sans / Fira Code, blue primary `#1E40AF`, amber accent `#D97706`.

## OpenAPI types

API response types come from the committed FastAPI schema (`../openapi/openapi.json`):

```bash
# from admin/
npm run openapi
# → lib/generated/schema.d.ts (re-exported via lib/types.ts)

# or from repo root (exports schema + all clients + admin types)
npm run openapi
```

The BFF client (`lib/drpe-client.ts`) stays hand-written; only model types are generated.

## AI assist & observability

Policy Import, Evaluate, and Scan playgrounds call LiteLLM through Next.js BFF routes under `app/api/ai/`. **Scan** (`/classify`) also calls `POST /api/v1/classify/dry-run` for PII detection against classification policies, and can generate synthetic scan records via `POST /api/ai/classify-sample`. Optional integrations:

| Variable | Purpose |
|----------|---------|
| `LITELLM_BASE_URL`, `LITELLM_API_KEY`, `LITELLM_MODEL` | Required for AI assist |
| `TAVILY_API_KEY` | Optional web research on Policy Import |
| `LANGSMITH_TRACING`, `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT`, `LANGSMITH_ENDPOINT` | Optional LangSmith trace export |
| `LANGSMITH_PROJECT_ID` | Optional project/session UUID (skips name lookup) |
| `LANGSMITH_TENANT_ID` | Optional workspace tenant UUID for LangSmith UI links |
| `LANGSMITH_WORKSPACE_ID` | Required for **service keys** (`lsv2_sk_…`) only — workspace tenant UUID, not project ID |
| `PRIVACY_MASK_ENABLED` | Optional — default on; masks PII before LiteLLM via FastAPI `privalyse-mask` |

**Privacy masking:** install the Python extra on the API (`pip install -e ".[ai]"` from repo root). The Admin BFF calls `POST /api/v1/privacy/mask` before LiteLLM and unmasks responses — mappings never leave the API process. See [privalyse-mask](https://github.com/khoantd/privalyse-mask).

When LangSmith is configured, open **Observability** in the console (`/observability`) to filter recent traces and jump to the LangSmith UI. Personal keys (`lsv2_pt_…`) should not set `LANGSMITH_WORKSPACE_ID` unless it is the tenant UUID. AI features work without LangSmith, Tavily, or privacy masking.
