# Agent session

> Cross-tool handoff state for Cursor, Claude Code, and Kiro. Update at session end (`/handoff`) or phase changes; read at session start (`/resume`).

## Meta

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-25 |
| **Phase** | build |
| **Tool** | cursor |
| **Persona** | backend |

## Goal

Fix prod API crash: `psycopg.OperationalError: the connection is lost` during uvicorn startup bootstrap against Supabase.

## Done

- Prior platform work — see history
- **Prod DB connection loss on startup (2026-07-25)**
  - Root cause: SQLAlchemy/psycopg3 first connect through Supabase Supavisor without pooler-safe settings; bootstrap `list_policies()` killed the process
  - `create_db_engine`: `prepare_threshold=None`, `pool_recycle=300`, TCP keepalives, `sslmode=require` for `*.supabase.*`
  - `normalize_database_url` helper; startup `_bootstrap_store` retries transient `OperationalError` (0.5s/1s/2s)
  - Tests: `tests/test_db_session.py` (8); `.env.example` / README pooler notes

## In progress

- _(none)_
- **Blockers:** Redeploy API image/wheel with this fix; confirm `DATABASE_URL` uses pooler host (not IPv6-only `db.*.supabase.co`) from Docker

## Next

1. **Redeploy** API (rebuild Docker image / reinstall wheel) so prod picks up `drpe/db/session.py` + `drpe/api/app.py`
2. Verify container starts: logs show policies loaded (or retry then ready), `/api/v1/health` OK
3. If still failing: confirm `DATABASE_URL` is session pooler (`*.pooler.supabase.com:5432`) or transaction (`:6543`) with `postgres.<ref>` user — not direct `db.*` from IPv4-only hosts
4. Optional: `npm run publish:local` for TS client; apply `alembic upgrade head` where schema behind

## Decisions

- Always disable psycopg prepared statements — required for transaction pooler, harmless elsewhere
- Fail startup after 4 bootstrap attempts (still fail closed if DB is truly down)

## Gotchas

- `from drpe.api import app` resolves the ASGI app via package `__getattr__` and calls `create_app()` (loads `.env`) — tests must `import drpe.api.app as app_module`
- Prefer Supabase **session pooler** URI for Docker/IPv4; direct host is often IPv6-only
- Wrong pooler region/host → `FATAL tenant/user ... not found`

## Pointers

| Item | Location |
|------|----------|
| Engine hardening | `drpe/db/session.py` |
| Bootstrap retry | `drpe/api/app.py` (`_bootstrap_store`) |
| Tests | `tests/test_db_session.py` |
| Env examples | `.env.example` |
| Spec / tasks | `docs/ARCHITECTURE.md`, `tasks/todo.md` |
| Tests | `python -m pytest tests/ -v` (use `.venv/bin/python`) |
