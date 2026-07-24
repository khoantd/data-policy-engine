import { notFound } from "next/navigation";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { SystemDetailManager } from "@/components/system-detail-manager";
import { StatusDot } from "@/components/status-dot";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let error: string | null = null;
  let system: Awaited<ReturnType<typeof drpe.getSystem>> | null = null;
  let linkedPolicyIds: string[] = [];
  let allPolicyOptions: { id: string; name: string }[] = [];

  try {
    const [loaded, policies, policyList] = await Promise.all([
      drpe.getSystem(id),
      drpe.listSystemPolicies(id),
      drpe.listPolicies(),
    ]);
    system = loaded;
    linkedPolicyIds = policies;
    allPolicyOptions = policyList.map((p) => ({ id: p.id, name: p.name }));
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load system";
  }

  if (!system) {
    return (
      <>
        <PageHeader
          title="System"
          breadcrumbs={buildBreadcrumbs(`/systems/${id}`)}
        />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={system.name}
        description={
          <span className="font-mono text-xs">
            {system.id}
            {system.source_key ? ` · ${system.source_key}` : ""}
          </span>
        }
        breadcrumbs={buildBreadcrumbs(`/systems/${id}`, {
          tailLabel: system.name,
        })}
        actions={<StatusDot status={system.status} />}
      />
      <ContentCard>
        <div className="p-4 md:p-5">
          <SystemDetailManager
            system={system}
            linkedPolicyIds={linkedPolicyIds}
            allPolicyOptions={allPolicyOptions}
          />
        </div>
      </ContentCard>
    </>
  );
}
