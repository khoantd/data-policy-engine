import { PolicyImportAssist } from "@/components/policy-import-assist";
import { PageHeader } from "@/components/ui/layout";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { isTavilyConfigured } from "@/lib/ai/tavily";

export default async function ImportPolicyPage() {
  const aiConfigured = isLiteLLMConfigured();
  const webSearchConfigured = isTavilyConfigured();
  const tracingConfigured = isLangSmithConfigured();
  const privacyConfigured = await isPrivacyMaskConfigured();

  return (
    <>
      <PageHeader
        title="Import policy"
        description="Describe retention or classification intent for AI-assisted drafts, or paste YAML. Validate before import — AI never auto-imports."
        breadcrumbs={buildBreadcrumbs("/policies/import")}
      />
      <PolicyImportAssist
        aiConfigured={aiConfigured}
        webSearchConfigured={webSearchConfigured}
        tracingConfigured={tracingConfigured}
        privacyConfigured={privacyConfigured}
      />
    </>
  );
}
