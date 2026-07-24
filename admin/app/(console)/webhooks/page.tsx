import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "@/lib/pagination";
import { WebhooksManager } from "@/components/webhooks-manager";
import { PaginationBar } from "@/components/ui/pagination";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function WebhooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { limit, offset } = toListQuery(page);

  let error: string | null = null;
  let fetched: Awaited<ReturnType<typeof drpe.listWebhooks>> = [];
  try {
    fetched = await drpe.listWebhooks(`limit=${limit}&offset=${offset}`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load webhooks";
  }
  const pagination = resolveOffsetPage(fetched, page);

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Register endpoints for enforcement events. Secrets are shown once on create."
        breadcrumbs={buildBreadcrumbs("/webhooks")}
      />
      {error && <ErrorAlert message={error} />}
      <ContentCard>
        <div className="p-4 md:p-5">
          <WebhooksManager webhooks={pagination.items} />
          <PaginationBar
            pathname="/webhooks"
            searchParams={sp}
            state={pagination}
          />
        </div>
      </ContentCard>
    </>
  );
}
