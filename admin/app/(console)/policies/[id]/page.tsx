import { notFound } from "next/navigation";
import { dump as yamlDump } from "js-yaml";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError, PolicyStatus } from "@/lib/types";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { PolicyYamlEditor } from "@/components/policy-forms";
import { PolicyStatusActions } from "@/components/policy-status-actions";
import { VersionsPanel } from "@/components/versions-panel";
import { StatusDot } from "@/components/status-dot";
import {
  ErrorAlert,
  PageHeader,
  Panel,
} from "@/components/ui/layout";

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let error: string | null = null;
  let policy: Awaited<ReturnType<typeof drpe.getPolicy>> | null = null;
  let versions: Awaited<ReturnType<typeof drpe.listVersions>> = [];

  try {
    const [loaded, versionsLoaded] = await Promise.all([
      drpe.getPolicy(id),
      drpe.listVersions(id),
    ]);
    policy = loaded;
    versions = versionsLoaded;
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load policy";
  }

  if (!policy) {
    return (
      <>
        <PageHeader title="Policy" breadcrumbs={buildBreadcrumbs(`/policies/${id}`)} />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  const initialYaml = yamlDump(
    { policy },
    { lineWidth: 100, noRefs: true, sortKeys: false },
  );

  const kindLabel =
    policy.policy_kind === "classification" && "entities" in policy
      ? `${policy.entities.length} entities`
      : "data_classification" in policy
        ? policy.data_classification
        : policy.policy_kind;

  return (
    <>
      <PageHeader
        title={policy.name}
        description={
          <span className="font-mono text-xs">
            {policy.id} · jurisdiction {policy.jurisdiction} · {kindLabel}
          </span>
        }
        breadcrumbs={buildBreadcrumbs(`/policies/${id}`, { tailLabel: policy.id })}
        actions={<StatusDot status={String(policy.status)} />}
      />
      <PolicyStatusActions
        policyId={policy.id}
        currentStatus={policy.status as PolicyStatus}
      />
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-fg">
        <span>
          Version <span className="font-mono text-foreground">v{policy.version}</span>
        </span>
        <span>
          Rules <span className="font-mono text-foreground">{policy.rules.length}</span>
        </span>
        {policy.owner && (
          <span>
            Owner <span className="font-mono text-foreground">{policy.owner}</span>
          </span>
        )}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel title="Definition">
          <PolicyYamlEditor policyId={policy.id} initialYaml={initialYaml} />
        </Panel>
        <Panel title="Version history">
          <VersionsPanel
            policyId={policy.id}
            versions={versions}
            currentVersion={policy.version}
          />
        </Panel>
      </div>
    </>
  );
}
