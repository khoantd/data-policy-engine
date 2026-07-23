import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { TriggerEnforceForm } from "@/components/enforce-form";
import { StatusDot } from "@/components/status-dot";
import {
  ContentCard,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Panel,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";

export default async function EnforcePage() {
  let error: string | null = null;
  let jobs: Awaited<ReturnType<typeof drpe.listJobs>> = [];
  try {
    jobs = await drpe.listJobs("limit=100");
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load jobs";
  }

  return (
    <>
      <PageHeader
        title="Enforce"
        description="Queue retention enforcement scans and inspect job progress."
        breadcrumbs={buildBreadcrumbs("/enforce")}
      />
      {error && <ErrorAlert message={error} />}
      <Panel title="Trigger" className="mb-6">
        <TriggerEnforceForm />
      </Panel>
      <p className="mb-4 text-sm text-muted-fg">
        Manage deferred deletions on{" "}
        <Link
          href="/grace-holds"
          className="text-secondary hover:underline cursor-pointer"
        >
          Grace holds
        </Link>
        .
      </p>
      <ContentCard title="Jobs">
        {jobs.length === 0 ? (
          <EmptyState message="No enforcement jobs yet." />
        ) : (
          <TableWrap stickyHeader>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`${tableCellClass} font-medium`}>Job</th>
                  <th className={`${tableCellClass} font-medium`}>Status</th>
                  <th className={`${tableCellClass} font-medium`}>Policy</th>
                  <th className={`${tableCellClass} font-medium`}>Trigger</th>
                  <th className={`${tableCellClass} font-medium`}>Progress</th>
                  <th className={`${tableCellClass} font-medium`}>Requested</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className={tableRowClass}>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      <Link
                        href={`/enforce/${encodeURIComponent(j.id)}`}
                        className="text-secondary hover:underline cursor-pointer"
                      >
                        {j.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className={tableCellClass}>
                      <StatusDot status={j.status} />
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {j.policy_id || "—"}
                    </td>
                    <td className={tableCellClass}>{j.trigger}</td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {j.progress?.scanned ?? 0}/{j.progress?.dispatched ?? 0}d /{" "}
                      {j.progress?.errors ?? 0}e
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>
                      {formatDate(j.requested_at)}
                    </td>
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
