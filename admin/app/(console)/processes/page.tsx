import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { ProcessesManager } from "@/components/processes-manager";
import { PaginationBar } from "@/components/ui/pagination";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function ProcessesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listProcesses>> = [];
  try {
    fetched = await drpe.listProcesses(`limit=${limit}&offset=${offset}`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load processes";
  }
  const pagination = resolveOffsetPage(fetched, page);

  return (
    <>
      <PageHeader
        title="Processes"
        description="Business processes linked to policies for governance mapping."
        breadcrumbs={buildBreadcrumbs("/processes")}
      />
      {error && <ErrorAlert message={error} />}
      <ContentCard>
        <div className="p-4 md:p-5">
          <ProcessesManager processes={pagination.items} />
          <PaginationBar
            pathname="/processes"
            searchParams={sp}
            state={pagination}
          />
        </div>
      </ContentCard>
    </>
  );
}
