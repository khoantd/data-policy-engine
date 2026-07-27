import { drpe } from "@/lib/drpe-client";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { GuardrailsConsole } from "@/components/guardrails-console";
import {
  ContentCard,
  ErrorAlert,
  PageHeader,
} from "@/components/ui/layout";
import type {
  GuardrailPolicyResponse,
  GuardrailsStatusResponse,
} from "@/lib/types";

export default async function GuardrailsPage() {
  let error: string | null = null;
  let status: GuardrailsStatusResponse = {
    available: false,
    enabled: true,
    ogr_version: null,
  };
  let policies: GuardrailPolicyResponse[] = [];

  try {
    const [statusRes, policyRes] = await Promise.all([
      drpe.getGuardrailsStatus(),
      drpe.listGuardrailPolicies("limit=100"),
    ]);
    status = statusRes;
    policies = policyRes;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load guardrails";
  }

  return (
    <>
      <PageHeader
        title="Guardrails"
        description="OpenGuardrails policies for agent safety — evaluate GuardEvents and manage deployer-owned OGR policy JSON. Lifecycle agent policies live under Policies (Kind: Agent)."
        breadcrumbs={buildBreadcrumbs("/guardrails")}
      />
      {error && <ErrorAlert message={error} />}
      <ContentCard>
        <div className="p-4 md:p-5">
          <GuardrailsConsole status={status} policies={policies} />
        </div>
      </ContentCard>
    </>
  );
}
