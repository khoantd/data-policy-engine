# Python SDK

**Container** – `drpe` package  
**Owner team** – platform  
**Repository** – <https://github.com/khoantd/data-policy-engine.git>

---

## Purpose
The Python SDK provides a lightweight, in‑process client for the ROS Policy engine. It allows developers to:
* Submit policy definitions (YAML DSL) and records for evaluation or classification.
* Retrieve evaluation results or classification outcomes.
* Trigger or inspect policy enforcement actions.
* Access the same `/api/v1` surface that the Admin UI uses, but from within a Python process.

The SDK can operate in two modes:
1. **Remote mode** – HTTP client talks to the ROS Policy REST API.
2. **Embedded mode** – Directly instantiates the Engine Core components and executes evaluations locally.

---

## Responsibilities
| Area | Responsibility |
|------|----------------|
| **Transport** | Expose a convenient, type‑safe API for making HTTP requests to the `/api/v1` REST endpoints. |
| **Evaluation** | Wrap the embedded `Engine Core` (DSL parser, evaluator, classifier) so callers can evaluate policies without a network round‑trip. |
| **Policy management** | Provide helper functions to upload, update, delete, or fetch policy definitions from the Policy Store. |
| **Result handling** | Normalise response payloads into Python objects, handling success, failure, and audit information. |
| **Configuration** | Allow configuration of base URL, authentication tokens, logging, and optional embedded mode toggles. |

---

## Interfaces and Dependencies
| Interface | Description | Dependency |
|-----------|-------------|------------|
| `Client` | Core entry point. Initializes either the HTTP transport or the embedded engine based on configuration. | `requests` (HTTP), `drpe.core` (Engine Core) |
| `evaluate(record, policy_id)` | Submit a record for evaluation against a policy. Returns an `EvaluationResult` object. | `drpe.core.Evaluator` |
| `classify(record)` | Classify a record using the Classifier component. | `drpe.core.Classifier` |
| `policy_upload(yaml_str)` | Upload a new policy to the Policy Store via REST or local store. | REST API endpoint `/policies` or `drpe.core.PolicyStore` |
| `policy_fetch(policy_id)` | Retrieve a policy definition. | REST API endpoint `/policies/{id}` or `drpe.core.PolicyStore` |
| `audit_log()` | Retrieve audit trail entries. | REST API `/audit` |
| **Transport layer** | Underlying HTTP client or direct Core invocation. | `urllib3`/`requests` for HTTP, `drpe.core` modules for embedded mode. |
| **Authentication** | Handles bearer token or API key injection into HTTP headers. | Environment variables or config file. |

The SDK does **not** expose low‑level storage adapters or Celery workers; those belong to the full service deployment.

---

## Constraints and Notes
* **Versioning** – The SDK follows the same semantic versioning as the `drpe` package. Keep API surface stable across releases to avoid breaking downstream consumers.
* **Security** – When used in remote mode, ensure TLS is enabled and the base URL is validated. The SDK does not perform certificate pinning; rely on the underlying HTTP client.
* **Embedded mode limitations** – The embedded evaluator requires the same runtime environment as the core (Python 3.10+). It does not support policy enforcement jobs or Celery scheduling; those are available only via the REST API.
* **Dependencies** – Avoid pulling in heavy frameworks. The SDK should remain lightweight; only standard library and minimal third‑party packages (`requests`) are required.
* **Error handling** – All API calls should raise `drpe.exceptions.SDKError` subclasses to allow caller code to discriminate between network failures, validation errors, and evaluation failures.
* **Testing** – The SDK should be unit‑tested against a mock HTTP server for remote mode and against the real Engine Core for embedded mode. Use dependency injection to swap transport layers.

---

## References
- ADR‑0000: ROS Policy — Architecture  
- Core architecture diagram in the `coreComponents` view  
- REST API spec (`/api/v1` surface) in the `index` view  

---
