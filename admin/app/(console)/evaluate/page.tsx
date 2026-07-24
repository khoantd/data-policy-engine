import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { EvaluatePlayground } from "@/components/evaluate-form";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type { PolicyListItem } from "@/lib/types";

export default async function EvaluatePage() {
  let error: string | null = null;
  let policies: PolicyListItem[] = [];
  let privacyConfigured = false;

  try {
    const [listed, privacy] = await Promise.all([
      drpe.listPolicies("active", "retention"),
      isPrivacyMaskConfigured(),
    ]);
    policies = listed;
    privacyConfigured = privacy;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policies";
  }

  const aiConfigured = isLiteLLMConfigured();
  const tracingConfigured = isLangSmithConfigured();

  return (
    <>
      <PageHeader
        title="Evaluate"
        description="Playground for single and batch policy evaluation. Select a target policy, generate AI sample data, and dry-run single requests by default."
        breadcrumbs={buildBreadcrumbs("/evaluate")}
      />
      {error && <ErrorAlert message={error} />}
      <EvaluatePlayground
        policies={policies}
        aiConfigured={aiConfigured}
        tracingConfigured={tracingConfigured}
        privacyConfigured={privacyConfigured}
      />
    </>
  );
}
