# 12-Factor audit\_2026-07-30 19:55

> AI-generated 12/15-factor cloud-native audit for **Data Policy Engine**. Review and refine before treating as a decision record.
> Deployment target: **VM / bare metal**. Advisory only — verify against runtime evidence.

# 12‑Factor Audit: Data Policy Engine (billing‑service)

**Deployment target:** VM / bare metal  
**Assessed on:** 2026‑07‑30  
**Overall readiness:** **1/15 Pass, 10/15 Partial, 3/15 Fail**

---

## Scorecard

---

## Top findings (ranked by impact × urgency)

### 1. \[P0\] Statelessness Violation (Factor VI)

**Symptom** – The service keeps user session data in a local in‑memory store and writes temporary files to `/tmp`. Sticky sessions are configured on the load balancer; a second pod cannot serve a request that relies on that session data.  
**Root cause** – Coupling of user state to the process lifetime; no external store for session or upload state.  
**Target state** – All per‑request and user‑specific data moved to a shared backing service (Redis or Postgres session table); upload artifacts streamed directly to object storage (S3/GCS) instead of the local filesystem.  
**Refactor steps**  

1. Introduce a Redis client, read `REDIS_URL` from env.
2. Refactor session handling to use a Redis hash or JWT with short expiry.
3. Replace file‑system uploads with an in‑memory buffer that streams to S3 on completion.
4. Remove sticky‑session configuration from the load balancer; ensure the reverse proxy passes `X-Forwarded-For` and `X-Request-ID`.  
**Verification** – Spin up two identical pods behind the same LB and perform a login‑upload‑download cycle; the second pod should handle all requests without error.  
**Depends on** – IV (Back‑ing services) for Redis and S3; X (Dev/prod parity) to test locally.

### 2. \[P0\] Disposability Failure (Factor IX)

**Symptom** – On VM restart or manual `kill`, the service hangs for &gt;60 s before exiting, because it runs DB migrations during startup and does not respond to SIGTERM.  
**Root cause** – Startup performs synchronous migrations and blocks the readiness probe; no graceful‑shutdown handler.  
**Target state** – Startup completes within &lt;10 s, performs migrations in a pre‑deploy step; the process exits cleanly on SIGTERM, finishing in‑flight requests within a 30 s timeout.  
**Refactor steps**  

1. Move migration logic to a separate, one‑off CLI command in the same image.
2. Update CI to run migrations before rolling out the new image.
3. Add a SIGTERM handler to stop accepting new requests and close DB connections.
4. Expose `/readyz` that checks DB connectivity only; `/healthz` that always returns 200.  
**Verification** – Deploy two pods, send traffic, then `kill -TERM` the first pod; confirm that the second pod continues serving requests and that the first pod exits in &lt;30 s.  
**Depends on** – V (Build/release/run) to separate migration from runtime image; XI (Logs) to capture shutdown logs.

### 3. \[P1\] Log‑file Management (Factor XI)

**Symptom** – The application writes structured logs to `/var/log/data_policy.log` and rotates them itself. The container’s stdout is unused, so platform‑level log aggregation is blind to these logs.  
**Root cause** – Violation of “logs are event streams to stdout/stderr”; the app treats logs as a file‑system resource.  
**Target state** – All logs written to stdout/stderr in JSON format, with correlation IDs; no file‑system rotation.  
**Refactor steps**  

1. Replace custom file logger with a standard JSON logger (e.g., `logrus`, `pino`).
2. Ensure the logger captures `X-Request-ID` or trace ID from the request context.
3. Remove any cron‑job or in‑app log‑rotation logic.
4. Update the Dockerfile to expose only the default log streams.  
**Verification** – Run the container locally; tail `stdout` and confirm each line is a JSON object with `level`, `ts`, `msg`, and `request_id`. Check that platform logs (e.g., syslog, cloudwatch) receive these entries.  
**Depends on** – XIV (Telemetry) to ensure metrics and traces are also emitted via structured logs.

### 4. \[P1\] Hard‑coded Configuration (Factor III)

**Symptom** – URLs for external services (e.g., S3 bucket, API gateway) are hard‑coded in source files, and a `config.yaml` per environment is committed.  
**Root cause** – Mixing environment‑specific values into code rather than externalizing them to env vars or a secret manager.  
**Target state** – All environment‑varying values loaded from env vars (or a secret manager that injects env vars at runtime); a single `config.yaml` with defaults for all environments.  
**Refactor steps**  

1. Add environment variables for each external URL (e.g., `S3_BUCKET_URL`).
2. Use a configuration library that validates presence of required env vars at start‑up.
3. Remove `config.yaml` from the repo or replace it with a template.  
**Verification** – Build the image with the new config loader; run locally with overridden env vars and verify that the service connects to the correct bucket.  
**Depends on** – IV (Backing services) to ensure DSNs are correctly parsed.

---

## Not fixing now

- **XIII API‑first** – The billing service is purely internal; no external consumers yet, so an API contract is not required.  
- **XIV Telemetry** – While metrics and health endpoints exist, their current quality is low. Deferring until after the core factors are resolved will reduce noise.  
- **XV Authentication &amp; authorization** – Basic request authentication is handled by the reverse proxy; a more granular policy layer is planned for the next sprint.

These items are slated for a future audit cycle after the P0/P1 fixes are in place.
