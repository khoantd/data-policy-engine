# Project structure map

> Persistent overview for AI agents. Generated / refreshed by `/understand` (see `.cursor/commands/understand-project.md`). Update when architecture changes significantly.

## Meta

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-22 |
| **Tool** | cursor |

## Stack

**Application:** Python 3.11+ package `drpe` — Data Retention Policy Engine

| Layer | Choice |
|-------|--------|
| API | FastAPI + Uvicorn |
| Models / settings | Pydantic v2 + pydantic-settings |
| DSL | PyYAML |
| HTTP client (SDK) | httpx |
| Persistence | SQLAlchemy 2 + psycopg + Alembic → Postgres/Supabase (`drpe` schema) |
| Cache | Optional Redis (`CachingPolicyStore`) |
| Tests | pytest + pytest-asyncio + fakeredis |
| Architecture | Hexagonal — `ports/` + `adapters/` |

Folder name under `TypeScript/` is historical; the product is **Python**, not TypeScript.

## Layout

| Path | Purpose |
|------|---------|
| `drpe/` | Installable application package |
| `drpe/models/` | Domain models (Policy, Evaluation*, enums) |
| `drpe/dsl/` | YAML policy parser |
| `drpe/core/` | Evaluator, operators, conflict, jurisdictions, duration |
| `drpe/api/` | FastAPI app factory + `/api/v1` routes |
| `drpe/sdk/` | Remote `DRPEClient` + embedded `PolicyEvaluator` |
| `drpe/ports/` | Hexagonal ports (`PolicyStore`) |
| `drpe/adapters/` | InMemory, SqlAlchemy, Redis CachingPolicyStore |
| `drpe/db/` | SQLAlchemy Base, ORM rows, session helpers |
| `drpe/migrations/` | Alembic env + versions |
| `config/` | Example policy YAML (`gdpr_customer.yaml`) |
| `tests/` | Pytest suite (API, DSL, evaluator, SDK, SQLAlchemy, Redis) |
| `docs/ARCHITECTURE.md` | C4, DSL, API, schema design |
| `admin/` | Next.js ops console (BFF over `/api/v1`) |
| `openapi/` | Committed OpenAPI 3 schema (`openapi.json`) |
| `clients/` | Generated TypeScript / Go / Java HTTP clients |
| `tasks/` | `todo.md`, `plan.md` |
| `.agent/` | SESSION + PROJECT handoff |
| `.cursor/` / `.claude/` / `.kiro/` / `.agents/` | Agent hubs (sync via npm when present) |

## Entry points

- **API ASGI:** `uvicorn drpe.api.app:app` — factory `create_app()` in `drpe/api/app.py`
- **CLI script:** `drpe` → `drpe.api.app:main` (pyproject)
- **Docs UI:** `http://localhost:8000/docs`
- **SDK remote:** `from drpe import DRPEClient`
- **SDK embedded:** `from drpe import PolicyEvaluator` (wraps `PolicyEvaluatorEngine`)

### Store selection (`create_app`)

1. `DATABASE_URL` set → `SqlAlchemyPolicyStore`; else `InMemoryPolicyStore`
2. `REDIS_URL` / `DRPE_REDIS_URL` set → wrap with `CachingPolicyStore` + engine gen sync
3. YAML from `DRPE_POLICIES_DIR` (default `config/`) seeded when store empty (or `DRPE_SEED_YAML=true`; always for in-memory)

## Key files

- `drpe/api/app.py` — app factory, store wiring, Redis sync hook
- `drpe/api/settings.py` — env settings
- `drpe/api/routes_*.py` — policies, evaluate, health, jurisdictions
- `drpe/core/evaluator.py` — `PolicyEvaluatorEngine` + `evaluate`
- `drpe/dsl/parser.py` — YAML → Policy
- `drpe/ports/policy_store.py` — PolicyStore Protocol
- `drpe/adapters/sqlalchemy_store.py` / `redis_cache.py` / `memory_store.py`
- `drpe/sdk/client.py` / `embedded.py`
- `config/gdpr_customer.yaml` — example GDPR policy
- `alembic.ini` + `drpe/migrations/` — DB migrations
- `pyproject.toml` — package metadata and deps
- `.env.example` — env var template (never commit `.env`)

## Commands

| Action | Command |
|--------|---------|
| Install | `source .venv/bin/activate` then `pip install -e ".[dev]"` |
| Dev server | `uvicorn drpe.api.app:app --reload --port 8000` |
| Test | `python -m pytest tests/ -v` |
| Migrate | `alembic upgrade head` (requires `DATABASE_URL`) |
| Sync agent trees | `npm run sync:all` _(scaffolding only)_ |
| Export OpenAPI + clients | `npm run openapi` (needs venv for export) |

## Code intelligence

| Item | Status |
|------|--------|
| CodeGraph index | present — 64 files / 886 nodes (Python + YAML); healthy |
| Workspace root | `/Volumes/Data/Software Development/TypeScript/data-policy-engine` |
| OntoSight | `npx royalsolution-ontosight@0.2.1 "<workspace-root>" --symbol create_app --path drpe/api` |

## Notes

- Optional auth: Bearer `DRPE_API_KEY` only (OAuth2 deferred).
- Lowest rule `priority` number wins; conflicts returned in evaluation response.
- Redis multi-worker sync via generation stamp (`on_before_evaluate`), not pub/sub.
- Roadmap still open: audit monthly partitioning, webhook fan-out delivery.
- Prefer Supabase **session pooler** URI if direct `db.*.supabase.co` fails.
