import Link from "next/link";
import { notFound } from "next/navigation";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { StatusDot } from "@/components/status-dot";
import {
  ErrorAlert,
  Kpi,
  KpiStrip,
  PageHeader,
  Panel,
} from "@/components/ui/layout";

export default async function EnforceJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let job: Awaited<ReturnType<typeof drpe.getJob>> | null = null;
  let error: string | null = null;
  try {
    job = await drpe.getJob(id);
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load job";
  }

  if (!job) {
    return (
      <>
        <PageHeader
          title="Enforcement job"
          breadcrumbs={buildBreadcrumbs(`/enforce/${id}`, { tailLabel: id.slice(0, 8) })}
        />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Enforcement job"
        description={<span className="font-mono text-xs">{job.id}</span>}
        breadcrumbs={buildBreadcrumbs(`/enforce/${id}`, { tailLabel: job.id.slice(0, 8) })}
        actions={<StatusDot status={job.status} />}
      />
      {job.error && <ErrorAlert message={job.error} />}
      <KpiStrip>
        <Kpi label="Scanned" value={job.progress?.scanned ?? 0} compact />
        <Kpi label="Dispatched" value={job.progress?.dispatched ?? 0} compact />
        <Kpi label="Pending grace" value={job.progress?.pending_grace ?? 0} compact />
        <Kpi label="Notified" value={job.progress?.notified ?? 0} compact />
        <Kpi label="Errors" value={job.progress?.errors ?? 0} compact />
      </KpiStrip>
      <Panel title="Details">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-fg">Policy</dt>
            <dd className="font-mono">
              {job.policy_id ? (
                <Link
                  href={`/policies/${encodeURIComponent(job.policy_id)}`}
                  className="text-secondary hover:underline cursor-pointer"
                >
                  {job.policy_id}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-fg">Trigger</dt>
            <dd>{job.trigger}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-fg">Requested</dt>
            <dd className="font-mono text-xs">{formatDate(job.requested_at)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-fg">Started</dt>
            <dd className="font-mono text-xs">{formatDate(job.started_at)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-fg">Finished</dt>
            <dd className="font-mono text-xs">{formatDate(job.finished_at)}</dd>
          </div>
        </dl>
      </Panel>
    </>
  );
}
