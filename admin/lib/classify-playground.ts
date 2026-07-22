import type { ClassifySampleRecord } from "@/lib/ai/classify-sample-schema";
import type {
  ClassificationPolicy,
  ClassificationResponse,
  DetectedEntity,
  PolicyListItem,
} from "@/lib/types";

export type ScopeReason = "none" | "jurisdiction" | "data_type" | "source";

export type ScopeCheck = {
  inScope: boolean;
  reasons: ScopeReason[];
};

export type ScopePolicyView = {
  id: string;
  jurisdiction: string;
  scope_data_types?: string[];
  scope_sources?: string[];
  excluded_data_types?: string[];
  excluded_sources?: string[];
};

export type ResultViewState =
  | { kind: "idle" }
  | {
      kind: "out_of_scope";
      title: string;
      description: string;
      suggestion: string;
      reason: ScopeReason;
    }
  | {
      kind: "clean";
      title: string;
      description: string;
    }
  | {
      kind: "detected";
      title: string;
      description: string;
    };

export type MaskedFieldSuggestion = {
  field: string;
  label: string;
  classification: string;
  sensitivity: string;
  originalValue: string;
  maskedValue: string;
};

export type MaskedMetadataSuggestion = {
  metadata: Record<string, unknown>;
  maskedFields: MaskedFieldSuggestion[];
};

function cloneJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getValueAtPath(
  value: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, value);
}

function setValueAtPath(
  value: Record<string, unknown>,
  path: string,
  nextValue: unknown,
): boolean {
  const segments = path.split(".");
  let current: Record<string, unknown> = value;

  for (const segment of segments.slice(0, -1)) {
    const next = current[segment];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      return false;
    }
    current = next as Record<string, unknown>;
  }

  const leaf = segments[segments.length - 1];
  if (!(leaf in current)) return false;
  current[leaf] = nextValue;
  return true;
}

function maskStringValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return value;

  if (trimmed.includes("@")) {
    const [localPart, domain = ""] = trimmed.split("@");
    const visibleLocal = localPart.slice(0, 1);
    const maskedLocal = `${visibleLocal}${"*".repeat(
      Math.max(localPart.length - 1, 2),
    )}`;
    return domain ? `${maskedLocal}@${domain}` : maskedLocal;
  }

  const visiblePrefix = trimmed.slice(0, Math.min(2, trimmed.length));
  const visibleSuffix =
    trimmed.length > 4 ? trimmed.slice(-2) : "";
  const hiddenLength = Math.max(trimmed.length - visiblePrefix.length - visibleSuffix.length, 3);
  return `${visiblePrefix}${"*".repeat(hiddenLength)}${visibleSuffix}`;
}

function maskLeafValue(value: unknown): string {
  if (typeof value === "string") return maskStringValue(value);
  if (typeof value === "number" || typeof value === "bigint") {
    return maskStringValue(String(value));
  }
  if (typeof value === "boolean") return "[masked]";
  if (value == null) return "[masked]";
  return "[masked]";
}

function summarizeOriginalValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return JSON.stringify(value);
}

export function asScopePolicyView(
  policy: ClassificationPolicy | PolicyListItem,
): ScopePolicyView {
  if ("entity_count" in policy || "rule_count" in policy) {
    const listItem = policy as PolicyListItem;
    return {
      id: listItem.id,
      jurisdiction: listItem.jurisdiction,
      scope_data_types: listItem.scope_data_types ?? [],
      scope_sources: listItem.scope_sources ?? [],
      excluded_data_types: listItem.excluded_data_types ?? [],
      excluded_sources: listItem.excluded_sources ?? [],
    };
  }
  const full = policy as ClassificationPolicy;
  return {
    id: full.id,
    jurisdiction: full.jurisdiction,
    scope_data_types: full.scope?.data_types ?? [],
    scope_sources: full.scope?.sources ?? [],
    excluded_data_types: full.scope?.exclude?.data_types ?? [],
    excluded_sources: full.scope?.exclude?.sources ?? [],
  };
}

export function getSelectedPolicy<T extends { id: string }>(
  policies: T[],
  policyId: string,
): T | undefined {
  return policies.find((policy) => policy.id === policyId);
}

function isScopePolicyView(
  policy: ClassificationPolicy | PolicyListItem | ScopePolicyView,
): policy is ScopePolicyView {
  return (
    "scope_data_types" in policy &&
    !("entities" in policy) &&
    !("entity_count" in policy) &&
    !("rule_count" in policy)
  );
}

