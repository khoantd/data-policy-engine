import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { EvaluatePlayground } from "@/components/evaluate-form";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type { Policy } from "@/lib/types";

export default async function EvaluatePage() {
  let error: string | null = null;
  let policies: Policy[] = [];
  try {
    const listed = await drpe.listPolicies("active", "retention");
    policies = (await Promise.all(
      listed.map((p) => drpe.getPolicy(p.id)),
    )) as Policy[];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policies";
  }

  const active = policies.filter((p) => p.status === "active");
  const aiConfigured = isLiteLLMConfigured();
  const tracingConfigured = isLangSmithConfigured();
  const privacyConfigured = await isPrivacyMaskConfigured();

  return (
    <>
      <PageHeader
        title="Evaluate"
        description="Playground for single and batch policy evaluation. Select a target policy, generate AI sample data, and dry-run single requests by default."
        breadcrumbs={buildBreadcrumbs("/evaluate")}
      />
      {error && <ErrorAlert message={error} />}
      <EvaluatePlayground
        policies={active}
        aiConfigured={aiConfigured}
        tracingConfigured={tracingConfigured}
        privacyConfigured={privacyConfigured}
      />
    </>
  );
}
