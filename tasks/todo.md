# TODO: DRPE Python v1

## Phase 1: Foundation
- [x] Task 1.1: Pydantic models + YAML DSL parser
- [x] Task 1.2: Duration parsing + operators

## Checkpoint: Foundation Complete

## Phase 2: Core Features
- [x] Task 2.1: Policy evaluator + conflict resolver + jurisdictions
- [x] Task 2.2: In-memory PolicyStore + FastAPI routes
- [x] Task 2.3: Python SDK (remote + embedded + enforce)

## Checkpoint: Core Complete

## Phase 3: Polish
- [x] Task 3.1: pyproject, README/docs, config example, SESSION/PROJECT
- [x] Task 3.2: Full pytest suite green (33 tests)

## Phase 4: Supabase PolicyStore
- [x] Task 4.1: SQLAlchemy/psycopg/alembic deps + DATABASE_URL settings
- [x] Task 4.2: `drpe` schema ORM + Alembic initial migration (RLS on)
- [x] Task 4.3: SqlAlchemyPolicyStore + version snapshots
- [x] Task 4.4: App factory Protocol wiring + YAML seed + ready probe
- [x] Task 4.5: SQLite store tests + docs; migrate lead-flow

## Deferred (roadmap)
- [x] Redis policy cache
- [x] Immutable audit log (append-only; partitioning deferred)
- [x] Celery enforcement scheduler
- [x] DSAR workflow
- [x] Webhooks registration CRUD
- [x] Policy diff and rollback (list/get/diff/activate)
- [x] Admin UI

## OpenAPI clients
- [x] Export committed OpenAPI schema (`openapi/openapi.json`)
- [x] Generate TypeScript / Go / Java clients under `clients/` (`npm run openapi`)
- [x] Admin OpenAPI types generator (`admin` `npm run openapi` → `lib/generated/schema.d.ts`)
