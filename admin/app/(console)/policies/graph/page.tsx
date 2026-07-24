import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import type { CatalogLinksByPolicy } from "@/lib/policy-structure-graph";
import { PoliciesFilter } from "@/components/policies-filter";
import { PolicyStructureGraph } from "@/components/policy-structure-graph";
import { Button } from "@/components/ui/button";
import {
  ErrorAlert,
  PageHeader,
  Panel,
} from "@/components/ui/layout";

export default async function PolicyStructureGraphPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    kind?: string;
    focus?: string;
  }>;
}) {
  const sp = await searchParams;
  let error: string | null = null;
  let policies: Awaited<ReturnType<typeof drpe.listPolicies>> = [];
  let fleetCatalogLinks: CatalogLinksByPolicy = {};

  try {
    policies = await drpe.listPolicies(
      sp.status || undefined,
      sp.kind || undefined,
    );
    const linkEntries = await Promise.all(
      policies.slice(0, 50).map(async (p) => {
        const [systems, processes] = await Promise.all([
          drpe.listPolicySystems(p.id).catch(() => []),
          drpe.listPolicyProcesses(p.id).catch(() => []),
        ]);
        return [
          p.id,
          {
            systems: systems.map((s) => ({
              id: s.id,
              name: s.name,
              source_key: s.source_key,
            })),
            processes: processes.map((pr) => ({
              id: pr.id,
              name: pr.name,
            })),
          },
        ] as const;
      }),
    );
    fleetCatalogLinks = Object.fromEntries(linkEntries);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policies";
  }

  const q = (sp.q || "").toLowerCase();
  const filtered = q
    ? policies.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.jurisdiction.toLowerCase().includes(q),
      )
    : policies;

  return (
    <>
      <PageHeader
        title="Policy structure"
        description="Network view of policies linked to jurisdictions, scope attributes, systems, and processes."
        breadcrumbs={buildBreadcrumbs("/policies/graph")}
        actions={
          <Link href="/policies">
            <Button variant="secondary">All policies</Button>
          </Link>
        }
      />
      {error && <ErrorAlert message={error} />}
      <PoliciesFilter
        basePath="/policies/graph"
        initialQ={sp.q || ""}
        initialStatus={sp.status || ""}
        initialKind={sp.kind || ""}
      />
      <Panel title="Structure graph">
        <PolicyStructureGraph
          mode="fleet"
          policies={filtered}
          fleetCatalogLinks={fleetCatalogLinks}
          initialFocus={sp.focus || null}
        />
      </Panel>
    </>
  );
}