export function checkPolicyScope(
  policy: ClassificationPolicy | PolicyListItem | ScopePolicyView | undefined,
  input: { dataType: string; jurisdiction: string; source: string },
): ScopeCheck {
  if (!policy) return { inScope: true, reasons: ["none"] };
  const view = isScopePolicyView(policy)
    ? policy
    : asScopePolicyView(policy);
  const allowedDataTypes = view.scope_data_types ?? [];
  const allowedSources = view.scope_sources ?? [];
  const excludedDataTypes = view.excluded_data_types ?? [];
  const excludedSources = view.excluded_sources ?? [];
  const reasons: ScopeReason[] = [];
  if (
    input.jurisdiction.trim() &&
    view.jurisdiction &&
    input.jurisdiction.trim() !== view.jurisdiction
  ) {
    reasons.push("jurisdiction");
  }
  if (
    excludedDataTypes.includes(input.dataType) ||
    (allowedDataTypes.length > 0 &&
      !allowedDataTypes.includes(input.dataType))
  ) {
    reasons.push("data_type");
  }
  if (
    input.source &&
    (excludedSources.includes(input.source) ||
      (allowedSources.length > 0 &&
        !allowedSources.includes(input.source)))
  ) {
    reasons.push("source");
  }
  return {
    inScope: reasons.length === 0,
    reasons: reasons.length ? reasons : ["none"],
  };
}

export function applyClassificationPolicyDefaults(
  policy: ClassificationPolicy,
): {
  jurisdiction: string;
  dataType: string;
  source: string;
} {
  return {
    jurisdiction: policy.jurisdiction,
    dataType: policy.scope?.data_types?.[0] ?? "",
    source: policy.scope?.sources?.[0] ?? "",
  };
}

export function trimClassificationPolicyForSample(
  policy: ClassificationPolicy,
) {
  return {
    id: policy.id,
    jurisdiction: policy.jurisdiction,
    scope: {
      data_types: policy.scope?.data_types,
      sources: policy.scope?.sources,
    },
    text_fields: policy.text_fields,
    entities: policy.entities.map((entity) => ({
      id: entity.id,
      label: entity.label,
      classification: entity.classification,
      sensitivity: entity.sensitivity,
      detection: entity.detection
        ? {
            field_names: entity.detection.field_names,
            regex: entity.detection.regex,
            ner_types: entity.detection.ner_types,
          }
        : null,
    })),
  };
}

export function applyClassifySampleRecordToForm(
  record: ClassifySampleRecord,
): {
  dataType: string;
  recordId: string;
  source: string;
  jurisdiction: string;
  metadata: string;
} {
  return {
    dataType: record.data_type,
    recordId: record.record_id,
    source: record.source ?? "",
    jurisdiction: record.jurisdiction ?? "",
    metadata: JSON.stringify(record.metadata ?? {}, null, 2),
  };
}

export function buildMaskedMetadataSuggestion(
  metadata: Record<string, unknown>,
  detectedEntities: DetectedEntity[],
): MaskedMetadataSuggestion | null {
  if (detectedEntities.length === 0) return null;

  const maskedMetadata = cloneJsonValue(metadata);
  const maskedFields: MaskedFieldSuggestion[] = [];
  const seenFields = new Set<string>();

  for (const entity of detectedEntities) {
    if (!entity.field || seenFields.has(entity.field)) continue;
    const originalValue = getValueAtPath(maskedMetadata, entity.field);
    if (typeof originalValue === "undefined") continue;

    const maskedValue = maskLeafValue(originalValue);
    const updated = setValueAtPath(maskedMetadata, entity.field, maskedValue);
    if (!updated) continue;

    seenFields.add(entity.field);
    maskedFields.push({
      field: entity.field,
      label: entity.label,
      classification: entity.classification,
      sensitivity: entity.sensitivity,
      originalValue: summarizeOriginalValue(originalValue),
      maskedValue,
    });
  }

  if (maskedFields.length === 0) return null;

  return {
    metadata: maskedMetadata,
    maskedFields,
  };
}

export function explainScopeReason(reason: ScopeReason): string {
  switch (reason) {
    case "jurisdiction":
      return "The selected policy does not cover this jurisdiction.";
    case "data_type":
      return "The selected policy does not cover this data type.";
    case "source":
      return "The selected policy does not cover this source.";
    default:
      return "The selected policy can be applied to this input.";
  }
}

export function getResultViewState(
  response: ClassificationResponse | undefined,
): ResultViewState {
  if (!response) return { kind: "idle" };
  const diagnostics = response.diagnostics;
  const selectedPolicyApplied = diagnostics?.selected_policy_applied ?? false;
  const reason = diagnostics?.out_of_scope_reason ?? "none";

  if (
    !selectedPolicyApplied &&
    reason !== "none"
  ) {
    return {
      kind: "out_of_scope",
      title: "Selected policy not applied",
      description: explainScopeReason(reason),
      suggestion: "Adjust the scope fields to match the selected policy, then run the scan again.",
      reason,
    };
  }

  if ((response.detected_entities?.length ?? 0) === 0) {
    return {
      kind: "clean",
      title: "Scan completed",
      description: "The selected policy applied, but no matching entities were detected in this record.",
    };
  }

  return {
    kind: "detected",
    title: "Detections found",
    description: "Review the matched entities and recommended handling below.",
  };
}
