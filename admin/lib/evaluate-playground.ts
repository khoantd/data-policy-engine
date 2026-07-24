import type { Policy, PolicyListItem } from "@/lib/types";
import type { EvaluateSampleRecord } from "@/lib/ai/evaluate-sample-schema";

function isPolicyListItem(
  policy: Policy | PolicyListItem,
): policy is PolicyListItem {
  return !("rules" in policy);
}

export function applyPolicyDefaults(policy: Policy | PolicyListItem): {
  jurisdiction: string;
  dataType: string;
  source: string;
} {
  if (isPolicyListItem(policy)) {
    return {
      jurisdiction: policy.jurisdiction,
      dataType: policy.scope_data_types?.[0] ?? "",
      source: policy.scope_sources?.[0] ?? "",
    };
  }
  return {
    jurisdiction: policy.jurisdiction,
    dataType: policy.scope?.data_types?.[0] ?? "",
    source: policy.scope?.sources?.[0] ?? "",
  };
}

export function trimPolicyForSample(policy: Policy) {
  return {
    id: policy.id,
    jurisdiction: policy.jurisdiction,
    scope: {
      data_types: policy.scope?.data_types,
      sources: policy.scope?.sources,
    },
    rules: policy.rules.map((rule) => ({
      id: rule.id,
      description: rule.description,
      priority: rule.priority,
      action: rule.action,
      condition: rule.condition,
    })),
  };
}

export function applySampleRecordToForm(record: EvaluateSampleRecord): {
  dataType: string;
  recordId: string;
  source: string;
  jurisdiction: string;
  metadata: string;
  context: string;
} {
  return {
    dataType: record.data_type,
    recordId: record.record_id,
    source: record.source ?? "",
    jurisdiction: record.jurisdiction ?? "",
    metadata: JSON.stringify(record.metadata ?? {}, null, 2),
    context: record.context
      ? JSON.stringify(record.context, null, 2)
      : "",
  };
}

export function formatBatchRecords(records: EvaluateSampleRecord[]): string {
  return JSON.stringify(
    records.map((r) => ({
      data_type: r.data_type,
      record_id: r.record_id,
      metadata: r.metadata ?? {},
      source: r.source ?? undefined,
      jurisdiction: r.jurisdiction ?? undefined,
      context: r.context ?? undefined,
    })),
    null,
    2,
  );
}

export type TargetMatchStatus = "matched" | "different" | "none";

export function getTargetMatchStatus(
  matchedPolicy: string | null | undefined,
  targetPolicyId: string | null,
): TargetMatchStatus | null {
  if (!targetPolicyId) return null;
  if (!matchedPolicy) return "none";
  if (matchedPolicy === targetPolicyId) return "matched";
  return "different";
}
