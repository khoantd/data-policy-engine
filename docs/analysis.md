## Deployment topology

### Risk level

**High** – the entire system is deployed in a single AWS region (`euWest1`) and a single EKS cluster, with no explicit zone or cluster separation. The model does not show multi‑AZ or multi‑region failover, nor dedicated namespaces that could contain a blast radius.

### Key observations

- **Single‑region, single‑cluster**: `deployment environment prod { region euWest1 { kubernetes cluster { … } } }` shows that all containers (`adminConsole`, `api`, `sdk`, `coreEngine`, `scheduler`, `cache`, `guardrailsRuntime`, `db`) share the same cluster.  

- **No namespace or separation**: although a `namespace` node exists in the specification, no instances are tied to distinct namespaces.  

- **Ingress exposed via API Gateway**: the diagram places `API Gateway` and an `ALB` in front of the EKS cluster, but no mention of additional routing or regional load balancers.  

- **Single point of failure for the DB**: the `db` instance is a Supabase/PostgreSQL cluster inside the same VPC, with no replication or backup strategy shown.  

- **No high‑availability controls**: no mention of `Availability Zone` selection, `read replicas`, or `multi‑AZ` deployments in the deployment view.

### Recommendations

1. **Add multi‑AZ or multi‑region redundancy** for the EKS cluster and PostgreSQL. Even a simple two‑AZ setup with automated failover dramatically reduces outage risk, at the cost of higher infra complexity and modest cost (\~$200–$400 extra per month).  

2. **Introduce dedicated namespaces** or even separate EKS clusters for sensitive components (e.g., `scheduler` and `coreEngine`) to limit blast radius. This requires updating the deployment node `namespace` and adjusting IAM policies, trading off additional cluster management overhead.  

3. **Deploy a VPC‑based API Gateway with WAF and rate limiting** to protect the single ingress point. Adding a WAF is a one‑off configuration change but introduces a new maintenance step for rule updates.  

---

## Security risks

### Risk level

**Medium** – the model shows no explicit authentication, authorization, or secrets management; all interactions are via API keys or HTTP, and containers share the same Kubernetes cluster.

### Key observations

- **API key usage**: `admin -> drpe 'Admin UI + API key'` and `admin -> api 'DRPE_API_URL + Bearer key'` imply token‑based auth but the key lifecycle is not modeled.  

- **Missing MFA or OAuth**: No reference to an IdP, MFA, or fine‑grained RBAC; the `adminConsole` and `api` containers likely use static credentials.  

- **Secrets not modeled**: No `vault`, `secrets manager`, or environment‑variable tagging is present in the C4 spec or diagram.  

- **External integrations**: `externalLLM`, `externalOGR`, `externalHooks` are marked `#external` but the trust boundaries and data flows are not annotated for secure transport or verification.  

- **Same cluster for admin and scheduler**: All services run in the same Kubernetes cluster, so lateral movement is possible if one container is compromised.  

- **Lack of network segmentation**: The diagram shows all services inside one VPC without private subnet isolation, meaning a compromised ingress can reach internal services.

### Recommendations

1. **Implement OAuth 2.0 with an external IdP** (e.g., Cognito, Keycloak) and enforce MFA for `Policy Admin` and `DPO`. This adds authentication flow complexity but yields robust identity management.  

2. **Centralize secrets in AWS Secrets Manager or HashiCorp Vault** and inject them via Kubernetes Secrets, limiting exposure. The trade‑off is the need for secret rotation policies and IAM role management.  

3. **Add network policies or a service mesh** to restrict pod communication to the minimal required paths (`api → coreEngine`, `scheduler → coreEngine`, etc.). This reduces lateral movement risk but introduces additional networking layers that must be maintained.  

---

## Data protection risks

### Risk level

**Medium** – no explicit data classification, encryption, or retention policies are described, though the system likely handles sensitive policy and classification data.

### Key observations

- **Database encryption**: The `db` element is a `PostgreSQL` instance; Supabase defaults to encryption at rest, but the model does not flag it explicitly.  

- **Cache storage**: `cache` (Redis) is used for policy caching and as a broker, but no mention of encryption for data in transit or at rest.  

- **No retention or archiving**: The model does not reference backup or retention schedules for `db` or `cache` data.  

- **Data classification**: The system name `ROS Policy` and actor descriptions suggest handling of policy, classification, and possibly compliance data, but no classification tags are attached.  

- **External data flows**: Calls to `externalLLM` and `externalOGR` may involve sending policy content; the model does not specify encryption or data masking for these flows.

### Recommendations

1. **Tag all data stores with encryption flags** in the C4 model (`metadata { encryption: "AES256" }`) and enforce encryption at rest and TLS for all database connections. The cost is minimal (AWS RDS automatically encrypts), but you must enable and configure it.  

