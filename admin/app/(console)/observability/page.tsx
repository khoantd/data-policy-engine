import { ObservabilityDashboard } from "@/components/observability-dashboard";
import { PageHeader } from "@/components/ui/layout";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import {
  getLangSmithConfig,
  getLangSmithProjectUrl,
  isLangSmithConfigured,
} from "@/lib/ai/langsmith";
import { getLiteLLMConfig, isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import { isTavilyConfigured } from "@/lib/ai/tavily";

export default async function ObservabilityPage() {
  const liteLLMConfigured = isLiteLLMConfigured();
  const tavilyConfigured = isTavilyConfigured();
  const langsmithConfigured = isLangSmithConfigured();
  const privacyConfigured = await isPrivacyMaskConfigured();
  const model = getLiteLLMConfig()?.model ?? null;
  const project = getLangSmithConfig()?.project ?? null;
  const projectUrl = langsmithConfigured ? getLangSmithProjectUrl() : null;

  const breadcrumbs = project
    ? [
        { label: "DRPE Admin", href: "/" },
        { label: "Observability", href: "/observability" },
        { label: project },
      ]
    : buildBreadcrumbs("/observability");

  return (
    <>
      <PageHeader
        title="Observability"
        description="AI integration health and LangSmith trace browser. Metadata only — no prompts or YAML in this view."
        breadcrumbs={breadcrumbs}
      />
      <ObservabilityDashboard
        liteLLMConfigured={liteLLMConfigured}
        tavilyConfigured={tavilyConfigured}
        langsmithConfigured={langsmithConfigured}
        privacyConfigured={privacyConfigured}
        model={model}
        project={project}
        projectUrl={projectUrl}
      />
    </>
  );
}
