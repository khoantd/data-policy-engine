import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { SystemsManager } from "@/components/systems-manager";
import { PaginationBar } from "@/components/ui/pagination";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function SystemsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listSystems>> = [];
  try {
    fetched = await drpe.listSystems(`limit=${limit}&offset=${offset}`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load systems";
  }
  const pagination = resolveOffsetPage(fetched, page);

  return (
    <>
      <PageHeader
        title="Systems"
        description="IT systems and data sources linked to policies for governance mapping."
        breadcrumbs={buildBreadcrumbs("/systems")}
      />
      {error && <ErrorAlert message={error} />}
      <ContentCard>
        <div className="p-4 md:p-5">
          <SystemsManager systems={pagination.items} />
          <PaginationBar
            pathname="/systems"
            searchParams={sp}
            state={pagination}
          />
        </div>
      </ContentCard>
    </>
  );
}
