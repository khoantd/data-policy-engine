# Agent session

> Cross-tool handoff state for Cursor, Claude Code, and Kiro. Update at session end (`/handoff`) or phase changes; read at session start (`/resume`).

## Meta

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-24 |
| **Phase** | build |
| **Tool** | cursor |
| **Persona** | frontend |

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
- **Admin Vercel readiness** — `admin/vercel.json` (framework nextjs); `engines.node >=20`; dual-target `next.config` (standalone when not `VERCEL`); docs for Root Directory=`admin` + `DRPE_API_URL`; build/tests green
- **Backend VPS build** — `scripts/build-backend.sh` builds API image only; `--save` writes `dist/drpe-api-<tag>.tar.gz` for scp/load on VPS
- **Admin Vercel deploy** — `scripts/deploy-admin.sh` defaults to **Royal Platform** (`SCOPE=royal-platform`, project `ros-policy-admin`); `--link --yes` creates/links; preview / `--prod`
- **Celery worker boot** — lazy imports in `drpe.api` / `drpe.scheduler` break circular import so `celery -A drpe.scheduler.celery_app.celery_app worker` starts; README notes worker is required when Redis broker is set
- **API Docker alignment** — `INSTALL_AI` build-arg; Compose `worker`/`beat` via `--profile celery`; README + `build-backend.sh` VPS recipes document Redis+worker; smoke OK (`celery`/`alembic`/`006`/health)
- **Admin load UX** — `(console)/loading.tsx` + `PageSkeleton`; Overview/Insights Suspense streaming; Overview single audit fetch (limit 250) + lazy Recharts; Evaluate/Classify list+lazy `GET /api/policies/[id]` + parallel privacy probe; policy detail `Promise.all` get+versions
- **Admin list pagination** — shared `admin/lib/pagination.ts` + `PaginationBar` / `PaginationControls`; `?page=` on Policies (client slice), Audit/DSAR/Enforce/Grace holds/Webhooks (API `limit`/`offset` over-fetch), Observability traces (client slice); page size 25
- **AI reference sources persistence** — Import posts Tavily `reference_sources` with YAML; stored on Policy/ClassificationPolicy + DB column `008`; detail page shows saved `AiSourceReferences` (collapsed); YAML editor strips provenance
- **Policy structure network graph** — Admin `/policies/graph` (fleet) + Structure panel on policy detail via `reagraph`; shared `buildPolicyStructureGraph` + adjacency a11y; Insights remains ReactFlow

## In progress

- _(none)_
- **Blockers:** Supabase/local DB may need `alembic upgrade head` (through `008_policy_reference_sources`) where schema is behind

## Next

1. Apply `alembic upgrade head` anywhere the DB schema is not yet at 008+
2. Set `DRPE_API_URL` on Vercel project `royal-platform/ros-policy-admin` (Production/Preview), then redeploy
3. When Redis/Celery broker is set: `docker compose --profile celery up` (or separate worker/beat containers); else `DRPE_CELERY_EAGER=true`
4. Optional: AI assist on policy detail editor (same BFF)
5. Optional: fan-out delivery from registered webhooks (beyond `DRPE_WEBHOOK_URL`)
6. Optional: JWT OAuth2 scopes
7. Optional: audit_logs monthly partitioning
8. Optional: rename technical IDs (`drpe` package / `DRPE_*` env) if full code rebrand is desired
9. Optional: short `revalidate`/tagged cache for list GETs if Admin→API RTT still dominates after load UX pass
10. Optional: API `total` count on list endpoints for exact page-of-N UI without over-fetch
11. Optional: lazy full-policy expand on fleet structure graph (v1 uses list summaries only)

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
- AI reference sources: provenance metadata on the policy (not YAML DSL / not `scope.sources`); HTTPS-only URLs; preserved across YAML re-saves
- Product name: **ROS Policy** (display); technical package/env remain `drpe` / `DRPE_*` unless a breaking rebrand is desired
- Admin load UX: prefer `loading.tsx` + Suspense over `revalidate` for ops freshness; playgrounds use list metadata + lazy full policy
- List pagination: URL `?page=` (1-based), default 25 rows; API lists over-fetch `pageSize+1` for `hasNext` (no total in API); Policies/Observability slice client-side after filter

## Gotchas

- Audit log is **not** an HTTP access log: only `EnforcementRunner` + `DsarService` call `AuditStore.append`. Privacy/evaluate/policies/classify GETs write nothing. Live `POST /enforce` stays `queued` until a Celery worker consumes Redis (or eager mode); DSAR is sync and audits immediately.
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
- AI references: require migration `008_policy_reference_sources`; Import body optional `reference_sources`; detail Provenance panel only when non-empty

## Pointers

| Item | Location |
|------|----------|
| Spec | `docs/ARCHITECTURE.md`, `README.md` |
| Tasks | `tasks/todo.md` |
| Admin UI | `admin/` (Next.js), `admin/design-system/MASTER.md` |
| Key files | `drpe/api/app.py` (CORS), `admin/lib/drpe-client.ts`, `admin/middleware.ts`, `openapi/openapi.json`, `clients/` |
| Load UX | `admin/app/(console)/loading.tsx`, `admin/components/ui/page-skeleton.tsx`, `admin/lib/use-lazy-policy.ts` |
| Pagination | `admin/lib/pagination.ts`, `admin/components/ui/pagination.tsx` |
| AI references | `drpe/models/policy.py` (`ReferenceSource`), `008_policy_reference_sources`, `admin/components/ai-source-references.tsx`, `admin/lib/reference-sources.ts` |
| Policy structure graph | `admin/lib/policy-structure-graph.ts`, `admin/components/policy-structure-graph.tsx`, `/policies/graph`, design `admin/design-system/pages/policy-graph.md` |
| Tests | `python -m pytest tests/ -v` |
