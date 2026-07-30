## Overview

The Data Policy Engine (billing‑service) is a standalone retention and classification engine that exposes a REST API and an embedded Python SDK. It runs in a single EKS cluster in the **eu‑west‑1** region, with all services—including the admin console, API gateway, scheduler, cache, and database—co‑located in the same VPC.

---

## Deployment Topology

**Risk level:** **High**

- **Single‑region, single‑cluster** – All containers (`adminConsole`, `api`, `sdk`, `coreEngine`, `scheduler`, `cache`, `guardrailsRuntime`, `db`) share one EKS cluster.
- **No namespace or cluster separation** – The diagram contains a `namespace` node, but no services are assigned to distinct namespaces.
- **Ingress exposure** – An API Gateway and an ALB sit in front of the cluster, with no additional routing or regional load balancers.
- **Single DB point of failure** – The `db` instance is a Supabase/PostgreSQL cluster inside the same VPC, without replication or backup strategy.
- **Missing HA controls** – No Availability Zone (AZ), read replicas, or multi‑AZ deployments are documented.

### Recommendations

1. **Introduce multi‑AZ or multi‑region redundancy** for EKS and PostgreSQL. A two‑AZ setup with automated failover can reduce outage risk at a modest cost increase (\~$200–$400/month).
2. **Use dedicated namespaces or separate clusters** for sensitive components (e.g., `scheduler` and `coreEngine`). Update the `namespace` node and IAM policies to reflect this separation.
3. **Deploy a VPC‑based API Gateway with WAF and rate limiting** to protect the ingress point. Adding a WAF is a one‑off configuration but requires rule updates.

---

## Security Risks

**Risk level:** **Medium**

- **API key usage** – Tokens are referenced (`DRPE_API_KEY`, `Bearer key`) but key lifecycle management is not modeled.  
- **Missing MFA/OAuth** – No identity provider, MFA, or fine‑grained RBAC is referenced.  
- **Secrets not modeled** – No secrets store (e.g., Vault, Secrets Manager) or environment‑variable tagging is present.  
- **External integrations** – `externalLLM`, `externalOGR`, `externalHooks` are marked `#external`, but trust boundaries and secure transport are not annotated.  
- **Same cluster for admin and scheduler** – Lateral movement is possible if one container is compromised.  
- **Lack of network segmentation** – All services reside in a single VPC without private subnet isolation; a compromised ingress can reach internal services.

### Recommendations

1. **Implement OAuth 2.0 with an external IdP** (Cognito or Keycloak) and enforce MFA for Policy Admins and DPOs.
2. **Centralize secrets** in AWS Secrets Manager or HashiCorp Vault and inject them via Kubernetes Secrets.
3. **Add network policies or a service mesh** (e.g., Istio) to restrict pod communication (e.g., `api → coreEngine`, `scheduler → coreEngine`).

---

## Data Protection Risks

**Risk level:** **Medium**

- **Database encryption** – PostgreSQL (Supabase) defaults to encryption at rest, but this is not flagged.  
- **Cache storage** – Redis is used for policy caching and as a broker; encryption for data in transit or at rest is not mentioned.  
- **No retention or archiving** – The model does not reference backup or retention schedules for `db` or `cache`.  
- **Data classification** – The system likely handles policy, classification, and compliance data, but no classification tags are attached.  
- **External data flows** – Calls to `externalLLM` and `externalOGR` may involve policy content; encryption or data masking is not specified.

### Recommendations

1. **Tag all data stores with encryption flags** (`metadata { encryption: "AES256" }`) and enforce encryption at rest and TLS for database connections.
2. **Define retention policies** for `db` (e.g., 90‑day audit logs, 1‑year archival) and automate backup snapshots.
3. **Classify policy data** as PII/Regulated where applicable and apply field‑level encryption for sensitive fields.

---

## Data Leakage Risks

**Risk level:** **Medium**

- **Unspecified logging** – None of the containers or external systems mention a logging strategy (structured logs, redaction).  
- **API responses** – Policy data may be returned to the API; no mention of PII redaction.  
- **External integrations** – `externalHooks` and `externalLLM` could receive policy or audit data; no data contracts or masking are shown.  
- **Audit trails** – The `scheduler` writes audit logs to `db`, but no retention or access controls are described.  
- **Admin console** – Likely exposes policy editing UI; no session logging or CSRF protection is mentioned.

### Recommendations

1. **Implement structured logging with redaction** for all services (e.g., OpenTelemetry with a filter that removes PII).
2. **Enforce strict data contracts** for external integrations, ensuring only sanitized data is sent.
3. **Audit log access controls** – restrict query rights in `db` and enable immutable log storage (e.g., S3 with object lock).

---

## Evolutionary Design Options

**Risk level:** **Unknown**

The current model is static; future changes depend on team priorities and resources. Potential evolution paths include:

---

## Key Takeaways

These observations are based on the provided LikeC4 model, deployment diagram, and ADR references. Where explicit details are absent, assumptions are noted and risk levels are marked accordingly.
