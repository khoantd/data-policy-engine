import { getApiKey } from "@/lib/session";
import {
  AuditEntry,
  ClassificationPolicy,
  ClassificationRequest,
  ClassificationResponse,
  DrpeApiError,
  DsarRequest,
  EnforceResponse,
  EnforcementJob,
  EvaluationRequest,
  EvaluationResponse,
  GraceHold,
  HealthResponse,
  ImportResponse,
  Policy,
  PolicyDiffResponse,
  PolicyListItem,
  PolicyVersionInfo,
  PolicyStatus,
  ReadyResponse,
  RecordRef,
  ReferenceSource,
  ValidateResponse,
  WebhookCreateResponse,
  WebhookResponse,
} from "@/lib/types";

function apiBase(): string {
  return (process.env.DRPE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
}

async function parseDetail(res: Response): Promise<unknown> {
  try {
    const data = await res.json();
    return data.detail ?? data;
  } catch {
    return await res.text();
  }
}

export async function drpeFetch<T>(
  path: string,
  init: RequestInit = {},
  apiKeyOverride?: string | null,
): Promise<T> {
  const apiKey =
    apiKeyOverride !== undefined ? apiKeyOverride : await getApiKey();
  if (apiKey === null) {
    throw new DrpeApiError(401, "Not authenticated");
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${apiBase()}/api/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new DrpeApiError(res.status, await parseDetail(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/** Probe credentials against an authenticated endpoint. */
export async function probeAuth(apiKey: string): Promise<void> {
  await drpeFetch<Policy[]>("/policies", {}, apiKey);
}

export const drpe = {
  health: () => drpeFetch<HealthResponse>("/health"),
  ready: () => drpeFetch<ReadyResponse>("/health/ready"),

  listPolicies: (status?: string, policyKind?: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status_filter", status);
    if (policyKind) params.set("policy_kind", policyKind);
    const qs = params.toString();
    return drpeFetch<PolicyListItem[]>(
      qs ? `/policies?${qs}` : "/policies",
    );
  },
  getPolicy: (id: string) =>
    drpeFetch<Policy | ClassificationPolicy>(
      `/policies/${encodeURIComponent(id)}`,
    ),
  validateYaml: (yaml: string) =>
    drpeFetch<ValidateResponse>("/policies/validate", {
      method: "POST",
      body: JSON.stringify({ yaml }),
    }),
  importYaml: (
    yaml: string,
    referenceSources?: ReferenceSource[],
  ) =>
    drpeFetch<ImportResponse>("/policies/import", {
      method: "POST",
      body: JSON.stringify({
        yaml,
        ...(referenceSources && referenceSources.length > 0
          ? { reference_sources: referenceSources }
          : {}),
      }),
    }),
  updatePolicyYaml: (id: string, yaml: string) =>
    drpeFetch<Policy>(`/policies/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ yaml }),
    }),
  deletePolicy: (id: string) =>
    drpeFetch<Policy>(`/policies/${encodeURIComponent(id)}`, { method: "DELETE" }),
  changePolicyStatus: (id: string, status: PolicyStatus) =>
    drpeFetch<Policy>(`/policies/${encodeURIComponent(id)}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
  listVersions: (id: string) =>
    drpeFetch<PolicyVersionInfo[]>(
      `/policies/${encodeURIComponent(id)}/versions`,
    ),
  getVersion: (id: string, ver: number) =>
    drpeFetch<Policy>(
      `/policies/${encodeURIComponent(id)}/versions/${ver}`,
    ),
  activateVersion: (id: string, ver: number) =>
    drpeFetch<Policy>(
      `/policies/${encodeURIComponent(id)}/versions/${ver}/activate`,
      { method: "POST" },
    ),
  diffVersions: (id: string, from_version: number, to_version: number) =>
    drpeFetch<PolicyDiffResponse>(
      `/policies/${encodeURIComponent(id)}/diff`,
      {
        method: "POST",
        body: JSON.stringify({ from_version, to_version }),
      },
    ),

  listDsar: (qs?: string) =>
    drpeFetch<DsarRequest[]>(`/dsar/requests${qs ? `?${qs}` : ""}`),
  getDsar: (id: string) =>
    drpeFetch<DsarRequest>(`/dsar/requests/${encodeURIComponent(id)}`),
  submitAccess: (body: {
    subject_id: string;
    policy_id: string;
    identity?: Record<string, unknown>;
    records?: RecordRef[];
  }) =>
    drpeFetch<DsarRequest>("/dsar/access", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  submitErasure: (body: {
    subject_id: string;
    policy_id: string;
    identity?: Record<string, unknown>;
    records?: RecordRef[];
  }) =>
    drpeFetch<DsarRequest>("/dsar/erasure", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listAudit: (qs?: string) =>
    drpeFetch<AuditEntry[]>(`/audit/logs${qs ? `?${qs}` : ""}`),

  listWebhooks: (qs?: string) =>
    drpeFetch<WebhookResponse[]>(`/webhooks${qs ? `?${qs}` : ""}`),
  getWebhook: (id: string) =>
    drpeFetch<WebhookResponse>(`/webhooks/${encodeURIComponent(id)}`),
  createWebhook: (body: {
    url: string;
    events: string[];
    secret?: string;
    description?: string;
    active?: boolean;
  }) =>
    drpeFetch<WebhookCreateResponse>("/webhooks", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateWebhook: (
    id: string,
    body: Partial<{
      url: string;
      events: string[];
      secret: string;
      description: string;
      active: boolean;
    }>,
  ) =>
    drpeFetch<WebhookResponse>(`/webhooks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteWebhook: (id: string) =>
    drpeFetch<void>(`/webhooks/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  listJobs: (qs?: string) =>
    drpeFetch<EnforcementJob[]>(`/enforce/jobs${qs ? `?${qs}` : ""}`),
  getJob: (id: string) =>
    drpeFetch<EnforcementJob>(`/enforce/jobs/${encodeURIComponent(id)}`),
  triggerEnforce: (body: {
    policy_id?: string;
    records?: RecordRef[];
  }) =>
    drpeFetch<EnforceResponse>("/enforce", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listGraceHolds: (qs?: string) =>
    drpeFetch<GraceHold[]>(`/grace-holds${qs ? `?${qs}` : ""}`),
  getGraceHold: (id: string) =>
    drpeFetch<GraceHold>(`/grace-holds/${encodeURIComponent(id)}`),
  forceGraceHold: (id: string, body?: { requester?: string }) =>
    drpeFetch<GraceHold>(`/grace-holds/${encodeURIComponent(id)}/force`, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),
  cancelGraceHold: (id: string, body?: { requester?: string }) =>
    drpeFetch<GraceHold>(`/grace-holds/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),

  evaluateOne: (body: EvaluationRequest) =>
    drpeFetch<EvaluationResponse>("/evaluate", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  evaluateDryRun: (body: EvaluationRequest) =>
    drpeFetch<EvaluationResponse>("/evaluate/dry-run", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  evaluateBatch: (records: EvaluationRequest[]) =>
    drpeFetch<EvaluationResponse[]>("/evaluate/batch", {
      method: "POST",
      body: JSON.stringify({ records }),
    }),

  classifyOne: (body: ClassificationRequest) =>
    drpeFetch<ClassificationResponse>("/classify", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  classifyDryRun: (body: ClassificationRequest) =>
    drpeFetch<ClassificationResponse>("/classify/dry-run", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