2. **Define retention policies** for `db` (e.g., 90‑day retention for audit logs, 1‑year archival) and implement automated backup snapshots. This requires additional backup scripts or services but mitigates data loss risk.  

3. **Classify policy data as PII/Regulated** if applicable and enforce data‑at‑rest encryption plus field‑level encryption for sensitive fields. The trade‑off is added complexity in data handling and potential performance impact.  

---

## Data leakage risks

### Risk level

**Medium** – the model does not capture logging, monitoring, or data‑exposure controls, so there is a risk of unfiltered logs or API responses leaking sensitive information.

### Key observations

- **Logging is unspecified**: None of the containers or external systems mention a logging strategy (e.g., structured logs, redaction).  

- **API responses**: The flow `api → coreEngine → db` and `coreEngine → guardrailsRuntime → api` suggests that policy data may flow back to the API; no mention of PII redaction.  

- **External integrations**: `externalHooks` and `externalLLM` could receive policy or audit data; the model does not show any data contracts or masking.  

- **Audit trails**: The `scheduler` writes audit logs to `db`, but no audit log retention or access controls are described.  

- **Admin console**: The `adminConsole` likely exposes policy editing UI; no mention of session logging or CSRF protection.

### Recommendations

1. **Implement structured logging with redaction** for all services (e.g., using OpenTelemetry with a filter that removes PII). This requires adding a logging library and configuring filters; the operational cost is moderate.  

2. **Enforce strict data contracts** for external integrations (`externalLLM`, `externalOGR`, `externalHooks`), ensuring only sanitized data is sent. This may involve adding adapters or middleware in `api` or `coreEngine`.  

3. **Audit log access controls**: restrict who can query the audit logs in `db` and enable immutable log storage (e.g., S3 with object lock). This adds governance overhead but significantly reduces leakage risk.  

---

## Evolutionary design options

### Risk level

**Unknown** – the model is static; future evolution depends on team priorities and resource availability.

### Key observations

- **All services in one cluster**: presents a single blast radius but also simplifies deployment.  

- **No service mesh or API gateway** beyond basic routing is defined.  

- **Limited observability**: ADR-0000 exists but does not cover observability or security.  

- **External systems are optional** (`#external` tags) and can be toggled.

### Recommendations (options)

1. **Introduce a lightweight service mesh (e.g., Linkerd or Istio)**  

   - **Scope**: Deploy the mesh across the EKS cluster, enable mutual TLS and traffic policies.  

   - **Effort**: Medium; requires cluster upgrades and operator configuration.  

   - **Risk reduction**: Enhances security and observability.  

   - **Prerequisites**: Update the deployment view to include the mesh and ensure pods declare sidecar injection; ADR‑0000 updated to document mesh decisions.

2. **Separate the scheduler and core engine into an isolated namespace or cluster**  

   - **Scope**: Move `scheduler` and `coreEngine` to a dedicated namespace or a secondary EKS cluster.  

   - **Effort**: Medium‑Large; re‑deployment, network policy updates, and IAM role adjustments.  

   - **Risk reduction**: Limits blast radius for enforcement jobs and reduces contention.  

   - **Prerequisites**: Create a new `deployment` node (`environment prod { region euWest1 { kubernetes cluster schedulerCluster { … } } }`) and update the C4 model to reference the new cluster.

3. **Add an API gateway layer with authentication and throttling**  

   - **Scope**: Replace the direct API Gateway‑ALB chain with a dedicated API Gateway that enforces OAuth, rate limiting, and request validation.  

   - **Effort**: Low‑Medium; configure the gateway, update `api` container to accept the gateway's auth token.  

   - **Risk reduction**: Improves security, mitigates DoS risk, and centralizes policy enforcement.  

   - **Prerequisites**: Update the deployment diagram to show the gateway and adjust the C4 model's `admin → api` relationship to go through the gateway.

4. **Implement automated secret rotation and store secrets in AWS Secrets Manager**  

   - **Scope**: Migrate all environment variables and database credentials to Secrets Manager.  

   - **Effort**: Medium; update container startup scripts and IAM roles.  

   - **Risk reduction**: Prevents credential leaks and reduces attack surface.  

   - **Prerequisites**: Add a `secret` element to the C4 model and reference it in `api`, `coreEngine`, etc.

5. **Adopt a data‑classification strategy and tag containers**  

   - **Scope**: Annotate containers and databases with a `classification` tag (e.g., `PII`, `Regulated`).  

   - **Effort**: Low; modify the C4 metadata and enforce policies via IaC.  

   - **Risk reduction**: Enables automated compliance checks and informs logging/redaction decisions.  

   - **Prerequisites**: Update ADR‑0000 to reflect the classification policy and add a validation rule in the index.

---

*All observations are grounded in the provided LikeC4 model, deployment diagram, and ADR references. Where explicit details are absent, assumptions are noted and risk levels marked accordingly.*
