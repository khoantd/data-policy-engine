import { notFound } from "next/navigation";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { ProcessDetailManager } from "@/components/process-detail-manager";
import { StatusDot } from "@/components/status-dot";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let error: string | null = null;
  let process: Awaited<ReturnType<typeof drpe.getProcess>> | null = null;
  let linkedPolicyIds: string[] = [];
  let allPolicyOptions: { id: string; name: string }[] = [];

  try {
    const [loaded, policies, policyList] = await Promise.all([
      drpe.getProcess(id),
      drpe.listProcessPolicies(id),
      drpe.listPolicies(),
    ]);
    process = loaded;
    linkedPolicyIds = policies;
    allPolicyOptions = policyList.map((p) => ({ id: p.id, name: p.name }));
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load process";
  }

  if (!process) {
    return (
      <>
        <PageHeader
          title="Process"
          breadcrumbs={buildBreadcrumbs(`/processes/${id}`)}
        />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={process.name}
        description={<span className="font-mono text-xs">{process.id}</span>}
        breadcrumbs={buildBreadcrumbs(`/processes/${id}`, {
          tailLabel: process.name,
        })}
        actions={<StatusDot status={process.status} />}
      />
      <ContentCard>
        <div className="p-4 md:p-5">
          <ProcessDetailManager
            process={process}
            linkedPolicyIds={linkedPolicyIds}
            allPolicyOptions={allPolicyOptions}
          />
        </div>
      </ContentCard>
    </>
  );
}
