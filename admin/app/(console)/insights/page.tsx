import { Suspense } from "react";
import { InsightsRelations } from "@/components/insights-relations";
import {
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";
import { ContentSkeleton } from "@/components/ui/page-skeleton";
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

  return (
    <>
      <PageHeader
        title="Insights"
        description="Explore how policies and requesters connect through audit hit logs."
        breadcrumbs={buildBreadcrumbs("/insights")}
      />
      <Suspense fallback={<ContentSkeleton kpiCount={0} rows={8} />}>
        <InsightsContent initial={sp} />
      </Suspense>
    </>
  );
}

async function InsightsContent({
  initial,
}: {
  initial: {
    mode?: string;
    event_type?: string;
    policy_id?: string;
    requester?: string;
  };
}) {
  const qs = new URLSearchParams();
  qs.set("limit", "500");
  if (initial.event_type) qs.set("event_type", initial.event_type);
  if (initial.policy_id) qs.set("policy_id", initial.policy_id);
  if (initial.requester) qs.set("requester", initial.requester);

  let error: string | null = null;
  let logs: Awaited<ReturnType<typeof drpe.listAudit>> = [];
  try {
    logs = await drpe.listAudit(qs.toString());
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load audit logs";
  }

  return (
    <>
      {error && <ErrorAlert message={error} />}
      <InsightsRelations logs={logs} initial={initial} />
    </>
  );
}
