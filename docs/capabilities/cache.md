# Redis Cache & Broker Container

## Purpose
The **Redis** container serves as a dual‑purpose in‑memory store for the Data Policy Engine (billing‑service).  
* It caches policy data to reduce read latency for the REST API.  
* It acts as a message broker for scheduled enforcement jobs, allowing the Scheduler to push and consume tasks via a queue interface.

## Responsibilities
| Responsibility | Description |
|-----------------|-------------|
| **Caching** | Stores serialized policy objects (YAML DSL) and lookup results to accelerate repeated policy evaluations performed by the REST API. |
| **Brokering** | Provides a lightweight message queue for the Scheduler to publish enforcement job messages; consumed by worker processes that perform policy enforcement. |
| **Persistence (optional)** | If configured, persists Redis data to disk to survive restarts (useful for broker durability). |

## Interfaces and Dependencies
- **Incoming from Scheduler**  
  *Role:* Broker/Backend*  
  The Scheduler container publishes job messages to a Redis queue (e.g., `enforcement:jobs`) and may also subscribe to status updates.  
- **Incoming from REST API**  
  *Role:* Optional CachingPolicyStore*  
  The REST API container retrieves cached policy data from Redis. If the policy is not cached, it falls back to the primary PolicyStore.  
- **Dependencies**  
  * Scheduler (Python/Celery) – requires Redis as a broker.  
  * REST API (Next.js BFF) – optional dependency on Redis for caching.  
  * Network: Must be reachable over the internal Docker network or VPC.  
- **Exposed Ports**  
  - `6379/tcp` – standard Redis client port.  
  - (Optional) `16379/tcp` – Redis Sentinel port if HA is configured.

## Constraints and Notes
- **Technology Version** – Use a Redis version that is supported by the project’s Python SDK (≥6.0).  
- **Security** – Authentication via `requirepass` and TLS should be enabled in production deployments to prevent unauthorized access.  
- **Persistence** – For broker durability, enable `appendonly` or snapshots; otherwise, the broker is transient.  
- **Scaling** – Horizontal scaling (Redis cluster) is not currently in scope; the container runs a single node.  
- **Monitoring** – Expose Redis metrics (INFO, MONITOR) for Prometheus or Grafana dashboards.  
- **Data Lifetime** – Cached policy data should have a TTL to ensure cache consistency after policy updates.  

---

**Note:** This description is derived from the provided C4 element and project context. Verify configuration details and any additional responsibilities before implementation.
