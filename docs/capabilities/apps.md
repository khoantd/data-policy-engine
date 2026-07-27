## Integrating Apps – System

**System ID**: `apps`  
**Title**: Integrating Apps  
**Kind**: System  
**Description**: External CRM / ERP / data platform that consumes the ROS Policy service.  
**Tags**: `external`  

---

### Purpose

The *Integrating Apps* system acts as the consumer of the ROS Policy engine. It submits data, policy definitions, and evaluation requests to ROS Policy via its public SDK or REST API (`/api/v1`) and consumes the responses to enforce data protection rules within its own data lifecycle. This enables the app to:

- Register and version retention or classification policies.
- Trigger policy evaluation on records stored in its own data stores.
- Receive audit events and enforcement results to maintain compliance logs.
- Dispatch actions (archive, delete, mask, etc.) through the ROS Policy action dispatcher.

---

### Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Policy Management** | Create, update, and retrieve policy YAML via the SDK or REST endpoints. |
| **Record Submission** | Push record payloads or identifiers to ROS Policy for evaluation. |
| **Evaluation Coordination** | Orchestrate batch or streaming evaluation requests and handle response timeouts. |
| **Action Handling** | Receive action callbacks (via webhook or SDK callbacks) and apply corresponding changes to the app’s data store. |
| **Audit Logging** | Store audit trail entries received from ROS Policy for compliance reporting. |
| **Error Handling** | Translate ROS Policy errors into application‑specific error flows, with retry/back‑off logic. |
| **Security & Auth** | Authenticate to ROS Policy (API keys, OAuth, or mutual TLS) and encrypt data in transit. |

---

### Interfaces and Dependencies

| Interface | Direction | Contract / Protocol | Notes |
|-----------|-----------|---------------------|-------|
| `REST /api/v1` | Outgoing | HTTP/HTTPS, JSON payloads, OAuth 2.0 or API key authentication | Primary channel for policy CRUD and evaluation requests. |
| `Python SDK` | Outgoing | Function calls that wrap the REST API | Used when the app runs in a Python environment; abstracts HTTP details. |
| `Webhook Receiver` | Incoming | HTTPS endpoint receiving `POST` requests from ROS Policy | Used to receive enforcement actions and audit events. |
| `Data Store` | Internal | Relational or NoSQL database used by the app | Stores records, policy metadata, and audit logs. |
| `Network` | Outgoing/Incoming | TCP/IP, TLS | Required for secure communication with ROS Policy. |
| `Monitoring` | Internal | Logs, metrics, alerts | Tracks integration health and latency. |

#### External Dependencies

- **ROS Policy** – must be available and reachable at the configured endpoint.
- **Authentication Service** – if OAuth is used, an identity provider is required.
- **Certificate Authority** – for mutual TLS if enabled.

---

### Constraints and Notes

- **External System** – No direct access to ROS Policy internal storage or code; all interactions must go through the public API or SDK.
- **Version Compatibility** – The system must track ROS Policy API version and migrate SDK or endpoint calls when new versions are released.
- **Latency** – Evaluation requests should be designed to tolerate the typical response time of ROS Policy (usually <200 ms for single record; larger for batch).
- **Security** – Sensitive data sent to ROS Policy must be encrypted in transit; consider data minimization if sending full record payloads.
- **Error Handling** – ROS Policy may return transient errors (e.g., 429, 502). The integrating system should implement retry with exponential back‑off.
- **Audit Trail** – The system should persist the audit trail records received via the audit API or webhook to meet regulatory requirements.
- **Scalability** – For high‑volume integrations, batch evaluation endpoints and asynchronous webhook processing should be used to avoid timeouts.

---

### Relationship

- **Outgoing**: `Integrating Apps → ROS Policy` via the SDK or REST `/api/v1` endpoints. This is the only path through which the system interacts with ROS Policy.
