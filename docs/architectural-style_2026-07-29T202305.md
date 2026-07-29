# Architectural style\_2026-07-29 20:23

> AI-generated analysis for **Data Policy Engine**. Review and refine before treating as canonical documentation.
> Analyzed commit `105bb538`.

## 1. Detected style

### Confidence level

High

### Key observations

- **Service‑oriented micro‑service boundaries**: Separate containers for admin UI, FastAPI API, scheduler, and optional guardrails runtime.
- **Layered architecture** inside each container: presentation (Next.js), API layer (FastAPI + FastAPI routers), domain/service layer (the `drpe.core` Python package that implements policy evaluation and enforcement), infrastructure adapters (database, cache, Celery broker).
- **Domain‑driven design**: Policy DSL, evaluation engines, and guardrails runtime are packaged as a distinct domain module (`drpe` Python package).
- **Contract‑first approach**: OpenAPI specification drives all HTTP clients and is regenerated on each build, enforcing a clear interface contract.
- **Polyglot client generation**: TypeScript, Go, Java, and Python SDKs are automatically generated, indicating a multi‑language API surface.

### Recommendations

- None required; the style matches the repository’s design intent.

## 2. Structural evidence

### Confidence level

High

### Key observations

### Recommendations

- Document the directory layout in a high‑level diagram or README for new contributors.
- Keep the `drpe` domain package self‑contained: expose only public interfaces, hide implementation details behind adapters.

## 3. Boundaries and layering

### Confidence level

High

### Key observations

- **Container boundaries** (defined by Docker Compose and Dockerfiles) correspond to the LikeC4 model: `adminConsole`, `api`, `scheduler`, `coreEngine`, `db`, `cache`, `guardrailsRuntime`.
- **Layering within the API**: FastAPI routers expose endpoints, delegate to service layer (`drpe.core`), which in turn uses adapters (e.g., database, cache, guardrails runtime).
- **Asynchronous boundary**: `scheduler` (Celery) consumes job messages from the message broker (`cache`/Redis) and interacts with the core engine to perform enforcement.
- **External integration boundaries**: Admin UI communicates with API over HTTPS; SDK clients communicate via HTTP; guardrails runtime is optional and plugged in via dependency injection.

### Recommendations

- Explicitly document the public API of the `drpe.core` package (e.g., `evaluate_policy`, `enforce_job`) and keep it stable.
- Use interface adapters for optional components (guardrails, AI) so that the core engine remains independent of external services.

## 4. Coupling and hotspots

### Confidence level

Medium

### Key observations

- **Tight coupling** between the API and core engine: the API imports `drpe.core` modules directly; changing domain logic may require API changes.
- **Coupling via OpenAPI**: clients are regenerated from `openapi.json`; any contract change requires regeneration and distribution to all client languages.
- **Optional dependencies** (`privalyse-mask`, LiteLLM, OpenGuardrails) increase coupling through conditional imports and environment variables.
- **Celery worker** shares code with the API (imports same `drpe.core`), potentially leading to version drift if the worker is executed in a different environment.
- **Admin UI** depends on the BFF routes for AI and privacy masking; if the API changes, the UI may break.

### Recommendations

- Introduce a **service façade** for the core engine (e.g., `drpe.api.service`) that validates inputs and isolates API from domain implementation.
- Version the OpenAPI contract explicitly; use semantic versioning and backward‑compatibility checks in CI.
- Separate the Celery worker into its own repository or Docker image that pins the `drpe` package version to avoid accidental drift.
- Document optional features (AI, guardrails) and their impact on the core engine, and provide feature flags or environment‑based injection.

## 5. Recommendations

### Confidence level

High

### Key observations

- The current architecture aligns well with the LikeC4 model but exhibits some tight coupling risks.
- The polyglot client strategy and contract‑first approach are strengths but need disciplined version control.
- The optional AI and guardrails features add complexity but are optional via environment variables.

### Recommendations

- **Decouple API from domain**: Introduce a thin service layer that performs validation and error handling, keeping the API code minimal.
- **Externalize versioning**: Tag OpenAPI releases and publish them to a dedicated registry; ensure clients depend on a specific version.
- **Automated contract tests**: Run tests that verify the generated clients against the API implementation (e.g., HTTP bin tests, contract‑driven tests).
- **Feature flagging**: Use a dedicated configuration system or feature flag library to enable/disable AI, guardrails, or privacy masking without code changes.
- **CI/CD pipeline**: Ensure that Docker builds, OpenAPI generation, and client publishing are part of the same pipeline; run integration tests across all clients.
- **Documentation**: Add a high‑level architecture diagram (e.g., using Mermaid or C4) that mirrors the LikeC4 model but references actual repo paths and Docker services.
- **Testing strategy**: Expand unit tests for the core engine and integration tests for the scheduler to cover job queue interactions. Use pytest fixtures for database and Redis mocks.

These actions will reinforce the architectural boundaries, reduce coupling hotspots, and keep the system maintainable as new features and languages are added.
