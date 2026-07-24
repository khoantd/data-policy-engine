import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
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

  return (
    <>
      <PageHeader
        title="Policy structure"
        description="Network view of policies linked to jurisdictions, scope attributes, and shared data types."
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
          initialFocus={sp.focus || null}
        />
      </Panel>
    </>
  );
}
