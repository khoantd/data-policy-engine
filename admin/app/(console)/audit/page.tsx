import { drpe } from "@/lib/drpe-client";
import { auditScheduleFields, auditHoldId } from "@/lib/audit-payload";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { AuditFilters } from "@/components/dsar-audit-forms";
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

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    event_type?: string;
    policy_id?: string;
    record_id?: string;
    job_id?: string;
    requester?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));
  if (sp.event_type) qs.set("event_type", sp.event_type);
  if (sp.policy_id) qs.set("policy_id", sp.policy_id);
  if (sp.record_id) qs.set("record_id", sp.record_id);
  if (sp.job_id) qs.set("job_id", sp.job_id);
  if (sp.requester) qs.set("requester", sp.requester);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  try {
    fetched = await drpe.listAudit(qs.toString());
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load audit logs";
  }
  const pagination = resolveOffsetPage(fetched, page);

  return (
    <>
      <PageHeader
        title="Audit"
        description="Immutable evaluation and action trail. Filter before scanning dense tables."
        breadcrumbs={buildBreadcrumbs("/audit")}
      />
      {error && <ErrorAlert message={error} />}
      <AuditFilters initial={sp} />
      {pagination.items.length === 0 ? (
        <EmptyState message="No audit entries for this filter." />
      ) : (
        <>
          <TableWrap stickyHeader>
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`${tableCellClass} font-medium`}>When</th>
                  <th className={`${tableCellClass} font-medium`}>Event</th>
                  <th className={`${tableCellClass} font-medium`}>Policy</th>
                  <th className={`${tableCellClass} font-medium`}>Rule</th>
                  <th className={`${tableCellClass} font-medium`}>Record</th>
                  <th className={`${tableCellClass} font-medium`}>Action</th>
                  <th className={`${tableCellClass} font-medium`}>Grace ends</th>
                  <th className={`${tableCellClass} font-medium`}>Job</th>
                  <th className={`${tableCellClass} font-medium`}>Ops</th>
                </tr>
              </thead>
              <tbody>
                {pagination.items.map((row) => {
                  const schedule = auditScheduleFields(row.payload);
                  const holdId = auditHoldId(row.payload);
                  return (
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
                        {row.policy_id || "—"}
                      </td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        {row.rule_id || "—"}
                      </td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        {row.record_id || "—"}
                      </td>
                      <td className={tableCellClass}>{row.action || "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        <div className="whitespace-nowrap">
                          {formatDate(schedule.gracePeriodEnds)}
                        </div>
                        {schedule.notifyAt ? (
                          <div className="mt-0.5 whitespace-nowrap text-muted-fg">
                            Notify {formatDate(schedule.notifyAt)}
                          </div>
                        ) : null}
                      </td>
                      <td className={`${tableCellClass} font-mono text-xs`}>
                        {row.job_id || "—"}
                      </td>
                      <td className={tableCellClass}>
                        {row.event_type === "pending_grace" && holdId ? (
                          <GraceHoldActions holdId={holdId} compact />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
          <PaginationBar
            pathname="/audit"
            searchParams={sp}
            state={pagination}
          />
        </>
      )}
    </>
  );
}
