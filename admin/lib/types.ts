/** API types derived from OpenAPI (`lib/generated/schema.d.ts`). Regenerate: `npm run openapi`. */

import type { components } from "@/lib/generated/schema";

type Schemas = components["schemas"];

export type PolicyStatus = Schemas["PolicyStatus"];
export type PolicyKind = Schemas["PolicyKind"];
export type Policy = Schemas["Policy"];
export type PolicyListItem = Schemas["PolicyListItem"];
export type ClassificationPolicy = Schemas["ClassificationPolicy"];
export type ClassificationRequest = Schemas["ClassificationRequest"];
export type ClassificationResponse = Schemas["ClassificationResponse"];
export type DetectedEntity = Schemas["DetectedEntity"];
export type PolicyVersionInfo = Schemas["PolicyVersionInfo"];
export type PolicyDiffChange = Schemas["PolicyDiffChange"];
export type PolicyDiffResponse = Schemas["PolicyDiffResponse"];
export type ValidateResponse = Schemas["ValidateResponse"];
export type ImportResponse = Schemas["ImportResponse"];
export type HealthResponse = Schemas["HealthResponse"];
export type ReadyResponse = Schemas["ReadyResponse"];

export type DsarRequestType = Schemas["DsarRequestType"];
export type DsarRequestStatus = Schemas["DsarRequestStatus"];
export type RecordRef = Schemas["RecordRef"];
export type DsarResult = Schemas["DsarResult"];
export type DsarRequest = Schemas["DsarRequest"];

export type AuditEventType = Schemas["AuditEventType"];
export type AuditEntry = Schemas["AuditEntry"];

export type GraceHoldStatus = Schemas["GraceHoldStatus"];
export type GraceHold = Schemas["GraceHold"];

export type JobStatus = Schemas["JobStatus"];
export type JobProgress = Schemas["JobProgress"];
export type EnforcementJob = Schemas["EnforcementJob"];
export type EnforceResponse = Schemas["EnforceResponse"];

export type EvaluationRequest = Schemas["EvaluationRequest"];
export type EvaluationResponse = Schemas["EvaluationResponse"];
export type EvaluationResultDetail = Schemas["EvaluationResultDetail"];
export type BatchEvaluateRequest = Schemas["BatchEvaluateRequest"];
export type ConflictingPolicy = Schemas["ConflictingPolicy"];

export type WebhookResponse = Schemas["WebhookResponse"];
export type WebhookCreateResponse = Schemas["WebhookCreateResponse"];

export class DrpeApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(typeof detail === "string" ? detail : `API error ${status}`);
    this.name = "DrpeApiError";
    this.status = status;
    this.detail = detail;
  }
}
