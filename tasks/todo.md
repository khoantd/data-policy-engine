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

## SDK alignment (2026-07-24)
- [x] `DRPEClient.classify_batch` + Bearer headers on injected `http_client`
- [x] Embedded `PolicyEvaluator` loads retention + classification; `classify` / `classify_dry_run` / `classify_batch`
- [x] Public exports: `ClassificationRequest` / `ClassificationResponse`
- [x] Example `config/gdpr_pii_classification.yaml` set to `active` (matches evaluate sample)
- [x] Admin BFF `classifyBatch`
- [x] Postman: Systems / Processes / Grace Holds + policy catalog links (44/44 OpenAPI paths)

## SDK packaging (2026-07-25)
- [x] Base `pip install` = lightweight SDK (`pydantic`/`pyyaml`/`httpx`); server via `[api]`
- [x] `scripts/build-sdk.sh` → `dist/drpe-*.whl` + sdist for other projects
- [x] Dockerfile installs `.[api]` / `.[api,ai]`; `drpe.cli:main` entry with clear missing-extra error
- [x] README: install + consume-in-other-project docs

## TypeScript OpenAPI client packaging (2026-07-25)
- [x] `clients/typescript` npm package hardened (`exports`, `files`, CJS+ESM)
- [x] Packaging overlays preserved on regen (`.openapi-generator-ignore`)
- [x] `scripts/build-ts-client.sh` / `npm run build:ts-client` → `dist/drpe-api-client-0.1.0.tgz`
- [x] Verified clean-project `npm install` of tarball exports all `*Api` + `Configuration`

