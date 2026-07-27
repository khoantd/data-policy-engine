# Policy Admin (Actor)

## Purpose  
The **Policy Admin** is the primary human interface for creating, testing, and refining data policies within the ROS Policy engine. Admin users author retention, classification, and guardrails policies using a YAML DSL, and subsequently evaluate or classify data records against these policies through dedicated playgrounds. The actor enables iterative policy development and ensures that policies are accurately represented and tested before deployment into production workflows.

## Responsibilities  
| Task | Description |
|------|-------------|
| **Policy Authoring** | Write, edit, and version policies in the YAML DSL via the Admin UI. |
| **Policy Testing** | Run policy evaluation and classification playgrounds to validate policy logic against sample data. |
| **Guardrails Playgrounds** | Exercise OpenGuardrails‑backed agent policies and GuardEvent evaluations to confirm guardrail behavior. |
| **Version Management** | Utilize the built‑in policy diff and rollback-as‑new‑version features to track changes and revert when necessary. |
| **Governance Linking** | Attach metadata and catalog entries (RoPA‑style) to policies, supporting governance and traceability. |
| **Audit Oversight** | Review audit trails for enforcement actions and DSAR outcomes, ensuring compliance records are complete. |

## Interfaces and Dependencies  
| Interface | Purpose | Underlying Port/Adapter |
|-----------|---------|-------------------------|
| **Admin UI (Next.js BFF)** | Provides a web interface for policy authoring, playgrounds, and audit review. | `/api/v1` REST surface |
| **Policy Store** | Persists policy definitions, histories, and diffs. | Storage adapter (e.g., Postgres, in‑memory) |
| **Evaluator Service** | Executes policy evaluation logic against records. | Evaluation port |
| **Classifier Service** | Runs PII/SPII classification rules against data. | Classification port |
| **Guardrails Service** | Handles OpenGuardrails policy execution and GuardEvent evaluation. | Guardrails port |
| **Audit Store** | Logs enforcement and DSAR events for audit purposes. | Audit port |
| **Catalog Store** | Maintains metadata linking policies to governance catalogs. | Catalog port |

Admin interactions are mediated exclusively through the **Admin UI**, which consumes the same RESTful API surface that the ROS Policy engine exposes to external consumers. All policy changes propagate through the **Policy Store** and trigger validation via the **Evaluator** and **Classifier** ports, with optional Guardrails evaluation when requested.

## Constraints and Notes  
- **Non‑code Interaction**: Admins perform all actions through the Admin UI; direct API calls for policy manipulation are reserved for automated tooling or CI/CD pipelines.  
- **Versioning Discipline**: Policy changes must be committed as new versions; deletions are prohibited—only new versions can replace or mark a policy as deprecated.  
- **Playground Isolation**: Evaluation and classification playgrounds run in isolated contexts; results are not persisted to production stores unless explicitly promoted.  
- **Guardrails Dependency**: Guardrails playgrounds require an OpenGuardrails‑backed agent policy to be defined; absence of such a policy will prevent GuardEvent evaluation.  
- **Audit Trail**: All policy modifications, evaluations, and guardrail runs are append‑only in the Audit Store; manual tampering is not permitted.  

This capability description is a draft and must be validated against the current codebase and ADRs before formal adoption.
