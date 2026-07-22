import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { ClassifyPlayground } from "@/components/classify-form";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type { ClassificationPolicy } from "@/lib/types";

export default async function ClassifyPage() {
  let error: string | null = null;
  let policies: ClassificationPolicy[] = [];
  try {
    const listed = await drpe.listPolicies("active", "classification");
    policies = (
      await Promise.all(listed.map((p) => drpe.getPolicy(p.id)))
    ).filter(
      (policy): policy is ClassificationPolicy =>
        policy.policy_kind === "classification" &&
        Array.isArray((policy as ClassificationPolicy).entities),
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policies";
  }

  const aiConfigured = isLiteLLMConfigured();
  const tracingConfigured = isLangSmithConfigured();
  const privacyConfigured = await isPrivacyMaskConfigured();

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
