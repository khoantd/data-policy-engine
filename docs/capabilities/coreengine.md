# Engine Core (coreEngine) Capability Description

## Purpose
The **Engine Core** is the central evaluation engine of ROS Policy. It performs the core logic for parsing retention & classification policies, evaluating records against those policies, classifying data, resolving conflicts, and orchestrating enforcement actions. It is designed to be agnostic of transport, storage, and deployment details, exposing clean interfaces for in‑process SDK usage, remote REST calls, and scheduled enforcement jobs.

## Responsibilities
| Responsibility | Detail |
|-----------------|--------|
| **Policy Parsing** | Parse YAML DSL policy definitions into internal policy objects. |
| **Evaluation** | Determine retention or action decisions for individual records based on policy rules. |
| **Classification** | Detect and label PII/SPII elements in records using policy‑defined classifiers. |
| **Conflict Resolution** | Apply business rules to resolve contradictory policy directives. |
| **Policy Diff & Versioning** | Compute structural differences between policy versions and support rollback-as‑new‑version. |
| **Enforcement Orchestration** | Coordinate scheduled scans (via Scheduler) and trigger enforcement actions (webhooks, action dispatch). |
| **Audit Trail** | Emit audit events for all policy evaluations and enforcement outcomes to the audit store. |
| **Guardrails Integration** | Optionally evaluate OpenGuardrails policies through a runtime adapter. |

## Interfaces and Dependencies
### Incoming
| Interface | Type | Direction | Notes |
|-----------|------|-----------|-------|
| **REST API** | HTTP/JSON | In‑process | Exposes `/api/v1` endpoints for external applications. |
| **Python SDK** | Python library | Embedded | Allows in‑process calls to evaluation functions. |
| **Scheduler (EnforcementRunner)** | Task queue (Celery) | In‑process | Triggers periodic enforcement scans. |

### Outgoing
| Interface | Type | Direction | Notes |
|-----------|------|-----------|-------|
| **OpenGuardrails Runtime** | Optional adapter | Outgoing | Used only when guardrail policies are enabled. |

### Dependencies (Ports)
| Port | Purpose |
|------|---------|
| **PolicyStore** | Persist policy definitions and history. |
| **AuditStore** | Persist audit events. |
| **JobStore** | Persist enforcement job state. |
| **DsarStore** | Store DSAR request/response data. |
| **WebhookStore** | Store webhook configurations. |
| **GraceHoldStore** | Store grace‑period overrides. |
| **CatalogStore** | Store system catalog metadata. |
| **GuardrailPolicyStore** | Store OpenGuardrails policy definitions. |
| **RecordSource** | Retrieve records for evaluation. |
| **ActionDispatcher** | Trigger enforcement actions. |
| **WebhookSender** | Send webhooks to external systems. |

## Constraints and Notes
- **Hexagonal Architecture**: Core logic is decoupled from adapters; all persistence, messaging, and transport are implemented via ports and adapters, enabling independent scaling and testing.
- **Python 3.x**: The implementation is in pure Python, making it lightweight and portable across cloud and on‑prem environments.
- **Optional OpenGuardrails**: The OpenGuardrails integration is optional; the core functions normally without it. When enabled, an adapter must be supplied to the `OpenGuardrails Runtime` port.
- **Performance**: Evaluation is CPU‑bound; batch processing is used where possible. The design supports horizontal scaling of the Scheduler for large data volumes.
- **Versioning**: Policies are immutable once committed; new versions are created via a `create` API that records diff and timestamp.
- **Security**: All APIs require OAuth2 scopes defined in the Admin UI. Audit logs are immutable (append‑only) and protected via signed JWTs.

---
