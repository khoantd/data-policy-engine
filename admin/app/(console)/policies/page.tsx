import Link from "next/link";
import { drpe } from "@/lib/drpe-client";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { paginateItems, parsePage } from "@/lib/pagination";
import { StatusDot } from "@/components/status-dot";
import { Button } from "@/components/ui/button";
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
import { PoliciesFilter } from "@/components/policies-filter";

function kindBadgeClass(kind: string): string {
  return kind === "classification"
    ? "border-accent/50 text-accent"
    : "border-secondary/40 text-secondary";
}

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    kind?: string;
    page?: string;
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
  const pagination = paginateItems(filtered, parsePage(sp.page));

  return (
    <>
      <PageHeader
        title="Policies"
        description="Manage retention and classification policy definitions, versions, and rollbacks."
        breadcrumbs={buildBreadcrumbs("/policies")}
        actions={
          <Link href="/policies/import">
            <Button>Import YAML</Button>
          </Link>
        }
      />
      {error && <ErrorAlert message={error} />}
      <PoliciesFilter
        initialQ={sp.q || ""}
        initialStatus={sp.status || ""}
        initialKind={sp.kind || ""}
      />
      {pagination.items.length === 0 ? (
        <EmptyState message="No policies match this filter." />
      ) : (
        <>
          <TableWrap stickyHeader>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`${tableCellClass} font-medium`}>ID</th>
                  <th className={`${tableCellClass} font-medium`}>Name</th>
                  <th className={`${tableCellClass} font-medium`}>Kind</th>
                  <th className={`${tableCellClass} font-medium`}>Status</th>
                  <th className={`${tableCellClass} font-medium`}>Jurisdiction</th>
                  <th className={`${tableCellClass} font-medium`}>Version</th>
                  <th className={`${tableCellClass} font-medium`}>Rules</th>
                </tr>
              </thead>
              <tbody>
                {pagination.items.map((p) => (
                  <tr key={p.id} className={tableRowClass}>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      <Link
                        href={`/policies/${encodeURIComponent(p.id)}`}
                        className="text-secondary hover:underline cursor-pointer"
                      >
                        {p.id}
                      </Link>
                    </td>
                    <td className={tableCellClass}>{p.name}</td>
                    <td className={tableCellClass}>
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${kindBadgeClass(p.policy_kind)}`}
                      >
                        {p.policy_kind}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      <StatusDot status={String(p.status)} />
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {p.jurisdiction}
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      v{p.version}
                    </td>
                    <td className={`${tableCellClass} font-mono text-xs`}>
                      {p.rule_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          <PaginationBar
            pathname="/policies"
            searchParams={sp}
            state={pagination}
          />
        </>
      )}
      <p className="mt-3 text-xs text-muted-fg">
        {formatDate(new Date().toISOString())}
      </p>
    </>
  );
}
