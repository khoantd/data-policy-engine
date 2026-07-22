import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { WebhooksManager } from "@/components/webhooks-manager";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";

export default async function WebhooksPage() {
  let error: string | null = null;
  let webhooks: Awaited<ReturnType<typeof drpe.listWebhooks>> = [];
  try {
    webhooks = await drpe.listWebhooks();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load webhooks";
  }

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
          <WebhooksManager webhooks={webhooks} />
        </div>
      </ContentCard>
    </>
  );
}
