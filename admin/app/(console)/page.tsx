import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { StatusDot } from "@/components/status-dot";
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

export default async function OverviewPage() {
  let healthStatus = "unknown";
  let readyStatus = "unknown";
  let policiesLoaded = 0;
  let policiesCount = 0;
  let dsarCount = 0;
  let jobsCount = 0;
  let openDsar = 0;
  let recentAudit: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  let error: string | null = null;

  try {
    const [health, ready, policies, dsar, jobs, audit] = await Promise.all([
      drpe.health().catch(() => ({ status: "down" })),
      drpe.ready().catch(() => ({ status: "not_ready", policies_loaded: 0 })),
      drpe.listPolicies(),
      drpe.listDsar("limit=50"),
      drpe.listJobs("limit=50"),
      drpe.listAudit("limit=15"),
    ]);
    healthStatus = health.status;
    readyStatus = ready.status;
    policiesLoaded = ready.policies_loaded ?? 0;
    policiesCount = policies.length;
    dsarCount = dsar.length;
    openDsar = dsar.filter((d) =>
      ["received", "in_progress", "partial"].includes(d.status),
    ).length;
    jobsCount = jobs.length;
    recentAudit = audit;
  } catch (err) {
    error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Failed to load overview";
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="Live snapshot of engine health and recent activity."
        breadcrumbs={buildBreadcrumbs("/")}
      />
      {error && <ErrorAlert message={error} />}
      <KpiStrip>
        <Kpi label="API health" value={healthStatus} hint={`Ready: ${readyStatus}`} compact />
        <Kpi label="Policies" value={policiesCount} hint={`${policiesLoaded} loaded`} compact />
        <Kpi label="Open DSAR" value={openDsar} hint={`${dsarCount} recent`} compact />
        <Kpi label="Enforce jobs" value={jobsCount} hint="Last 50" compact />
      </KpiStrip>
      <ContentCard title="Recent audit">
        {recentAudit.length === 0 ? (
          <EmptyState message="No audit entries yet." />
        ) : (
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
                    <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>
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
        )}
      </ContentCard>
    </>
  );
}
