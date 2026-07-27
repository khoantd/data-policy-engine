import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { parsePolicySearchParam } from "@/lib/guardrails-playground";
import { GuardrailsConsole } from "@/components/guardrails-console";
import { ErrorAlert, PageHeader } from "@/components/ui/layout";
import type {
  GuardrailPolicyResponse,
  GuardrailsStatusResponse,
  PolicyListItem,
} from "@/lib/types";

export default async function GuardrailsPage({
  searchParams,
}: {
  searchParams: Promise<{
    policy?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const initialPolicyId = parsePolicySearchParam(params.policy);

  let error: string | null = null;
  let status: GuardrailsStatusResponse = {
    available: false,
    enabled: true,
    ogr_version: null,
  };
  let agentPolicies: PolicyListItem[] = [];
  let scratchPolicies: GuardrailPolicyResponse[] = [];

  try {
    const [statusRes, agents, scratch] = await Promise.all([
      drpe.getGuardrailsStatus(),
      drpe.listPolicies("active", "agent").catch(() => [] as PolicyListItem[]),
      drpe
        .listGuardrailPolicies("limit=100")
        .catch(() => [] as GuardrailPolicyResponse[]),
    ]);
    status = statusRes;
    agentPolicies = agents.filter((p) => p.policy_kind === "agent");
    scratchPolicies = scratch;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load guardrails";
  }

  return (
    <>
      <PageHeader
        title="Guardrails"
        description="Playground for agent safety policies — pick an active agent policy (or scratch OGR doc), load a GuardEvent sample, and scan for allow / block / require_approval verdicts. Lifecycle policies are authored under Policies → Kind: Agent."
        breadcrumbs={buildBreadcrumbs("/guardrails")}
      />
      {error && <ErrorAlert message={error} />}
      <GuardrailsConsole
        status={status}
        agentPolicies={agentPolicies}
        scratchPolicies={scratchPolicies}
        initialPolicyId={initialPolicyId}
      />
    </>
  );
}
