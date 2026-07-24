import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { GraceHoldActions } from "@/components/grace-hold-actions";
import { StatusDot } from "@/components/status-dot";
import { PaginationBar } from "@/components/ui/pagination";
import {
  EmptyState,
  ErrorAlert,
  PageHeader,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";

export default async function GraceHoldsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listGraceHolds>> = [];
  try {
    fetched = await drpe.listGraceHolds(
      `status=active&limit=${limit}&offset=${offset}`,
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load grace holds";
  }
  const pagination = resolveOffsetPage(fetched, page);

  return (
    <>
      <PageHeader
        title="Grace holds"
        description="Active deferred destructive actions. Force to dispatch now, or cancel to abort this cycle."
        breadcrumbs={buildBreadcrumbs("/grace-holds")}
      />
      {error && <ErrorAlert message={error} />}
      <p className="mb-4 text-sm text-muted-fg">
        Related:{" "}
        <Link
          href="/enforce"
          className="text-secondary hover:underline cursor-pointer"
        >
          Enforce jobs
        </Link>
        {" · "}
        <Link
          href="/audit?event_type=pending_grace"
          className="text-secondary hover:underline cursor-pointer"
        >
          Pending grace audit
        </Link>
      </p>
      {pagination.items.length === 0 ? (
        <EmptyState message="No active grace holds. Trigger Enforce when a rule with grace_period matches." />
      ) : (
        <>
          <TableWrap stickyHeader>
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`${tableCellClass} font-medium`}>Hold</th>
                  <th className={`${tableCellClass} font-medium`}>Status</th>
                  <th className={`${tableCellClass} font-medium`}>Policy</th>
                  <th className={`${tableCellClass} font-medium`}>Rule</th>
                  <th className={`${tableCellClass} font-medium`}>Record</th>
                  <th className={`${tableCellClass} font-medium`}>Action</th>
                  <th className={`${tableCellClass} font-medium`}>Grace ends</th>
                  <th className={`${tableCellClass} font-medium`}>Ops</th>
                </tr>
              </thead>
              <tbody>
                {pagination.items.map((h) => (
                  <tr key={h.id} className={tableRowClass}>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {h.id}
                    </td>
                    <td className={tableCellClass}>
                      <StatusDot status={h.status} />
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {h.policy_id}
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {h.rule_id}
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {h.record_id}
                    </td>
                    <td className={tableCellClass}>{h.action}</td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      <div className="whitespace-nowrap">
                        {formatDate(h.grace_period_ends)}
                      </div>
                      {h.notify_at ? (
                        <div className="mt-0.5 whitespace-nowrap text-muted-fg">
                          Notify {formatDate(h.notify_at)}
                        </div>
                      ) : null}
                    </td>
                    <td className={tableCellClass}>
                      <GraceHoldActions holdId={h.id} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          <PaginationBar
            pathname="/grace-holds"
            searchParams={sp}
            state={pagination}
          />
        </>
      )}
    </>
  );
}
