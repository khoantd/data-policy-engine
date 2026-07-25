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

/** API caps catalog-links at 200 policy_ids; stay under that. */
const CATALOG_LINKS_FETCH_CAP = 200;

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

  if (!error && filtered.length > 0) {
    try {
      const ids = filtered
        .slice(0, CATALOG_LINKS_FETCH_CAP)
        .map((p) => p.id);
      fleetCatalogLinks = await drpe.listCatalogLinks(ids);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Failed to load catalog links";
    }
  }

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
