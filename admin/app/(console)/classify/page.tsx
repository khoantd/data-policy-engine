import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { ClassifyPlayground } from "@/components/classify-form";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type { PolicyListItem } from "@/lib/types";

export default async function ClassifyPage() {
  let error: string | null = null;
  let policies: PolicyListItem[] = [];
  let privacyConfigured = false;

  try {
    const [listed, privacy] = await Promise.all([
      drpe.listPolicies("active", "classification"),
      isPrivacyMaskConfigured(),
    ]);
    policies = listed.filter((p) => p.policy_kind === "classification");
    privacyConfigured = privacy;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policies";
  }

  const aiConfigured = isLiteLLMConfigured();
  const tracingConfigured = isLangSmithConfigured();

  return (
    <>
      <PageHeader
        title="Scan"
        description="Playground for PII and sensitive data detection. Select a classification policy, generate AI sample data, and review detected entities."
        breadcrumbs={buildBreadcrumbs("/classify")}
      />
      {error && <ErrorAlert message={error} />}
      <ClassifyPlayground
        policies={policies}
        aiConfigured={aiConfigured}
        tracingConfigured={tracingConfigured}
        privacyConfigured={privacyConfigured}
      />
    </>
  );
}
