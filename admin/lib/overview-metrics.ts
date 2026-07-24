import { AUDIT_EVENT_TYPE_OPTIONS } from "@/lib/audit-event-types";
import type {
  AuditEntry,
  AuditEventType,
  DsarRequestStatus,
  EnforcementJob,
  JobStatus,
  PolicyStatus,
} from "@/lib/types";

export const OVERVIEW_AUDIT_WINDOW_DAYS = 7;
/** Cap for chart + recent-table sample (single audit fetch). */
export const OVERVIEW_AUDIT_LIMIT = 250;
/** Rows shown in the Overview recent-audit table (sliced from the window sample). */
export const OVERVIEW_RECENT_AUDIT_ROWS = 15;
export const OVERVIEW_JOBS_LIMIT = 50;
export const OVERVIEW_DSAR_LIMIT = 50;

export type DayBucket = {
  day: string;
  evaluations: number;
  actions: number;
};

export type EventTypeCounts = Record<AuditEventType, number>;

export type JobSummary = {
  total: number;
  failed: number;
  running: number;
  queued: number;
  succeeded: number;
  cancelled: number;
  errorSum: number;
  byStatus: Record<JobStatus, number>;
};

export type AttentionSeverity = "error" | "warning";

export type AttentionItem = {
  severity: AttentionSeverity;
  message: string;
  href: string;
};

export type OverviewAttentionInput = {
  failedJobs: number;
  jobErrorSum: number;
  openDsar: number;
  pendingGrace: number;
  actions: number;
};

const OPEN_DSAR: ReadonlySet<DsarRequestStatus> = new Set([
  "received",
  "in_progress",
  "partial",
]);

const JOB_STATUSES: readonly JobStatus[] = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
];

function emptyEventCounts(): EventTypeCounts {
  const counts = {} as EventTypeCounts;
  for (const opt of AUDIT_EVENT_TYPE_OPTIONS) {
    counts[opt.value] = 0;
  }
  return counts;
}

function emptyJobByStatus(): Record<JobStatus, number> {
  return {
    queued: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
    cancelled: 0,
  };
}

/** UTC calendar day `YYYY-MM-DD`. */
export function utcDayKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function addUtcDays(dayKey: string, delta: number): string {
  const d = new Date(`${dayKey}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/**
 * Daily evaluation/action counts for the last `days` UTC days ending at `end`.
 * Always returns exactly `days` rows (oldest → newest), zero-filled.
 */
export function bucketAuditByDay(
  entries: readonly AuditEntry[],
  days: number,
  end: Date = new Date(),
): DayBucket[] {
  const endKey = utcDayKey(end);
  const startKey = addUtcDays(endKey, -(days - 1));
  const map = new Map<string, DayBucket>();
  for (let i = 0; i < days; i++) {
    const key = addUtcDays(startKey, i);
    map.set(key, { day: key, evaluations: 0, actions: 0 });
  }

  for (const entry of entries) {
    const key = utcDayKey(entry.created_at);
    const bucket = map.get(key);
    if (!bucket) continue;
    if (entry.event_type === "evaluation") bucket.evaluations += 1;
    else if (entry.event_type === "action") bucket.actions += 1;
  }

  return Array.from(map.values());
}

export function countByEventType(
  entries: readonly AuditEntry[],
): EventTypeCounts {
  const counts = emptyEventCounts();
  for (const entry of entries) {
    if (entry.event_type in counts) {
      counts[entry.event_type] += 1;
    }
  }
  return counts;
}

export function summarizeJobs(jobs: readonly EnforcementJob[]): JobSummary {
  const byStatus = emptyJobByStatus();
  let errorSum = 0;
  for (const j of jobs) {
    if (JOB_STATUSES.includes(j.status)) {
      byStatus[j.status] += 1;
    }
    errorSum += j.progress?.errors ?? 0;
  }
  return {
    total: jobs.length,
    failed: byStatus.failed,
    running: byStatus.running,
    queued: byStatus.queued,
    succeeded: byStatus.succeeded,
    cancelled: byStatus.cancelled,
    errorSum,
    byStatus,
  };
}

export function countOpenDsar(
  requests: ReadonlyArray<{ status: DsarRequestStatus }>,
): number {
  return requests.filter((r) => OPEN_DSAR.has(r.status)).length;
}

export function countActivePolicies(
  policies: ReadonlyArray<{ status: PolicyStatus }>,
): number {
  return policies.filter((p) => p.status === "active").length;
}

/** ISO timestamp for `since` query: start of window relative to `end`. */
export function auditSinceIso(
  days: number = OVERVIEW_AUDIT_WINDOW_DAYS,
  end: Date = new Date(),
): string {
  const d = new Date(end);
  d.setUTCDate(d.getUTCDate() - (days - 1));
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export function buildAttentionItems(
  input: OverviewAttentionInput,
): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (input.failedJobs > 0) {
    items.push({
      severity: "error",
      message: `${input.failedJobs} failed enforce job${input.failedJobs === 1 ? "" : "s"} in the last ${OVERVIEW_JOBS_LIMIT}`,
      href: "/enforce",
    });
  }

  if (input.jobErrorSum > 0) {
    items.push({
      severity: "error",
      message: `${input.jobErrorSum} record error${input.jobErrorSum === 1 ? "" : "s"} across recent enforce jobs`,
      href: "/enforce",
    });
  }

  if (input.pendingGrace > 0) {
    items.push({
      severity: "warning",
      message: `${input.pendingGrace} pending grace event${input.pendingGrace === 1 ? "" : "s"} in the last ${OVERVIEW_AUDIT_WINDOW_DAYS} days`,
      href: "/audit?event_type=pending_grace",
    });
  }

  if (input.openDsar > 0) {
    items.push({
      severity: "warning",
      message: `${input.openDsar} open DSAR request${input.openDsar === 1 ? "" : "s"} need attention`,
      href: "/dsar",
    });
  }

  return items;
}

export function eventTypeChartRows(
  counts: EventTypeCounts,
): Array<{ key: AuditEventType; label: string; count: number }> {
  return AUDIT_EVENT_TYPE_OPTIONS.map((opt) => ({
    key: opt.value,
    label: opt.label,
    count: counts[opt.value],
  }));
}

export function jobStatusChartRows(
  byStatus: Record<JobStatus, number>,
): Array<{ key: JobStatus; label: string; count: number }> {
  const labels: Record<JobStatus, string> = {
    queued: "Queued",
    running: "Running",
    succeeded: "Succeeded",
    failed: "Failed",
    cancelled: "Cancelled",
  };
  return JOB_STATUSES.map((key) => ({
    key,
    label: labels[key],
    count: byStatus[key],
  }));
}
