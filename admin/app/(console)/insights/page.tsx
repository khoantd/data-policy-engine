import { InsightsRelations } from "@/components/insights-relations";
import {
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { drpe } from "@/lib/drpe-client";

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    event_type?: string;
    policy_id?: string;
    requester?: string;
  }>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  qs.set("limit", "500");
  if (sp.event_type) qs.set("event_type", sp.event_type);
  if (sp.policy_id) qs.set("policy_id", sp.policy_id);
  if (sp.requester) qs.set("requester", sp.requester);

  let error: string | null = null;
  let logs: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  try {
    logs = await drpe.listAudit(qs.toString());
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load audit logs";
  }

  return (
    <>
      <PageHeader
        title="Insights"
        description="Explore how policies and requesters connect through audit hit logs."
        breadcrumbs={buildBreadcrumbs("/insights")}
      />
      {error && <ErrorAlert message={error} />}
      <InsightsRelations logs={logs} initial={sp} />
    </>
  );
}
