## Deployment Topology

**Risk level:** **High** – The entire stack is confined to a single AWS region (`euWest1`) and a single EKS cluster. There is no explicit zone or cluster separation, and the model does not illustrate multi‑AZ or multi‑region failover or dedicated namespaces that could contain a blast radius.

### Key Findings

- **Single‑region, single‑cluster** – The specification `deployment environment prod { region euWest1 { kubernetes cluster { … } } }` shows that all containers (`adminConsole`, `api`, `sdk`, `coreEngine`, `scheduler`, `cache`, `guardrailsRuntime`, `db`) share one cluster.  
- **No namespace or separation** – Although a `namespace` node exists, no instances are assigned to distinct namespaces.  
- **Ingress exposure** – `API Gateway` and an `ALB` sit in front of the EKS cluster, but no additional routing or regional load balancers are mentioned.  
- **Single DB point of failure** – The `db` instance is a Supabase/PostgreSQL cluster inside the same VPC, without shown replication or backup strategy.  
- **Missing HA controls** – No `Availability Zone`, `read replicas`, or multi‑AZ deployments are documented.

### Recommendations

1. **Add multi‑AZ or multi‑region redundancy** for EKS and PostgreSQL. A simple two‑AZ setup with automated failover can dramatically reduce outage risk at a modest cost increase (\~$200–$400/month).
2. **Introduce dedicated namespaces or separate clusters** for sensitive components (e.g., `scheduler` and `coreEngine`). Update the deployment node `namespace` and IAM policies; this trades off extra cluster management overhead.
3. **Deploy a VPC‑based API Gateway with WAF and rate limiting** to protect the ingress point. Adding WAF is a one‑off configuration but introduces a new maintenance step for rule updates.

---

## Security Risks

**Risk level:** **Medium** – The model lacks explicit authentication, authorization, or secrets management. All interactions occur via API keys or HTTP, and containers share the same Kubernetes cluster.

### Key Findings

- **API key usage** – `admin → drpe 'Admin UI + API key'` and `admin → api 'DRPE_API_URL + Bearer key'` imply token‑based auth, but key lifecycle is not modeled.  
- **Missing MFA/OAuth** – No IdP, MFA, or fine‑grained RBAC is referenced; `adminConsole` and `api` likely rely on static credentials.  
- **Secrets not modeled** – No `vault`, `secrets manager`, or environment‑variable tagging is present.  
- **External integrations** – `externalLLM`, `externalOGR`, `externalHooks` are marked `#external`, but trust boundaries and secure transport are not annotated.  
- **Same cluster for admin and scheduler** – Lateral movement is possible if one container is compromised.  
- **Lack of network segmentation** – All services reside in a single VPC without private subnet isolation; a compromised ingress can reach internal services.

### Recommendations

1. **Implement OAuth 2.0 with an external IdP** (e.g., Cognito, Keycloak) and enforce MFA for `Policy Admin` and `DPO`. This adds flow complexity but provides robust identity management.
2. **Centralize secrets in AWS Secrets Manager or HashiCorp Vault** and inject them via Kubernetes Secrets to limit exposure. Requires secret rotation policies and IAM role management.
3. **Add network policies or a service mesh** to restrict pod communication (e.g., `api → coreEngine`, `scheduler → coreEngine`). Reduces lateral movement risk but adds networking overhead.

---

## Data Protection Risks

**Risk level:** **Medium** – No explicit data classification, encryption, or retention policies are described, though the system likely handles sensitive policy and classification data.

### Key Findings

- **Database encryption** – The `db` element is PostgreSQL; Supabase defaults to encryption at rest, but this is not flagged.  
- **Cache storage** – `cache` (Redis) is used for policy caching and as a broker; encryption for data in transit or at rest is not mentioned.  
- **No retention or archiving** – The model does not reference backup or retention schedules for `db` or `cache`.  
- **Data classification** – The system name suggests handling of policy, classification, and compliance data, but no classification tags are attached.  
- **External data flows** – Calls to `externalLLM` and `externalOGR` may involve policy content; encryption or data masking is not specified.

### Recommendations

1. **Tag all data stores with encryption flags** (`metadata { encryption: "AES256" }`) and enforce encryption at rest and TLS for database connections.
2. **Define retention policies** for `db` (e.g., 90‑day audit logs, 1‑year archival) and implement automated backup snapshots.
3. **Classify policy data as PII/Regulated** if applicable, and apply field‑level encryption for sensitive fields. This adds complexity but mitigates data loss risk.

---

## Data Leakage Risks

**Risk level:** **Medium** – Logging, monitoring, and data‑exposure controls are not captured, increasing the risk of unfiltered logs or API responses leaking sensitive information.

### Key Findings

- **Unspecified logging** – None of the containers or external systems mention a logging strategy (structured logs, redaction).  
- **API responses** – The flow `api → coreEngine → db` and `coreEngine → guardrailsRuntime → api` suggests policy data may be returned to the API; no mention of PII redaction.  
- **External integrations** – `externalHooks` and `externalLLM` could receive policy or audit data; no data contracts or masking are shown.  
- **Audit trails** – The `scheduler` writes audit logs to `db`, but no retention or access controls are described.  
- **Admin console** – Likely exposes policy editing UI; no session logging or CSRF protection is mentioned.

### Recommendations

1. **Implement structured logging with redaction** for all services (e.g., using OpenTelemetry with a filter that removes PII).
2. **Enforce strict data contracts** for external integrations, ensuring only sanitized data is sent.
3. **Audit log access controls** – restrict query rights in `db` and enable immutable log storage (e.g., S3 with object lock).

---

## Evolutionary Design Options

**Risk level:** **Unknown** – The current model is static; future changes depend on team priorities and resources.

### Options &amp; Impact

---

*All observations are based on the provided LikeC4 model, deployment diagram, and ADR references. Where explicit details are absent, assumptions are noted and risk levels are marked accordingly.*
