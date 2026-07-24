import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { TriggerEnforceForm } from "@/components/enforce-form";
import { StatusDot } from "@/components/status-dot";
import { PaginationBar } from "@/components/ui/pagination";
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

export default async function EnforcePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listJobs>> = [];
  try {
    fetched = await drpe.listJobs(`limit=${limit}&offset=${offset}`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load jobs";
  }
  const pagination = resolveOffsetPage(fetched, page);

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
        {pagination.items.length === 0 ? (
          <EmptyState message="No enforcement jobs yet." />
        ) : (
          <>
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
                  {pagination.items.map((j) => (
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
                        {j.progress?.scanned ?? 0}/
                        {j.progress?.dispatched ?? 0}d /{" "}
                        {j.progress?.errors ?? 0}e
                      </td>
                      <td
                        className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}
                      >
                        {formatDate(j.requested_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
            <div className="px-4 pb-4 md:px-5">
              <PaginationBar
                pathname="/enforce"
                searchParams={sp}
                state={pagination}
                className="mt-0"
              />
            </div>
          </>
        )}
      </ContentCard>
    </>
  );
}
