# PostgreSQL – Data Policy Engine (billing-service)

## Purpose
The PostgreSQL container is the primary persistence layer for the ROS Policy (Data Policy Engine). It stores all domain data required by the engine, including policy definitions, audit trails, scheduled job metadata, and supporting catalog information. The container is deployed either as a local PostgreSQL instance (for development or on‑premise environments) or as a Supabase managed database in production.

## Responsibilities
| Responsibility | Description |
|----------------|-------------|
| **Policy Persistence** | Stores policy YAML files, version history, and structural diffs in the `drpe` schema. |
| **Audit Trail** | Maintains an append‑only audit log for every enforcement action, DSAR request, and system event. |
| **Job Metadata** | Persists scheduler job state, next run times, and job outcomes for periodic policy evaluations. |
| **Supporting Data** | Holds auxiliary tables such as `CatalogStore`, `GraceHoldStore`, and `GuardrailPolicyStore` that support governance, grace periods, and agent policy lookups. |
| **Transactional Integrity** | Guarantees ACID compliance for all read/write operations performed via SQLAlchemy or raw SQL. |
| **Scalability & Availability** | Provides read replicas and WAL archiving for high availability and disaster recovery. |

## Interfaces & Dependencies
| Interface | Direction | Technology | Notes |
|-----------|-----------|------------|-------|
| **REST API → PostgreSQL** | Incoming | SQLAlchemy ORM | The billing-service REST API (Python) uses SQLAlchemy to read/write policy and audit data. |
| **Scheduler → PostgreSQL** | Incoming | Direct SQL / SQLAlchemy | The Celery scheduler writes job schedules and audit records. |
| **Supabase** | External | Remote PostgreSQL | Production deployments use Supabase; development uses local PostgreSQL. The schema is identical across environments. |
| **Other Containers** | Outgoing | None directly | Other system components (e.g., policy evaluator) query the DB via the API layer; no direct DB access from them. |

## Constraints & Notes
- **Schema**: All tables are defined within the `drpe` schema; the schema version is tracked in a `schema_version` table. Do **not** modify the schema outside of approved migrations. |
- **Performance**: Indexes are created on frequently queried columns (e.g., `policy_id`, `audit_timestamp`). Bulk writes for audit logs are batched to reduce lock contention. |
- **Security**: Connections are encrypted. In production, Supabase enforces role‑based access controls; in local mode, the database is protected by `pg_hba.conf` rules. |
- **Backups & Replication**: Supabase provides automated backups. For local instances, the team maintains nightly `pg_dump` jobs and WAL archiving. |
- **Migration Strategy**: All schema changes are versioned using Flyway/Alembic scripts and applied in CI before deployment. |
- **Version Compatibility**: PostgreSQL 15 is the target version; ensure that extensions used in the `drpe` schema (e.g., `pgcrypto`, `uuid-ossp`) are available. |
- **No Direct API Exposure**: The database should never be accessed directly by external consumers; all interaction goes through the REST API or scheduled jobs. |
- **Data Retention**: The audit table uses a retention policy that archives or purges entries older than a configurable period, as defined in the `GraceHoldStore` configuration. |

--- 

*End of capability description.*
