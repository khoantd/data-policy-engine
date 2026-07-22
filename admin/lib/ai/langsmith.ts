/**
 * LangSmith config (server-only).
 */

import { Client } from "langsmith";

export const DRPE_TRACE_TAG = "drpe-admin";

export const DRPE_METADATA_KEYS = {
  route: "drpe_route",
  mode: "drpe_mode",
  jurisdiction: "drpe_jurisdiction",
  industry: "drpe_industry",
  scenario: "drpe_scenario",
  webSearch: "drpe_web_search",
  sourceCount: "drpe_source_count",
  privacyMask: "drpe_privacy_mask",
  entityCount: "drpe_entity_count",
} as const;

export type DrpeTraceRoute =
  | "policy-suggest"
  | "evaluate-sample"
  | "classify-sample";

export type LangSmithConfig = {
  enabled: boolean;
  apiKey: string;
  project: string;
  projectId?: string;
  endpoint: string;
  /** Workspace tenant ID — required for service keys (lsv2_sk_…). */
  workspaceId?: string;
  /** LangSmith org/tenant slug for UI deep links. */
  tenantId?: string;
};

function isServiceKey(apiKey: string): boolean {
  return apiKey.startsWith("lsv2_sk_");
}

const DEFAULT_PROJECT = "drpe-admin";
const DEFAULT_API_ENDPOINT = "https://api.smith.langchain.com";
const DEFAULT_UI_HOST = "https://smith.langchain.com";

function isTracingEnabled(): boolean {
  const raw = process.env.LANGSMITH_TRACING?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

export function getLangSmithConfig(): LangSmithConfig | null {
  if (!isTracingEnabled()) return null;
  const apiKey = process.env.LANGSMITH_API_KEY?.trim();
  if (!apiKey) return null;
  const project =
    process.env.LANGSMITH_PROJECT?.trim() || DEFAULT_PROJECT;
  const endpoint =
    process.env.LANGSMITH_ENDPOINT?.trim() || DEFAULT_API_ENDPOINT;
  const projectId = process.env.LANGSMITH_PROJECT_ID?.trim() || undefined;
  const workspaceId = process.env.LANGSMITH_WORKSPACE_ID?.trim() || undefined;
  const tenantId = process.env.LANGSMITH_TENANT_ID?.trim() || undefined;
  return {
    enabled: true,
    apiKey,
    project,
    projectId,
    endpoint,
    workspaceId,
    tenantId,
  };
}

/** Workspace header for LangSmith SDK — service keys only. */
export function resolveLangSmithWorkspaceId(
  config: LangSmithConfig,
): string | undefined {
  if (!isServiceKey(config.apiKey)) return undefined;
  return config.workspaceId;
}

export function isLangSmithConfigured(): boolean {
  return getLangSmithConfig() !== null;
}

export function getLangSmithUiHost(): string {
  const endpoint =
    process.env.LANGSMITH_ENDPOINT?.trim() || DEFAULT_API_ENDPOINT;
  if (endpoint.includes("api.smith.langchain.com")) {
    return endpoint.replace("api.smith.langchain.com", "smith.langchain.com");
  }
  try {
    const url = new URL(endpoint);
    if (url.hostname.startsWith("api.")) {
      url.hostname = url.hostname.slice(4);
    }
    return url.origin;
  } catch {
    return DEFAULT_UI_HOST;
  }
}

function getLangSmithOrgSlug(): string {
  const config = getLangSmithConfig();
  return config?.tenantId ?? config?.workspaceId ?? "default";
}

/** Shared LangSmith SDK client (tracing + observability). */
export function createLangSmithClient(config = getLangSmithConfig()): Client | null {
  if (!config) return null;
  const workspaceId = resolveLangSmithWorkspaceId(config);
  return new Client({
    apiKey: config.apiKey,
    apiUrl: config.endpoint,
    // PAT keys: pass "" so the SDK does not inherit a stale LANGSMITH_WORKSPACE_ID
    // env var (often mistakenly set to the project/session UUID).
    workspaceId: workspaceId ?? "",
  });
}

/** Turn LangSmith SDK errors into actionable setup hints. */
export function formatLangSmithApiError(err: unknown): string {
  const message =
    err instanceof Error ? err.message : "Failed to reach LangSmith";
  if (!message.includes("403")) return message;

  const config = getLangSmithConfig();
  const hints: string[] = [];

  if (isServiceKey(config?.apiKey ?? "") && !config?.workspaceId) {
    hints.push(
      "Service keys (lsv2_sk_…) need LANGSMITH_WORKSPACE_ID (workspace tenant UUID from Settings → General — not the project ID).",
    );
  }

  if (config?.apiKey.startsWith("lsv2_pt_") && config.workspaceId) {
    hints.push(
      "Personal keys (lsv2_pt_…) should not set LANGSMITH_WORKSPACE_ID unless it is the workspace tenant UUID; use LANGSMITH_PROJECT_ID for the project/session UUID instead.",
    );
  }

  hints.push(
    "Confirm LANGSMITH_ENDPOINT matches your region (US: https://api.smith.langchain.com).",
  );

  return `${message} ${hints.join(" ")}`;
}

export type LangSmithRunLinkParams = {
  runId: string;
  traceId: string;
  projectId: string;
};

/** External LangSmith run URL (opens in browser). */
export function buildLangSmithRunUrl(params: LangSmithRunLinkParams): string {
  const uiHost = getLangSmithUiHost().replace(/\/$/, "");
  const org = getLangSmithOrgSlug();
  const { runId, traceId, projectId } = params;
  const base = `${uiHost}/o/${org}/projects/p/${projectId}`;
  const qs = new URLSearchParams({ peek: runId, peeked_trace: traceId });
  return `${base}?${qs.toString()}`;
}

export function getLangSmithProjectUrl(): string {
  const uiHost = getLangSmithUiHost().replace(/\/$/, "");
  const org = getLangSmithOrgSlug();
  const config = getLangSmithConfig();
  const projectId =
    config?.projectId ?? encodeURIComponent(config?.project ?? DEFAULT_PROJECT);
  return `${uiHost}/o/${org}/projects/p/${projectId}`;
}
