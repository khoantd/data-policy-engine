import { drpe } from "@/lib/drpe-client";
import { auditScheduleFields } from "@/lib/audit-payload";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { AuditFilters } from "@/components/dsar-audit-forms";
import { StatusDot } from "@/components/status-dot";
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
  }>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  qs.set("limit", "200");
  if (sp.event_type) qs.set("event_type", sp.event_type);
  if (sp.policy_id) qs.set("policy_id", sp.policy_id);
  if (sp.record_id) qs.set("record_id", sp.record_id);
  if (sp.job_id) qs.set("job_id", sp.job_id);
  if (sp.requester) qs.set("requester", sp.requester);

  let error: string | null = null;
  let logs: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  try {
    logs = await drpe.listAudit(qs.toString());
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load audit logs";
  }

  return (
    <>
      <PageHeader
        title="Audit"
        description="Immutable evaluation and action trail. Filter before scanning dense tables."
        breadcrumbs={buildBreadcrumbs("/audit")}
      />
      {error && <ErrorAlert message={error} />}
      <AuditFilters initial={sp} />
      {logs.length === 0 ? (
        <EmptyState message="No audit entries for this filter." />
      ) : (
        <TableWrap stickyHeader>
          <table className="w-full min-w-[960px] text-left text-sm">
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
              </tr>
            </thead>
            <tbody>
              {logs.map((row) => {
                const schedule = auditScheduleFields(row.payload);
                return (
                  <tr key={row.id} className={tableRowClass}>
                    <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      )}
    </>
  );
}
