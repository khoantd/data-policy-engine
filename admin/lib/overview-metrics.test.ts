import {
  OVERVIEW_AUDIT_LIMIT,
  OVERVIEW_AUDIT_WINDOW_DAYS,
  OVERVIEW_JOBS_LIMIT,
  OVERVIEW_RECENT_AUDIT_ROWS,
  bucketAuditByDay,
  buildAttentionItems,
  countByEventType,
  countOpenDsar,
  countActivePolicies,
  summarizeJobs,
  type OverviewAttentionInput,
} from "./overview-metrics";
import type { AuditEntry, EnforcementJob } from "@/lib/types";
import { describe, expect, it } from "vitest";

function audit(
  partial: Partial<AuditEntry> & Pick<AuditEntry, "id" | "event_type" | "created_at">,
): AuditEntry {
  return partial;
}

function job(
  partial: Partial<EnforcementJob> & Pick<EnforcementJob, "id" | "status" | "requested_at">,
): EnforcementJob {
  return {
    trigger: "api",
    ...partial,
  };
}

describe("overview-metrics constants", () => {
  it("documents the Overview sample windows", () => {
    expect(OVERVIEW_AUDIT_WINDOW_DAYS).toBe(7);
    expect(OVERVIEW_AUDIT_LIMIT).toBe(250);
    expect(OVERVIEW_RECENT_AUDIT_ROWS).toBe(15);
    expect(OVERVIEW_JOBS_LIMIT).toBe(50);
  });
});

describe("bucketAuditByDay", () => {
  it("fills every day in the window with zeros when empty", () => {
    const end = new Date("2026-07-23T12:00:00.000Z");
    const rows = bucketAuditByDay([], 3, end);
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.day)).toEqual([
      "2026-07-21",
      "2026-07-22",
      "2026-07-23",
    ]);
    expect(rows.every((r) => r.evaluations === 0 && r.actions === 0)).toBe(true);
  });

  it("counts evaluations and actions by UTC day", () => {
    const end = new Date("2026-07-23T18:00:00.000Z");
    const entries = [
      audit({
        id: "1",
        event_type: "evaluation",
        created_at: "2026-07-22T01:00:00.000Z",
      }),
      audit({
        id: "2",
        event_type: "evaluation",
        created_at: "2026-07-22T23:00:00.000Z",
      }),
      audit({
        id: "3",
        event_type: "action",
        created_at: "2026-07-22T12:00:00.000Z",
      }),
      audit({
        id: "4",
        event_type: "notify",
        created_at: "2026-07-23T08:00:00.000Z",
      }),
      audit({
        id: "5",
        event_type: "action",
        created_at: "2026-07-21T08:00:00.000Z",
      }),
    ];
    const rows = bucketAuditByDay(entries, 3, end);
    expect(rows).toEqual([
      { day: "2026-07-21", evaluations: 0, actions: 1 },
      { day: "2026-07-22", evaluations: 2, actions: 1 },
      { day: "2026-07-23", evaluations: 0, actions: 0 },
    ]);
  });

  it("ignores entries outside the window", () => {
    const end = new Date("2026-07-23T00:00:00.000Z");
    const entries = [
      audit({
        id: "old",
        event_type: "action",
        created_at: "2026-07-19T00:00:00.000Z",
      }),
    ];
    const rows = bucketAuditByDay(entries, 3, end);
    expect(rows.every((r) => r.actions === 0)).toBe(true);
  });
});

describe("countByEventType", () => {
  it("returns zero for every known event type when empty", () => {
    const counts = countByEventType([]);
    expect(counts.evaluation).toBe(0);
    expect(counts.action).toBe(0);
    expect(counts.pending_grace).toBe(0);
    expect(counts.dsar_erasure).toBe(0);
    expect(counts.grace_cancelled).toBe(0);
  });

  it("tallies each event type", () => {
    const counts = countByEventType([
      audit({ id: "a", event_type: "action", created_at: "2026-07-23T00:00:00.000Z" }),
      audit({ id: "b", event_type: "action", created_at: "2026-07-23T00:00:00.000Z" }),
      audit({ id: "c", event_type: "flag", created_at: "2026-07-23T00:00:00.000Z" }),
    ]);
    expect(counts.action).toBe(2);
    expect(counts.flag).toBe(1);
    expect(counts.evaluation).toBe(0);
  });
});

describe("summarizeJobs", () => {
  it("summarizes empty jobs", () => {
    expect(summarizeJobs([])).toEqual({
      total: 0,
      failed: 0,
      running: 0,
      queued: 0,
      succeeded: 0,
      cancelled: 0,
      errorSum: 0,
      byStatus: {
        queued: 0,
        running: 0,
        succeeded: 0,
        failed: 0,
        cancelled: 0,
      },
    });
  });

  it("counts statuses and sums progress.errors", () => {
    const summary = summarizeJobs([
      job({
        id: "1",
        status: "failed",
        requested_at: "2026-07-23T00:00:00.000Z",
        progress: {
          scanned: 10,
          dispatched: 5,
          pending_grace: 0,
          notified: 0,
          errors: 3,
        },
      }),
      job({
        id: "2",
        status: "succeeded",
        requested_at: "2026-07-23T00:00:00.000Z",
        progress: {
          scanned: 10,
          dispatched: 10,
          pending_grace: 1,
          notified: 2,
          errors: 1,
        },
      }),
      job({
        id: "3",
        status: "running",
        requested_at: "2026-07-23T00:00:00.000Z",
      }),
    ]);
    expect(summary.total).toBe(3);
    expect(summary.failed).toBe(1);
    expect(summary.running).toBe(1);
    expect(summary.succeeded).toBe(1);
    expect(summary.errorSum).toBe(4);
    expect(summary.byStatus.failed).toBe(1);
  });
});

describe("countOpenDsar / countActivePolicies", () => {
  it("counts open DSAR statuses", () => {
    expect(
      countOpenDsar([
        { status: "received" },
        { status: "in_progress" },
        { status: "partial" },
        { status: "completed" },
        { status: "denied" },
      ]),
    ).toBe(3);
  });

  it("counts active policies", () => {
    expect(
      countActivePolicies([
        { status: "active" },
        { status: "draft" },
        { status: "active" },
      ]),
    ).toBe(2);
  });
});

describe("buildAttentionItems", () => {
  const base: OverviewAttentionInput = {
    failedJobs: 0,
    jobErrorSum: 0,
    openDsar: 0,
    pendingGrace: 0,
    actions: 0,
  };

  it("returns empty when healthy", () => {
    expect(buildAttentionItems(base)).toEqual([]);
  });

  it("flags failed jobs with enforce link", () => {
    const items = buildAttentionItems({ ...base, failedJobs: 2 });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      severity: "error",
      href: "/enforce",
    });
    expect(items[0].message).toMatch(/2 failed/i);
  });

  it("flags job errors, pending grace, and open DSAR", () => {
    const items = buildAttentionItems({
      failedJobs: 0,
      jobErrorSum: 5,
      openDsar: 3,
      pendingGrace: 12,
      actions: 0,
    });
    expect(items.map((i) => i.href)).toEqual([
      "/enforce",
      "/audit?event_type=pending_grace",
      "/dsar",
    ]);
    expect(items.every((i) => i.severity === "warning" || i.severity === "error")).toBe(
      true,
    );
  });
});
