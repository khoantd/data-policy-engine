import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { CreateDsarForm } from "@/components/dsar-audit-forms";
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

export default async function DsarPage() {
  let error: string | null = null;
  let requests: Awaited<ReturnType<typeof drpe.listDsar>> = [];
  try {
    requests = await drpe.listDsar("limit=100");
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load DSAR";
  }

  return (
    <>
      <PageHeader
        title="DSAR"
        description="Data subject access and erasure requests."
        breadcrumbs={buildBreadcrumbs("/dsar")}
      />
      {error && <ErrorAlert message={error} />}
      <Panel title="Create request" className="mb-6">
        <CreateDsarForm />
      </Panel>
      <ContentCard title="Recent requests">
        {requests.length === 0 ? (
          <EmptyState message="No DSAR requests yet." />
        ) : (
          <TableWrap stickyHeader>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`${tableCellClass} font-medium`}>ID</th>
                  <th className={`${tableCellClass} font-medium`}>Type</th>
                  <th className={`${tableCellClass} font-medium`}>Status</th>
                  <th className={`${tableCellClass} font-medium`}>Subject</th>
                  <th className={`${tableCellClass} font-medium`}>Policy</th>
                  <th className={`${tableCellClass} font-medium`}>Requested</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className={tableRowClass}>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      <Link
                        href={`/dsar/${encodeURIComponent(r.id)}`}
                        className="text-secondary hover:underline cursor-pointer"
                      >
                        {r.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className={tableCellClass}>
                      <StatusDot status={r.type} />
                    </td>
                    <td className={tableCellClass}>
                      <StatusDot status={r.status} />
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>{r.subject_id}</td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      <Link
                        href={`/policies/${encodeURIComponent(r.policy_id)}`}
                        className="text-secondary hover:underline cursor-pointer"
                      >
                        {r.policy_id}
                      </Link>
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>
                      {formatDate(r.requested_at)}
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
