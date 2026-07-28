# Architectural style\_2026-07-28 18:26

> AI-generated analysis for **Data Policy Engine**. Review and refine before treating as canonical documentation.
> Analyzed commit `ab512164`.

## 1. Detected style

### Confidence level

**High**

### Key observations

- **Hexagonal / Clean Architecture** – `drpe/ports` and `drpe/adapters` folders show a clear separation of domain logic (`drpe/core`) from infrastructure.  
- **Layered Service‑Oriented Stack** – three logical tiers: *Presentation* (`admin/` – Next.js), *Application* (`api/` – FastAPI) and *Domain* (`core/` – evaluation engine).  
- **API‑First / OpenAPI Contract** – the entire public surface is defined in `openapi/openapi.json`, from which TypeScript, Go, Java clients and admin BFF routes are generated.  
- **Background/Task Orchestration** – Celery workers (`worker`, `beat`) driven by a `scheduler/` module that enqueues jobs into a Redis broker.  
- **Optional Runtime Adapters** – Guardrails runtime (`drpe/guardrails`) and privacy‑masking (`privalyse‑mask`) are plugged in via dependency injection, keeping the core independent.  
- **Monorepo with Docker Compose** – `docker-compose.yml` orchestrates containers (`api`, `admin`, `worker`, `beat`) and supports an optional `celery` profile.

### Recommendations

- Keep the hexagonal boundaries explicit by adding a public `ports` interface module that other components (API, scheduler, SDK) import.  
- Use explicit dependency injection in `core` (e.g., via Python `typing.Protocol`) so that adapters can be swapped without recompilation.  
- Document the OpenAPI contract in the repo root (e.g., `docs/openapi.md`) to aid cross‑team understanding.

---

## 2. Structural evidence

### Confidence level

**High**

### Key observations

### Recommendations

- Add a `__init__.py` in `drpe/ports` to expose the public protocols, easing imports.  
- Generate documentation for the ports module to clarify the contract for adapters.

---

## 3. Boundaries and layering

### Confidence level

**High**

### Key observations

1. **Presentation** – `admin/` (Next.js) acts as a UI layer and a lightweight BFF.
2. **Application** – `drpe/api` exposes HTTP endpoints; uses FastAPI dependencies to inject core services.
3. **Domain** – `drpe/core` contains pure business logic with no external dependencies.
4. **Infrastructure** – `drpe/adapters` implements ports for databases, cache, guardrails, privacy.
5. **Background Processing** – `drpe/scheduler` + Celery workers provide asynchronous enforcement.
6. **External Dependencies** – Guardrails runtime, LiteLLM, and downstream webhooks are optional and decoupled via adapters.

The boundaries align with the LikeC4 model:  

- `adminConsole` ↔ `api` ↔ `coreEngine` ↔ `scheduler` ↔ `db`/`cache`.  
- Optional `guardrailsRuntime` and `externalHooks` map to the `guardrailsRuntime` and `externalHooks` containers in the diagram.

### Recommendations

- Explicitly expose each boundary through a public `__all__` list in `drpe/__init__.py`.  
- Consider packaging the API as a separate pip package (`drpe-api`) to reinforce the separation in deployment.  
- In the Docker Compose file, isolate the `worker`/`beat` services under a dedicated network to limit visibility.

---

## 4. Coupling and hotspots

### Confidence level

**Medium**

### Key observations

### Recommendations

1. **Define strict interface contracts** – Use `typing.Protocol` for all ports and enforce runtime checks to prevent accidental coupling.
2. **Isolate optional runtimes** – Wrap Guardrails and privacy adapters in a factory that raises a clear error if the runtime is missing, reducing hidden dependencies.
3. **Use dependency injection containers** – FastAPI's `Depends` can be extended with a container (e.g., `punq`) to decouple construction of services from their usage.
4. **Automate contract tests** – Generate tests from `openapi.json` (e.g., with `schemathesis`) to detect breaking changes in the API that affect UI and SDK clients.

---

## 5. Recommendations

### Confidence level

**High**

### Key observations

- The repo already embodies a clean, layered architecture with optional runtime adapters and a well‑defined API contract.  
- Deployment is containerized but could benefit from stricter separation of concerns and more explicit contracts.

### Actionable recommendations

These steps reinforce the existing Clean‑Architecture foundation, reduce coupling hotspots, and improve maintainability as the project evolves.
