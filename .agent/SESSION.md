# Agent session

> Cross-tool handoff state for Cursor, Claude Code, and Kiro. Update at session end (`/handoff`) or phase changes; read at session start (`/resume`).

## Meta

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-27 |
| **Phase** | build |
| **Tool** | cursor |
| **Persona** | frontend |

## Goal

Ship optional OpenGuardrails Guardrails plugin for DRPE (API + admin); agent policies evaluable/scannable like other kinds.

## Done

- Prior platform work — see history
- **Prod DB connection loss on startup (2026-07-25)** — engine/bootstrap hardening
- **OpenGuardrails Guardrails plugin (2026-07-27)**
  - Optional extra `drpe[guardrails]` → `openguardrails`
  - `drpe/guardrails/` service + Runtime factory + `DrpeDataSafetyDetector`
  - Store: memory + SQLAlchemy (`010_guardrail_policies`), seed `config/guardrails/default.policy.json`
  - API: `/api/v1/guardrails/{status,policies,evaluate}`
  - Admin: `/guardrails` console (AI nav), client + actions
  - Tests: 17 passing (`tests/test_guardrails_*.py`)
- **Agent policy evaluate/scan playground (2026-07-27)**
  - `/guardrails` mirrors Evaluate/Scan: active agent policies as targets, GuardEvent samples, verdict inspector
  - Deep link `?policy=` + policy detail “Try guardrails”
  - Scratch OGR docs moved to secondary `<details>`
  - Helpers + vitest: `admin/lib/guardrails-playground.ts`

## In progress

- _(none)_

## Next

1. Apply migration where needed: `alembic upgrade head` (`010` / `011_agent_ogr_policy`)
2. Install runtime: `pip install -e ".[guardrails]"` (or `.[dev]`)
3. Optional: AI sample BFF for GuardEvents (parity with evaluate/classify sample)
4. Optional: regenerate OpenAPI clients (`npm run openapi`); wrap admin LiteLLM BFF with OGR

## Decisions

- Feature ships as first-party optional module (Privacy pattern), not a Claude Code marketplace plugin
- Detectors: OGR `ConfigRulesDetector` + DRPE `DrpeDataSafetyDetector` (`drpe.data_safety`)
- Soft-unavailable → status `available: false`; evaluate → 503
- Agent kind playground is `/guardrails` (not `/evaluate` or `/classify`); API already resolves lifecycle agent `ogr_policy` by `policy_id`

## Gotchas

- Prefer Supabase session pooler URI for Docker/IPv4 (prior session)
- Guardrails requires `openguardrails` installed; admin page still loads policies when runtime missing
- Non-active agent policies return 409 on evaluate

## Pointers

| Item | Location |
|------|----------|
| Guardrails service | `drpe/guardrails/` |
| API routes | `drpe/api/routes_guardrails.py` |
| Seed policy | `config/guardrails/default.policy.json` |
| Admin UI | `admin/app/(console)/guardrails/page.tsx` |
| Playground helpers | `admin/lib/guardrails-playground.ts` |
| Design override | `admin/design-system/pages/guardrails.md` |
| Migration | `drpe/migrations/versions/010_guardrail_policies.py` |
| Tests | `python -m pytest tests/test_guardrails_*.py -v`; `cd admin && npx vitest run lib/guardrails-playground.test.ts` |
