# ROS Policy Admin Console

Next.js operations UI for the ROS Policy API.

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

## Deploy on Vercel

Import this Git repository in [Vercel](https://vercel.com/new) and set the project **Root Directory** to `admin` (required — the repo root is the Python/OpenAPI project, not Next.js).

| Setting | Value |
|---------|--------|
| Root Directory | `admin` |
| Framework | Next.js (auto-detected) |
| Install / Build | defaults (`npm install` / `npm run build`) |
| Node.js | ≥ 20 (`engines` in `package.json`) |

### CLI deploy (recommended)

Deploys to the **Royal Platform** team by default (`SCOPE=royal-platform`, project `ros-policy-admin`).

From the repo root (requires [Vercel CLI](https://vercel.com/docs/cli) — `npm i -g vercel` or `npx`):

```bash
chmod +x scripts/deploy-admin.sh   # once

./scripts/deploy-admin.sh --link --yes   # first time: create/link on Royal Platform
./scripts/deploy-admin.sh                # preview
./scripts/deploy-admin.sh --prod         # production
./scripts/deploy-admin.sh --yes --prod   # non-interactive (CI)
```

Override team/project if needed: `--scope other-team --project my-admin`.

Set `VERCEL_TOKEN` (and optionally `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`) for CI — never commit tokens. Backend API stays on your VPS; build it with `./scripts/build-backend.sh`.

After the first deploy, set the API base URL on Royal Platform:

```bash
vercel env add DRPE_API_URL production --scope royal-platform --cwd admin
./scripts/deploy-admin.sh --prod
```

### Environment variables

Set these in the Vercel project (Production / Preview as needed):

| Variable | Required | Notes |
|----------|----------|-------|
| `DRPE_API_URL` | **Yes** | Public HTTPS base URL of the FastAPI API (no trailing slash) |
| `DRPE_API_KEY` | No | Skip in production unless you want auto-login without the login form (middleware treats an env key as a session) |
| `LITELLM_BASE_URL`, `LITELLM_API_KEY`, `LITELLM_MODEL` | No | Required only for AI assist |
| `TAVILY_API_KEY` | No | Optional web research on Policy Import |
| `LANGSMITH_*` | No | Optional Observability / tracing — see table below |
| `PRIVACY_MASK_ENABLED` | No | Optional; default on when masking is available on the API |

`vercel.json` in this directory sets `framework: nextjs`. Docker continues to use `output: "standalone"` locally; on Vercel that flag is omitted automatically.

**AI route duration:** Policy Import / Evaluate / Scan sample routes set `maxDuration = 60`. Plans that cap serverless functions below 60s will time out on long LiteLLM calls — use a plan (or Fluid Compute settings) that allows 60s if you rely on AI assist.

**CORS:** Admin→API is server-side BFF, so `DRPE_CORS_ORIGINS` is **not** required for Vercel Admin. Set it on the API only if browsers call the API directly. The API must be reachable over HTTPS from Vercel’s servers.

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
