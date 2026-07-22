# Agent session

> Cross-tool handoff state for Cursor, Claude Code, and Kiro. Update at session end (`/handoff`) or phase changes; read at session start (`/resume`).

## Meta

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-22 |
| **Phase** | build |
| **Tool** | cursor |
| **Persona** | backend |

## Goal

Ship Admin UI (Next.js ops console) over existing `/api/v1`.

## Done

- Package layout under `drpe/` (models, dsl, core, api, sdk, ports, adapters)
- YAML DSL parser + Pydantic validation
- Evaluator with operators, priority conflict resolution, jurisdiction filter, grace/notify timestamps
- FastAPI `/api/v1` policies, evaluate, jurisdictions, health
- SDK: `DRPEClient`, `PolicyEvaluator`, `@enforce`
- Example policy `config/gdpr_customer.yaml`
- Docs: `README.md`, `docs/ARCHITECTURE.md`
- **SqlAlchemyPolicyStore** + Alembic migrations (`drpe` schema)
- App switches on `DATABASE_URL`; in-memory default for tests
- **CachingPolicyStore** + Redis helpers (`REDIS_URL`); ready PING; engine gen sync
- **Celery enforcement scheduler** + append-only **AuditStore**
- **DSAR workflow** (sync)
- **Webhook registration CRUD**
- **Policy diff and rollback**
- **Admin UI (Next.js)** under `admin/`
  - BFF + httpOnly API-key cookie; Overview, Policies (YAML/versions/diff/activate), DSAR, Audit, Webhooks, Enforce, **Evaluate playground**
  - Design system: Fira Sans/Code, blue/amber (`admin/design-system/`)
  - FastAPI `DRPE_CORS_ORIGINS` optional CORS
- **OpenAPI client generation** — `openapi/openapi.json` + `clients/{typescript,go,java}` via `npm run openapi`; Admin types via `openapi-typescript` → `admin/lib/generated/schema.d.ts`
- **Evaluate playground** — Admin `/evaluate` (single/batch, dry-run default); `DRPEClient.evaluate_dry_run`
- **Policy Import AI assist** — Admin `/policies/import` compose workspace (Generate/Polish/Enhance/Expand) via LiteLLM BFF `POST /api/ai/policy-suggest`; Monaco draft + validate/import; design override `admin/design-system/pages/policy-import.md`
- **Classification scan UX diagnostics** — `/classify` now returns policy applicability diagnostics, surfaces policy scope hints/source input, and distinguishes out-of-scope vs clean scans
- **Scan AI sample generation** — Admin `/classify` Generate sample data via LiteLLM BFF `POST /api/ai/classify-sample` (scenarios: auto/pii/spii/mixed/clean); fills single-record form only; never auto-runs scan
- **Docker** — `scripts/docker-build.sh` + README build/run steps (API + Admin images / Compose)
- **Postman** — README import guidelines for `postman/DRPE.postman_collection.json` + local env
- **Product rename** — user-facing brand is **ROS Policy** (Admin UI, API OpenAPI title, README, Postman display names, docs). Technical IDs unchanged: package `drpe`, env `DRPE_*`, SDK `DRPEClient`, Docker image names `drpe-api` / `drpe-admin`

## In progress

- _(none)_
- **Blockers:** Supabase/local DB still needs Alembic `005_policy_kind` applied anywhere the old schema is running

## Next

1. Apply Alembic `005_policy_kind` anywhere the classification schema is not yet migrated
2. Optional: AI assist on policy detail editor (same BFF)
3. Optional: fan-out delivery from registered webhooks (beyond `DRPE_WEBHOOK_URL`)
4. Optional: JWT OAuth2 scopes
5. Optional: audit_logs monthly partitioning
6. Optional: rename technical IDs (`drpe` package / `DRPE_*` env) if full code rebrand is desired

## Decisions

- Python FastAPI (not TypeScript) per user choice and original specs
- Persistence: Supabase lead-flow (`yshqwmldepsfckiacjwu`), private schema `drpe`
- `DATABASE_URL` unset → `InMemoryPolicyStore`; set → `SqlAlchemyPolicyStore`
- `REDIS_URL` unset → no cache; set → wrap store with `CachingPolicyStore`
- Auth: optional Bearer `DRPE_API_KEY` only (full OAuth2 deferred)
- Lowest rule `priority` number wins; conflicts listed in response
- Multi-worker engine sync via Redis generation stamp (`on_before_evaluate`), not pub/sub
- Enforcement: pluggable `RecordSource` + optional inline records on `POST /enforce`
- Celery broker: `CELERY_BROKER_URL` or `REDIS_URL`; memory/eager when unset
- Audit built with scheduler (append-only; partitioning deferred)
- DSAR: synchronous processing (no Celery); records via inline + RecordSource (`subject_id` match); erasure uses `legal_basis` / `erasure_exception` metadata vs policy `erasure_exceptions`
- Webhooks: registration CRUD only; env `DRPE_WEBHOOK_URL` still used for dispatch until fan-out lands
- Policy activate = rollback-as-new-version (never rewrite `policy_versions` history)
- Admin UI: Next.js App Router BFF in `admin/` (not static html-tailwind); API key in httpOnly cookie
- Policy Import AI: Admin BFF → remote LiteLLM (OpenAI-compatible); FastAPI stays validate/import only; never auto-import AI drafts
- Product name: **ROS Policy** (display); technical package/env remain `drpe` / `DRPE_*` unless a breaking rebrand is requested

## Gotchas

- Use project venv: `source .venv/bin/activate` then `python -m pip` / `python -m pytest`
- httpx `ASGITransport` is async-only; SDK tests inject FastAPI `TestClient` as `http_client`
- Policies load eagerly in `create_app()`; DB mode seeds YAML only when store empty (or `DRPE_SEED_YAML=true`)
- Prefer Supabase session pooler URI if direct `db.*.supabase.co` fails
- Redis tests use `fakeredis`; patch `drpe.api.app.create_redis_client` for API integration tests
- Celery `memory://` broker needs `cache+memory://` result backend (not `memory://`)
- Set enforcement runtime via `create_app` / `set_enforcement_runtime` before eager tasks run
- SQLite returns naive datetimes; `SqlAlchemyWebhookStore` / version `created_at` normalized to UTC-aware on read
- Admin: `cd admin && npm run dev` (port 3000); set `DRPE_API_URL`; server actions catch `NEXT_REDIRECT` when wrapping `redirect()`
- Admin AI assist: set `LITELLM_BASE_URL`, `LITELLM_API_KEY`, `LITELLM_MODEL` in `admin/.env.local`; import still works without them
- Admin unit tests: `cd admin && npm test` (vitest)
- OpenAPI clients: `npm run openapi` from repo root (venv active); regenerates `openapi/openapi.json` + `clients/*` + `admin/lib/generated/schema.d.ts`

## Pointers

| Item | Location |
|------|----------|
| Spec | `docs/ARCHITECTURE.md`, `README.md` |
| Tasks | `tasks/todo.md` |
| Admin UI | `admin/` (Next.js), `admin/design-system/MASTER.md` |
| Key files | `drpe/api/app.py` (CORS), `admin/lib/drpe-client.ts`, `admin/middleware.ts`, `openapi/openapi.json`, `clients/` |
| Tests | `python -m pytest tests/ -v` |
