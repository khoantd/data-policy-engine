/**
 * LangSmith run listing for Observability page. Server-only.
 */

import type { Run } from "langsmith/schemas";
import {
  buildLangSmithRunUrl,
  createLangSmithClient,
  DRPE_METADATA_KEYS,
  formatLangSmithApiError,
  getLangSmithConfig,
  type DrpeTraceRoute,
} from "@/lib/ai/langsmith";

export type TraceStatusFilter = "all" | "success" | "error";

export type TraceWindow = "24h" | "7d" | "30d";

export type TraceListParams = {
  route?: DrpeTraceRoute | "all";
  status?: TraceStatusFilter;
  webSearch?: "all" | "on" | "off" | "skipped";
  window?: TraceWindow;
  limit?: number;
};

export type TraceSummary = {
  id: string;
  name: string;
  startTime: string;
  status: "success" | "error" | "pending";
  latencyMs: number | null;
  route: string | null;
  mode: string | null;
  webSearch: string | null;
  langsmithUrl: string;
};

const SAFE_METADATA_KEYS = new Set<string>(Object.values(DRPE_METADATA_KEYS));

function windowToHours(window: TraceWindow): number {
  switch (window) {
    case "24h":
      return 24;
    case "7d":
      return 24 * 7;
    case "30d":
      return 24 * 30;
  }
}

export function buildTraceListFilter(params: TraceListParams): string | undefined {
  const parts: string[] = [];

  if (params.route && params.route !== "all") {
    parts.push(
      `and(eq(metadata_key, "${DRPE_METADATA_KEYS.route}"), eq(metadata_value, "${params.route}"))`,
    );
  }

  if (params.webSearch && params.webSearch !== "all") {
    parts.push(
      `and(eq(metadata_key, "${DRPE_METADATA_KEYS.webSearch}"), eq(metadata_value, "${params.webSearch}"))`,
    );
  }

  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return `and(${parts.join(", ")})`;
}

function readMetadata(run: Run, key: string): string | null {
  const extra = run.extra as { metadata?: Record<string, unknown> } | undefined;
  const value = extra?.metadata?.[key];
  if (value === undefined || value === null) return null;
  return String(value);
}

function sanitizeMetadata(run: Run): Record<string, string> {
  const extra = run.extra as { metadata?: Record<string, unknown> } | undefined;
  const raw = extra?.metadata ?? {};
  const out: Record<string, string> = {};
  for (const key of SAFE_METADATA_KEYS) {
    const value = raw[key];
    if (value !== undefined && value !== null) {
      out[key] = String(value);
    }
  }
  return out;
}

function runStatus(run: Run): TraceSummary["status"] {
  if (run.error) return "error";
  if (run.end_time) return "success";
  return "pending";
}

function latencyMs(run: Run): number | null {
  if (!run.start_time || !run.end_time) return null;
  const start =
    typeof run.start_time === "number"
      ? run.start_time
      : new Date(run.start_time).getTime();
  const end =
    typeof run.end_time === "number"
      ? run.end_time
      : new Date(run.end_time).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, end - start);
}

function toTraceSummary(run: Run): TraceSummary {
  const meta = sanitizeMetadata(run);
  return {
    id: run.id,
    name: run.name,
    startTime:
      run.start_time !== undefined
        ? new Date(run.start_time).toISOString()
        : new Date(0).toISOString(),
    status: runStatus(run),
    latencyMs: latencyMs(run),
    route: meta[DRPE_METADATA_KEYS.route] ?? null,
    mode: meta[DRPE_METADATA_KEYS.mode] ?? null,
    webSearch: meta[DRPE_METADATA_KEYS.webSearch] ?? null,
    langsmithUrl: buildLangSmithRunUrl({
      runId: run.id,
      traceId: run.trace_id ?? run.id,
      projectId: run.session_id ?? getLangSmithConfig()?.projectId ?? "",
    }),
  };
}

export async function listRecentTraces(
  params: TraceListParams = {},
): Promise<{ project: string; traces: TraceSummary[] }> {
  const config = getLangSmithConfig();
  if (!config) {
    throw new Error("LangSmith is not configured");
  }

  const client = createLangSmithClient(config);
  if (!client) {
    throw new Error("LangSmith is not configured");
  }

  const window = params.window ?? "7d";
  const startTime = new Date(Date.now() - windowToHours(window) * 60 * 60 * 1000);
  const limit = params.limit ?? 50;
  const filter = buildTraceListFilter(params);

  try {
    const runs: Run[] = [];
    for await (const run of client.listRuns({
      ...(config.projectId
        ? { projectId: config.projectId }
        : { projectName: config.project }),
      isRoot: true,
      startTime,
      limit,
      filter,
      error:
        params.status === "error"
          ? true
          : params.status === "success"
            ? false
            : undefined,
    })) {
      runs.push(run);
    }

    const traces = runs
      .map(toTraceSummary)
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );

    return { project: config.project, traces };
  } catch (err) {
    throw new Error(formatLangSmithApiError(err));
  }
}

/** Exported for tests — ensures no inputs/outputs leak. */
export function sanitizeRunForApi(run: Run): TraceSummary {
  return toTraceSummary(run);
}

export function readRunMetadata(run: Run, key: string): string | null {
  return readMetadata(run, key);
}
