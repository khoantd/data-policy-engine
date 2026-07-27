# Downstream Webhooks – Capability Description

**System** | **Downstream Webhooks**  
**Project** | Data Policy Engine (billing‑service)  
**Owner** | platform team  
**Tags** | external  

---

## Purpose

Downstream Webhooks is an external service that receives enforcement actions dispatched by the ROS Policy engine. It acts as the entry point for downstream processes (e.g., data deletion, archival, notification, or audit) triggered by policy evaluation. By providing a simple, secure HTTP endpoint, the system decouples policy evaluation from the actions that must be taken on data stores or downstream applications.

---

## Responsibilities

- **Ingest Enforcement Actions** – Accept inbound HTTP POST requests carrying enforcement action payloads from the ROS Policy Action dispatcher.
- **Validate Payloads** – Ensure that the request body conforms to the expected schema (action type, target identifiers, timestamp, signature or token). Reject malformed or unauthorized requests.
- **Log Reception** – Persist a minimal, immutable audit record of each received action (e.g., timestamp, payload hash, source IP). The record is stored in the system’s own audit trail for traceability.
- **Trigger Downstream Workflows** – Enqueue or directly invoke downstream services (e.g., storage deletion, archival queues) based on the action type. The actual work is performed by the downstream service; Downstream Webhooks merely initiates the flow.
- **Handle Retries and Idempotency** – Accept repeated calls for the same action and respond with an idempotent status, ensuring downstream processes are not executed multiple times.

---

## Interfaces and Dependencies

| Interface | Direction | Description |
|-----------|-----------|-------------|
| **HTTP/HTTPS POST /enforcement** | Incoming | Receives JSON payloads containing enforcement actions from ROS Policy’s Action dispatcher. |
| **Audit Store** | Outgoing | Writes immutable audit entries for every received action. |
| **Downstream Service Queue** | Outgoing | Publishes a message or triggers a job for the relevant downstream system (e.g., deletion, archival). |

*Dependencies:*  
- **ROS Policy Action dispatcher** – Supplies action payloads.  
- **TLS Certificate** – Secures the inbound connection.  
- **Authentication token or signature** – Validates the source of the request.

---

## Constraints and Notes

- **Security** – All inbound traffic must use TLS 1.2 or higher. Requests must include a bearer token or signed payload verified against a shared secret managed by the platform team.
- **Payload Size** – Maximum payload size is 1 MB. Requests exceeding this limit are rejected with a `413 Payload Too Large` response.
- **Idempotency** – Each action includes a unique `action_id`. The system must detect duplicates and return a `200 OK` with the same result without re‑processing.
- **Availability** – The service must be reachable over a load‑balanced HTTPS endpoint. A health‑check endpoint `/health` returns `200 OK` when the service is operational.
- **Statelessness** – The service does not maintain session state between requests. All state is stored in the audit store or passed to downstream queues.
- **Extensibility** – While currently only one downstream consumer is defined, the architecture allows additional consumers to be added without modifying the webhook endpoint.

---
