# OpenGuardrails Runtime

## Purpose  
The **OpenGuardrails Runtime** is a Python package that serves as an optional runtime adapter for the ROS Policy (Data Policy Engine) core. It provides the execution environment for GuardEvent‑based policies, enabling the Engine Core to evaluate agent/LLM workflows against OpenGuardrails policies when configured. This container is lightweight, dependency‑free, and can be toggled on or off by application configuration.

## Responsibilities  
- **GuardEvent Evaluation** – Execute GuardEvent policies supplied by the Engine Core and return evaluation results (allow/deny, actions, metadata).  
- **Adapter Layer** – Translate core‑level policy requests into the format expected by OpenGuardrails and feed responses back into the Engine Core.  
- **Runtime Management** – Initialise, maintain, and shut down the GuardEvent runtime as a service‑level component, ensuring proper resource handling.  
- **Optional Integration** – Operate only when OpenGuardrails policies are enabled; otherwise the Engine Core bypasses this container without failure.  

## Interfaces & Dependencies  
| Interface | Direction | Description |
|-----------|-----------|-------------|
| **`engine_core → ogr_runtime` (incoming)** | Request | Engine Core sends a policy evaluation request (payload, context, target record). |
| **`ogr_runtime → engine_core` (outgoing)** | Response | Returns a GuardEvent result object (decision, reasons, actions). |
| **Python Runtime** | Dependency | Requires Python 3.8+ and the `open-guardrails` package (GuardEvent runtime). |
| **Configuration Store** | Dependency | Reads runtime configuration (e.g., enable flag, policy source) from the Engine Core’s configuration provider. |
| **Logging & Metrics** | Optional | Emits logs and metrics to the Engine Core’s monitoring adapters. |

> **Note:** The runtime is *not* a transport or storage layer; it strictly processes evaluation logic and forwards results.

## Constraints & Notes  
- **Optionality** – The OpenGuardrails Runtime is *not mandatory* for the Data Policy Engine. If the `enable_guardrails` flag is false, the Engine Core will skip calling this container without error.  
- **Resource Footprint** – The package is lightweight; however, GuardEvent evaluation may consume CPU time proportional to the policy complexity. Deploy in a dedicated environment if high throughput is required.  
- **Version Compatibility** – Must be paired with a compatible `open-guardrails` release. Incompatible versions will result in runtime errors; version pinning is recommended in `pyproject.toml`.  
- **Security** – As the runtime executes potentially untrusted policy code, it should be sandboxed (e.g., via Docker or process isolation) in production deployments.  
- **Testing** – Unit tests should exercise the adapter layer in isolation, mocking the GuardEvent runtime to validate request/response translation. Integration tests should verify end‑to‑end evaluation through the Engine Core when `enable_guardrails` is true.  

---

*Prepared for the platform team – please review configuration and compatibility before deploying.*
