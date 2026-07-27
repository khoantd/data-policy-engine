# Engine Core (Container)

## Purpose

The **Engine Core** is the central processing container of the ROS Policy system.  
It encapsulates all business logic required to interpret policy definitions, evaluate
policy compliance, classify data, enforce actions, and respond to DSAR (Data Subject
Access Request) events. It is designed to be **transport-agnostic**, enabling integration
as an in‑process Python SDK or via a RESTful HTTP API while keeping core logic
independent of external transport and persistence layers.

## Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Policy Parsing** | Convert YAML DSL policy definitions into an internal representation. |
| **Evaluation Engine** | Determine whether a data record should be retained, archived, anonymized, deleted, or otherwise processed based on active policies. |
| **Classification** | Run PII/SPII detection against records, matching classification rules. |
| **Enforcement** | Coordinate scheduled enforcement runs (via Scheduler) and trigger actions (webhooks, job dispatch) when policies are violated. |
| **DSAR Handling** | Process DSAR requests, ensuring compliance with policy and regulatory constraints. |
| **Guardrails Integration** | Optionally delegate guardrail evaluation to the OpenGuardrails Runtime through an adapter. |
| **Audit Trail** | Persist an append‑only record of all policy decisions and enforcement actions. |
| **Conflict Resolution** | Resolve overlapping or contradictory policy rules when evaluating a record. |
| **Jurisdiction Awareness** | Incorporate jurisdiction‑specific rules during evaluation. |

## Interfaces & Dependencies

### Incoming Ports (Clients)

| Port | Interface | Mode |
|------|-----------|------|
| **Python SDK** | `embedded_mode` | Direct in‑process calls to Engine Core functions. |
| **REST API** | `in_process` | HTTP/JSON endpoints exposing Engine Core services. |
| **Scheduler** | `EnforcementRunner` | Triggers periodic enforcement jobs (e.g., Celery scans). |

### Outgoing Ports (Adapters)

| Adapter | Purpose | Optionality |
|---------|---------|-------------|
| **OpenGuardrails Runtime** | Delegates guardrail evaluation; may be omitted if not using OpenGuardrails. | Optional |

### Core Ports (Internal)

Engine Core relies on several persistence and service ports (defined elsewhere in the architecture):

| Port | Role |
|------|------|
| **PolicyStore** | Persist policy definitions and revisions. |
| **AuditStore** | Store audit events and decision logs. |
| **JobStore** | Track scheduled enforcement jobs. |
| **DsarStore** | Store DSAR request data and outcomes. |
| **WebhookStore** | Store webhook configuration for enforcement notifications. |
| **GraceHoldStore** | Manage temporary holds on records during enforcement. |
| **CatalogStore** | Store metadata catalog (RoPA style). |
| **GuardrailPolicyStore** | Store guardrail policies for OpenGuardrails integration. |
| **RecordSource** | Provide access to the data records subject to evaluation. |
| **ActionDispatcher** | Execute actions (e.g., delete, anonymize, archive) on records. |
| **WebhookSender** | Send notifications to external systems. |

### Technology Stack

- **Language**: Python
- **Domain‑Specific Language**: YAML for policy definitions
- **Core Modules**: DSL Parser, Evaluator, Classifier, Enforcement, DSAR Service, Guardrails Integration, Conflict Resolver, Jurisdiction Module

## Constraints & Notes

- **Transport Independence**: Engine Core contains no knowledge of HTTP, Celery, or other transport mechanisms. All transport is handled by the inbound ports (SDK or REST API).
- **Hexagonal Architecture**: All external interactions are mediated through clearly defined ports and adapters, preserving separation of concerns.
- **Optional Guardrails**: The OpenGuardrails adapter is not required for core functionality. Engine Core can operate purely on its own policy engine.
- **Versioning & Diff**: Policy definitions are versioned; the Engine Core provides diffing capabilities to support rollback-as-new-version operations.
- **Audit‑Only**: All audit events are append‑only and immutable to satisfy compliance requirements.
- **Scalability**: The Engine Core is stateless with respect to application state; persistence is delegated to the ports, enabling horizontal scaling of the surrounding infrastructure (e.g., multiple Scheduler workers or API instances).
- **Security**: Sensitive policy and data are encrypted at rest; all communication with external adapters must use authenticated and authorized channels.
