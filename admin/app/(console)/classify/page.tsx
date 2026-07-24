import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isPrivacyMaskConfigured } from "@/lib/ai/privalyse";
import {
  parseProcessSearchParam,
  parseSystemSearchParam,
} from "@/lib/system-request-context";
import { ClassifyPlayground } from "@/components/classify-form";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type {
  PolicyListItem,
  ProcessResponse,
  SystemResponse,
} from "@/lib/types";

export default async function ClassifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    system?: string | string[];
    process?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const initialSystemId = parseSystemSearchParam(params.system);
  const initialProcessId = parseProcessSearchParam(params.process);

  let error: string | null = null;
  let policies: PolicyListItem[] = [];
  let systems: SystemResponse[] = [];
  let processes: ProcessResponse[] = [];
  let privacyConfigured = false;

  try {
    const [listed, listedSystems, listedProcesses, privacy] =
      await Promise.all([
        drpe.listPolicies("active", "classification"),
        drpe
          .listSystems("status=active&limit=500")
          .catch(() => [] as SystemResponse[]),
        drpe
          .listProcesses("status=active&limit=500")
          .catch(() => [] as ProcessResponse[]),
        isPrivacyMaskConfigured(),
      ]);
    policies = listed.filter((p) => p.policy_kind === "classification");
    systems = listedSystems.filter((s) => s.status === "active");
    processes = listedProcesses.filter((p) => p.status === "active");
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
        description="Playground for PII and sensitive data detection. Optionally pick a catalog system (seeds source) and/or process (governance links), select a classification policy, generate AI sample data, and review detected entities."
        breadcrumbs={buildBreadcrumbs("/classify")}
      />
      {error && <ErrorAlert message={error} />}
      <ClassifyPlayground
        policies={policies}
        systems={systems}
        processes={processes}
        initialSystemId={initialSystemId}
        initialProcessId={initialProcessId}
        aiConfigured={aiConfigured}
        tracingConfigured={tracingConfigured}
        privacyConfigured={privacyConfigured}
      />
    </>
  );
}
