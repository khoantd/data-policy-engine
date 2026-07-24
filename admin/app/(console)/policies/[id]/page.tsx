import Link from "next/link";
import { notFound } from "next/navigation";
import { dump as yamlDump } from "js-yaml";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError, PolicyStatus } from "@/lib/types";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { policyForYamlDump } from "@/lib/reference-sources";
import { PolicyYamlEditor } from "@/components/policy-forms";
import { PolicyStatusActions } from "@/components/policy-status-actions";
import { VersionsPanel } from "@/components/versions-panel";
import { StatusDot } from "@/components/status-dot";
import { AiSourceReferences } from "@/components/ai-source-references";
import { PolicyStructureGraph } from "@/components/policy-structure-graph";
import { PolicyAppliesToPanel } from "@/components/policy-applies-to";
import { Button } from "@/components/ui/button";
import {
  ErrorAlert,
  PageHeader,
  Panel,
} from "@/components/ui/layout";

export default async function PolicyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ focus?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  let error: string | null = null;
  let policy: Awaited<ReturnType<typeof drpe.getPolicy>> | null = null;
  let versions: Awaited<ReturnType<typeof drpe.listVersions>> = [];
  let linkedSystems: Awaited<ReturnType<typeof drpe.listPolicySystems>> = [];
  let linkedProcesses: Awaited<ReturnType<typeof drpe.listPolicyProcesses>> =
    [];
  let allSystems: Awaited<ReturnType<typeof drpe.listSystems>> = [];
  let allProcesses: Awaited<ReturnType<typeof drpe.listProcesses>> = [];

  try {
    const [
      loaded,
      versionsLoaded,
      systemsLinked,
      processesLinked,
      systemsAll,
      processesAll,
    ] = await Promise.all([
      drpe.getPolicy(id),
      drpe.listVersions(id),
      drpe.listPolicySystems(id).catch(() => []),
      drpe.listPolicyProcesses(id).catch(() => []),
      drpe.listSystems("limit=500").catch(() => []),
      drpe.listProcesses("limit=500").catch(() => []),
    ]);
    policy = loaded;
    versions = versionsLoaded;
    linkedSystems = systemsLinked;
    linkedProcesses = processesLinked;
    allSystems = systemsAll;
    allProcesses = processesAll;
  } catch (err) {
    if (err instanceof DrpeApiError && err.status === 404) notFound();
    error = err instanceof Error ? err.message : "Failed to load policy";
  }

  if (!policy) {
    return (
      <>
        <PageHeader
          title="Policy"
          breadcrumbs={buildBreadcrumbs(`/policies/${id}`)}
        />
        {error && <ErrorAlert message={error} />}
      </>
    );
  }

  const initialYaml = yamlDump(
    { policy: policyForYamlDump(policy) },
    { lineWidth: 100, noRefs: true, sortKeys: false },
  );

  const kindLabel =
    policy.policy_kind === "classification" && "entities" in policy
      ? `${policy.entities.length} entities`
      : "data_classification" in policy
        ? policy.data_classification
        : policy.policy_kind;

  const referenceSources = policy.reference_sources ?? [];
  const catalogLinks = {
    systems: linkedSystems.map((s) => ({
      id: s.id,
      name: s.name,
      source_key: s.source_key,
    })),
    processes: linkedProcesses.map((p) => ({
      id: p.id,
      name: p.name,
    })),
  };

  return (
    <>
      <PageHeader
        title={policy.name}
        description={
          <span className="font-mono text-xs">
            {policy.id} · jurisdiction {policy.jurisdiction} · {kindLabel}
          </span>
        }
        breadcrumbs={buildBreadcrumbs(`/policies/${id}`, {
          tailLabel: policy.id,
        })}
        actions={<StatusDot status={String(policy.status)} />}
      />
      <PolicyStatusActions
        policyId={policy.id}
        currentStatus={policy.status as PolicyStatus}
      />
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-fg">
        <span>
          Version{" "}
          <span className="font-mono text-foreground">v{policy.version}</span>
        </span>
        <span>
          Rules{" "}
          <span className="font-mono text-foreground">
            {policy.rules.length}
          </span>
        </span>
        {policy.owner && (
          <span>
            Owner{" "}
            <span className="font-mono text-foreground">{policy.owner}</span>
          </span>
        )}
      </div>
      <div className="mb-6">
        <Panel
          title="Structure"
          actions={
            <Link href="/policies/graph">
              <Button variant="ghost" className="text-xs">
                Fleet graph
              </Button>
            </Link>
          }
        >
          <PolicyStructureGraph
            mode="detail"
            policy={policy}
            catalogLinks={catalogLinks}
            initialFocus={sp.focus || null}
          />
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel title="Definition">
          <PolicyYamlEditor policyId={policy.id} initialYaml={initialYaml} />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Applies to">
            <PolicyAppliesToPanel
              policyId={policy.id}
              linkedSystems={linkedSystems}
              linkedProcesses={linkedProcesses}
              allSystems={allSystems}
              allProcesses={allProcesses}
            />
          </Panel>
          {referenceSources.length > 0 && (
            <Panel title="Provenance">
              <AiSourceReferences
                mode="saved"
                sources={referenceSources.map((s) => ({
                  id: s.id,
                  title: s.title,
                  url: s.url,
                  snippet: s.snippet ?? "",
                  domain: s.domain ?? "",
                }))}
                defaultOpen={false}
              />
            </Panel>
          )}
          <Panel title="Version history">
            <VersionsPanel
              policyId={policy.id}
              versions={versions}
              currentVersion={policy.version}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
