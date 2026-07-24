import { Suspense } from "react";
import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  OVERVIEW_AUDIT_LIMIT,
  OVERVIEW_AUDIT_WINDOW_DAYS,
  OVERVIEW_DSAR_LIMIT,
  OVERVIEW_JOBS_LIMIT,
  OVERVIEW_RECENT_AUDIT_ROWS,
  auditSinceIso,
  bucketAuditByDay,
  buildAttentionItems,
  countActivePolicies,
  countByEventType,
  countOpenDsar,
  summarizeJobs,
} from "@/lib/overview-metrics";
import { OverviewAttention } from "@/components/overview-attention";
import { OverviewChartsLazy } from "@/components/overview-charts-lazy";
import { StatusDot } from "@/components/status-dot";
import { ContentSkeleton } from "@/components/ui/page-skeleton";
import {
  ContentCard,
  EmptyState,
  ErrorAlert,
  Kpi,
  KpiStrip,
  PageHeader,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Monitor policy traffic, enforce jobs, and early signs of trouble."
        breadcrumbs={buildBreadcrumbs("/")}
      />
      <Suspense fallback={<ContentSkeleton kpiCount={6} rows={6} />}>
        <OverviewContent />
      </Suspense>
    </>
  );
}

async function OverviewContent() {
  let healthStatus = "unknown";
  let readyStatus = "unknown";
  let policiesLoaded = 0;
  let policiesCount = 0;
  let activePolicies = 0;
  let dsarCount = 0;
  let openDsar = 0;
  let recentAudit: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  let dayBuckets = bucketAuditByDay([], OVERVIEW_AUDIT_WINDOW_DAYS);
  let eventCounts = countByEventType([]);
  let jobSummary = summarizeJobs([]);
  let auditSampleSize = 0;
  let attention = buildAttentionItems({
    failedJobs: 0,
    jobErrorSum: 0,
    openDsar: 0,
    pendingGrace: 0,
    actions: 0,
  });
  let error: string | null = null;

  try {
    const since = auditSinceIso(OVERVIEW_AUDIT_WINDOW_DAYS);
    const [health, ready, policies, dsar, jobs, auditWindow] =
      await Promise.all([
        drpe.health().catch(() => ({ status: "down" })),
        drpe.ready().catch(() => ({ status: "not_ready", policies_loaded: 0 })),
        drpe.listPolicies(),
        drpe.listDsar(`limit=${OVERVIEW_DSAR_LIMIT}`),
        drpe.listJobs(`limit=${OVERVIEW_JOBS_LIMIT}`),
        drpe.listAudit(
          `since=${encodeURIComponent(since)}&limit=${OVERVIEW_AUDIT_LIMIT}`,
        ),
      ]);
    healthStatus = health.status;
    readyStatus = ready.status;
    policiesLoaded = ready.policies_loaded ?? 0;
    policiesCount = policies.length;
    activePolicies = countActivePolicies(policies);
    dsarCount = dsar.length;
    openDsar = countOpenDsar(dsar);
    jobSummary = summarizeJobs(jobs);
    auditSampleSize = auditWindow.length;
    eventCounts = countByEventType(auditWindow);
    dayBuckets = bucketAuditByDay(auditWindow, OVERVIEW_AUDIT_WINDOW_DAYS);
    attention = buildAttentionItems({
      failedJobs: jobSummary.failed,
      jobErrorSum: jobSummary.errorSum,
      openDsar,
      pendingGrace: eventCounts.pending_grace,
      actions: eventCounts.action,
    });
    recentAudit = auditWindow.slice(0, OVERVIEW_RECENT_AUDIT_ROWS);
  } catch (err) {
    error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Failed to load overview";
  }

  const healthTone =
    healthStatus === "ok" || healthStatus === "healthy"
      ? "success"
      : healthStatus === "down" || healthStatus === "unknown"
        ? "error"
        : "warning";

  return (
    <>
      {error && <ErrorAlert message={error} />}
      <KpiStrip>
        <Kpi
          label="API health"
          value={healthStatus}
          hint={`Ready: ${readyStatus}`}
          compact
          tone={healthTone}
        />
        <Kpi
          label="Policies"
          value={policiesCount}
          hint={`${activePolicies} active · ${policiesLoaded} loaded`}
          compact
        />
        <Kpi
          label="Open DSAR"
          value={openDsar}
          hint={`${dsarCount} recent`}
          compact
          tone={openDsar > 0 ? "warning" : "neutral"}
        />
        <Kpi
          label="Failed jobs"
          value={jobSummary.failed}
          hint={`of ${jobSummary.total} recent`}
          compact
          tone={jobSummary.failed > 0 ? "error" : "neutral"}
        />
        <Kpi
          label="Job errors"
          value={jobSummary.errorSum}
          hint="progress.errors"
          compact
          tone={jobSummary.errorSum > 0 ? "error" : "neutral"}
        />
        <Kpi
          label="Actions"
          value={eventCounts.action}
          hint={`${OVERVIEW_AUDIT_WINDOW_DAYS}d window`}
          compact
          tone={eventCounts.action > 0 ? "warning" : "neutral"}
        />
      </KpiStrip>

      <OverviewAttention items={attention} />

      <OverviewChartsLazy
        dayBuckets={dayBuckets}
        eventCounts={eventCounts}
        jobSummary={jobSummary}
        auditSampleSize={auditSampleSize}
      />

      <ContentCard title="Recent audit">
        {recentAudit.length === 0 ? (
          <EmptyState message="No audit entries yet." />
        ) : (
          <>
            <div className="flex justify-end px-4 py-2">
              <Link
                href="/audit"
                className="text-xs font-medium text-secondary hover:underline cursor-pointer"
              >
                View all audit
              </Link>
            </div>
            <TableWrap stickyHeader>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className={tableHeaderClass}>
                  <tr>
                    <th className={`${tableCellClass} font-medium`}>When</th>
                    <th className={`${tableCellClass} font-medium`}>Event</th>
                    <th className={`${tableCellClass} font-medium`}>Policy</th>
                    <th className={`${tableCellClass} font-medium`}>Record</th>
                    <th className={`${tableCellClass} font-medium`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAudit.map((row) => (
                    <tr key={row.id} className={tableRowClass}>
                      <td
                        className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}
                      >
                        {formatDate(row.created_at)}
                      </td>
                      <td className={tableCellClass}>
                        <StatusDot status={row.event_type} />
                      </td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        {row.policy_id ? (
                          <Link
                            href={`/policies/${row.policy_id}`}
                            className="text-secondary hover:underline cursor-pointer"
                          >
                            {row.policy_id}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        {row.record_id || "—"}
                      </td>
                      <td className={tableCellClass}>{row.action || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </>
        )}
      </ContentCard>
    </>
  );
}
