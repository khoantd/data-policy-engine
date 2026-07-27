# Scheduler

## Purpose
The **Scheduler** is a container that orchestrates policy enforcement by scheduling periodic scans and queued enforcement jobs. Built on Celery, it ensures that retention and classification policies defined in the ROS Policy Engine are applied to data records at the correct cadence and with reliable retry semantics.

## Responsibilities
- **Schedule periodic policy scans** – trigger background jobs according to the retention or archival schedule specified in policy YAML.
- **Queue and dispatch enforcement tasks** – hand off job details to the Engine Core’s `EnforcementRunner` for execution.
- **Persist job metadata and audit trail** – record job lifecycle events (creation, success, failure, retry) in PostgreSQL for traceability.
- **Leverage Celery broker/backend** – use Redis as the message broker and result backend for task queuing and status tracking.
- **Provide idempotent task handling** – ensure that repeated or duplicate tasks do not corrupt audit or job state.

## Interfaces & Dependencies
| Direction | Target | Interaction |
|-----------|--------|-------------|
| **Outgoing** | **PostgreSQL** | Persist `Job` records and audit events (`job_id`, timestamps, status, payload). |
| **Outgoing** | **Engine Core** (`EnforcementRunner`) | Submit job details; receive task execution results. |
| **Outgoing** | **Redis** | Celery broker for queuing tasks; backend for task results and locks. |
| **Incoming** | **Engine Core** | Receives job creation requests via internal API or message. |
| **Incoming** | **Admin UI / API** | Optional endpoints to trigger ad‑hoc scans or inspect job status. |

## Constraints
- **Technology stack**: Must use Celery with Redis broker/backend; no alternative task queues.
- **Database**: PostgreSQL is the only persistent store for jobs and audit data; schemas are defined in the `jobs` and `audit` tables.
- **Scalability**: Worker concurrency is limited by the Celery worker pool; scaling requires provisioning additional worker instances and Redis partitions.
- **Reliability**: Jobs must be retried on failure according to policy‑defined retry logic; failures are recorded in audit logs for manual review.

## Notes
- The Scheduler runs as a separate container within the `drpeContainers` group of the ROS Policy architecture, ensuring isolation from the Core evaluation components.
- It is owned by the **platform** team; configuration (Celery broker URL, PostgreSQL DSN, retry settings) is managed through environment variables injected by the deployment pipeline.
- No public API is exposed; interaction occurs through internal adapters (e.g., Engine Core API calls, Celery task definitions).
