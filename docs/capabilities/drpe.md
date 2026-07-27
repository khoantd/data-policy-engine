# ROS Policy (Data Retention & Policy Engine)

**System ID:** `drpe`  
**Owner:** Platform Team  
**Repository:** <https://github.com/khoantd/data-policy-engine.git>  
**Last Updated:** 2026‑07‑27  

---

## Purpose

ROS Policy is a **stand‑alone policy engine** that allows applications to:

- **Define** retention, classification, and governance rules with a YAML DSL.  
- **Evaluate** records against those rules to decide on retention actions (archive, anonymise, delete, etc.).  
- **Classify** data for PII/SPII detection using configurable classifiers.  
- **Enforce** policies through scheduled scans, webhooks, and action dispatch.  
- **Audit** all policy decisions in an immutable, append‑only trail.  
- **Version** policy documents with full history, diffs, and rollback support.  
- **Govern** system‑level compliance metadata (RoPA‑style catalog).  
- **Operate** an Admin UI (Next.js BFF) that shares the same `/api/v1` surface.  
- **Guard** LLM/agent workflows via OpenGuardrails policy evaluation when installed.  

---

## Responsibilities

| Area | Responsibility |
|------|----------------|
| **Policy Lifecycle** | CRUD and versioning of policy YAML files, including structural diffs and rollback. |
| **Evaluation Engine** | Parse DSL, evaluate policies against incoming records, and produce action decisions. |
| **Classification** | Detect PII/SPII patterns and flag records according to classification policies. |
| **Enforcement** | Run scheduled Celery scans, invoke webhooks, and dispatch actions to downstream systems. |
| **Audit & Logging** | Record every decision, action, and state change in an append‑only audit trail. |
| **Governance Metadata** | Store RoPA‑style catalog entries linking policies to system processes. |
| **Admin UI & BFF** | Provide a user interface for policy management, status monitoring, and configuration. |
| **Guardrails Integration** | Expose guardrail evaluation to OpenGuardrails when the module is installed. |
| **LLM Interaction** | Offer a masked prompt interface to LiteLLM via the Admin BFF. |

---

## Interfaces and Dependencies

### Incoming Interfaces

| Source | Interface | Purpose |
|--------|-----------|---------|
| **Integrating Apps** | SDK (Python) or REST `/api/v1` | Submit records, retrieve policy decisions, and manage policies. |
| **OpenGuardrails** | Guardrails evaluation API | Trigger policy checks when the guardrails module is present. |
| **Downstream Webhooks** | Webhook payloads | Receive action dispatch from ROS Policy during enforcement. |
| **LiteLLM** | Admin BFF masked prompt endpoint | Provide safe prompt data for LLM workflows. |

### Outgoing Interfaces

| Adapter | Function |
|---------|----------|
| **RecordSource** | Pull records for scanning from data stores. |
| **ActionDispatcher** | Push enforcement actions to external services. |
| **WebhookSender** | Deliver webhooks to downstream receivers. |
| **JobStore (Celery)** | Schedule and track enforcement jobs. |
| **AuditStore** | Append audit events. |
| **PolicyStore** | Persist policy definitions and versions. |
| **DsarStore** | Store DSAR request state. |
| **GraceHoldStore** | Manage grace‑period holds. |
| **CatalogStore** | Store governance metadata. |
| **GuardrailPolicyStore** | Persist guardrail policies. |

### External Dependencies

- **Python 3.11+** runtime for SDK and core engine.  
- **Celery** (or compatible task queue) for scheduled enforcement.  
- **PostgreSQL/MySQL** (or any SQL DB) for policy, audit, and catalog storage.  
- **Redis/Memcached** for in‑memory caching if configured.  
- **OpenGuardrails** optional module when integrated.  
- **LiteLLM** optional module for LLM prompt handling.

---

## Constraints and Notes

- **Transport‑agnostic Core**: The evaluation, classification, and enforcement logic reside in the core and are independent of REST or SDK usage.  
- **Hexagonal Architecture**: Ports expose all persistence, messaging, and external integrations; adapters implement the concrete logic.  
- **Versioned Policies**: Every policy change creates a new immutable version; rollback is implemented as a “new version” with previous state.  
- **Immutability**: Audit records are write‑only and never overwritten.  
- **Security**: Sensitive prompts for LiteLLM are masked in the Admin BFF; no raw prompts are stored.  
- **Governance**: The system does not enforce RoPA metadata itself but provides APIs to link policies to process catalog entries.  
- **Scalability**: Core evaluation is CPU‑bound; horizontal scaling is achieved by running multiple worker instances behind Celery.  
- **Deployment**: The system can be deployed as a Docker image (GitHub repo contains Dockerfile) or installed via pip for in‑process use.  

---

## Summary

ROS Policy delivers a robust, transport‑agnostic engine for defining, evaluating, classifying, enforcing, and auditing data policies. It exposes clear SDK and REST interfaces to application developers, integrates optional guardrails and LLM tooling, and maintains an immutable audit trail for compliance and DSAR handling.
