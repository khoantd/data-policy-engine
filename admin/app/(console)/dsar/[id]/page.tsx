import Link from "next/link";
import { notFound } from "next/navigation";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { StatusDot } from "@/components/status-dot";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";

export default async function DsarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let req: Awaited<ReturnType<typeof drpe.getDsar>> | null = null;
  let error: string | null = null;
  try {
    req = await drpe.getDsar(id);
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load request";
  }

  if (!req) {
    return (
      <>
        <PageHeader
          title="DSAR request"
          breadcrumbs={buildBreadcrumbs(`/dsar/${id}`, { tailLabel: id.slice(0, 8) })}
        />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`DSAR ${req.type}`}
        description={<span className="font-mono text-xs">{req.id}</span>}
        breadcrumbs={buildBreadcrumbs(`/dsar/${id}`, { tailLabel: req.id.slice(0, 8) })}
        actions={<StatusDot status={req.status} />}
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <p className="text-xs text-muted-fg">Subject</p>
          <p className="font-mono">{req.subject_id}</p>
        </div>
        <div>
          <p className="text-xs text-muted-fg">Policy</p>
          <Link
            href={`/policies/${encodeURIComponent(req.policy_id)}`}
            className="font-mono text-secondary hover:underline cursor-pointer"
          >
            {req.policy_id}
          </Link>
        </div>
        <div>
          <p className="text-xs text-muted-fg">Requested</p>
          <p className="font-mono text-xs">{formatDate(req.requested_at)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-fg">Completed</p>
          <p className="font-mono text-xs">{formatDate(req.completed_at)}</p>
        </div>
      </div>
      {req.error && <ErrorAlert message={req.error} />}
      <ContentCard title="Result records" className="mb-4">
        <TableWrap>
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className={tableHeaderClass}>
              <tr>
                <th className={`${tableCellClass} font-medium`}>Record</th>
                <th className={`${tableCellClass} font-medium`}>Data type</th>
                <th className={`${tableCellClass} font-medium`}>Source</th>
              </tr>
            </thead>
            <tbody>
              {(req.result?.records ?? []).map((r) => (
                <tr key={r.record_id} className={tableRowClass}>
                  <td className={`${tableCellClass} font-mono text-xs`}>{r.record_id}</td>
                  <td className={tableCellClass}>{r.data_type}</td>
                  <td className={`${tableCellClass} font-mono text-xs`}>{r.source || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        {(req.result?.erased?.length ?? 0) > 0 && (
          <p className="mt-3 px-4 pb-4 text-sm">
            Erased:{" "}
            <span className="font-mono text-xs">
              {(req.result?.erased ?? []).join(", ")}
            </span>
          </p>
        )}
        {(req.result?.denied?.length ?? 0) > 0 && (
          <ul className="mt-3 list-disc px-4 pb-4 pl-9 text-sm">
            {(req.result?.denied ?? []).map((d) => (
              <li key={d.record_id}>
                <span className="font-mono text-xs">{d.record_id}</span>: {d.reason}
              </li>
            ))}
          </ul>
        )}
      </ContentCard>
    </>
  );
}
