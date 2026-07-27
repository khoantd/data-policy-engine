# REST API  
**Container** – Data Policy Engine (billing‑service)

---

## Purpose  
The REST API serves as the external-facing interface for the ROS Policy engine. It exposes all policy‑management and evaluation operations (policy CRUD, evaluation, classification, guardrails, enforcement, and DSAR) to client applications and the admin UI. By adhering to a stable `/api/v1` surface, it enables decoupled integration via HTTP or the Python SDK while delegating core logic to the Engine Core.

---

## Responsibilities  

| Responsibility | Details |
|----------------|---------|
| **Request handling** | Accepts incoming HTTP requests from the Admin Console and Python SDK; validates authentication (Bearer token from `DRPE_API_URL`) and request payload. |
| **API contract** | Provides endpoints under `/api/v1` for: <br>• Policy lifecycle (`policy`, `policy/{id}`, `policy/{id}/history`, `policy/{id}/diff`) <br>• Policy evaluation (`evaluate`, `classify`) <br>• Guardrails (`guardrails`) <br>• Enforcement actions (`enforce`, `enforce/scan`) <br>• DSAR requests (`dsar`, `dsar/{id}`) |
| **Data persistence** | Persists policy definitions, audit logs, and related metadata to PostgreSQL via SQLAlchemy. |
| **Caching** | Optionally serves policy data from Redis using the `CatchingPolicyStore` for read‑heavy operations. |
| **Business logic delegation** | Delegates evaluation, classification, enforcement, and DSAR processing to the Engine Core (in‑process). |
| **Monitoring & metrics** | Emits OpenTelemetry metrics and logs for observability. |

---

## Interfaces & Dependencies  

| Direction | Source / Target | Interface Type | Notes |
|-----------|-----------------|----------------|-------|
| **Incoming** | Admin Console | HTTPS + Bearer token | Uses `DRPE_API_URL` endpoint; authenticated via JWT. |
| | Python SDK | HTTP | Uses standard HTTP client; no authentication required within the SDK (token is supplied by the SDK consumer). |
| **Outgoing** | PostgreSQL | SQLAlchemy ORM | Stores all policy artifacts, audit records, and version history. |
| | Redis | Optional CachingPolicyStore | Caches frequently accessed policy definitions to reduce DB load. |
| | Engine Core | In‑process function calls | FastAPI routes call core components directly; no inter‑process communication. |

---

## Constraints & Notes  

- **Technology stack** – The container is implemented in **FastAPI** with a Python runtime (3.9+).  
- **Security** – All external endpoints require bearer authentication; internal calls to the Engine Core bypass authentication as they are trusted.  
- **Scalability** – Horizontal scaling is limited by the in‑process dependency on Engine Core; for higher throughput consider a dedicated API gateway or load‑balancer.  
- **Persistence** – PostgreSQL schema must support versioned policy tables and audit trails; migrations are handled via Alembic.  
- **Caching** – Redis usage is optional; when enabled, cache invalidation is performed on policy updates.  
- **Deployment** – Containerized in Docker; exposed via `DRPE_API_URL` and bound to port 8000 (default FastAPI).  
- **Testing** – Unit tests cover request validation and delegation to Engine Core; integration tests validate DB and cache interactions.  

---

*This document is a draft capability description. Validate the content against the latest project artifacts before finalization.*
