import type { PolicySuggestMode, PolicyKind } from "@/lib/ai/policy-suggest-prompt";
import type {
  ClassificationEntityCategory,
  ClassificationJurisdiction,
} from "@/lib/ai/classification-skill-context";
import type {
  RetentionIndustry,
  RetentionJurisdiction,
} from "@/lib/ai/retention-skill-context";
import type { WebSearchSource } from "@/lib/ai/tavily";

const JURISDICTION_LABELS: Record<RetentionJurisdiction, string> = {
  EU_GDPR: "EU GDPR",
  VN_PDPD: "Vietnam PDPD",
  SG_PDPA: "Singapore PDPA",
  GLOBAL: "global data protection",
};

const INDUSTRY_LABELS: Record<RetentionIndustry, string> = {
  saas: "SaaS",
  ecommerce: "e-commerce",
  finance: "financial services",
  healthcare: "healthcare HIPAA",
  hr: "HR employment records",
};

const ENTITY_LABELS: Record<ClassificationEntityCategory, string> = {
  email: "email PII detection",
  phone: "phone number personal data",
  national_id: "national ID sensitive personal data",
  health: "health data special category GDPR",
  financial: "financial account PCI sensitive data",
  biometric: "biometric data special category",
};

const RETENTION_MODE_QUERY_HINTS: Record<PolicySuggestMode, string> = {
  generate: "data retention policy requirements",
  polish: "data retention compliance best practices",
  enhance: "data retention legal requirements grace periods DSAR",
  expand: "data retention regulatory requirements",
};

const CLASSIFICATION_MODE_QUERY_HINTS: Record<PolicySuggestMode, string> = {
  generate: "PII sensitive personal data classification detection policy",
  polish: "data classification policy best practices",
  enhance: "PII SPII detection regulatory requirements handling",
  expand: "personal data categories GDPR PDPA detection rules",
};

export type PolicySearchQueryInput = {
  policyKind: PolicyKind;
  mode: PolicySuggestMode;
  description: string;
  jurisdiction?: RetentionJurisdiction | ClassificationJurisdiction;
  industry?: RetentionIndustry;
  entityCategory?: ClassificationEntityCategory;
};

export function buildPolicySearchQuery(input: PolicySearchQueryInput): string {
  const parts: string[] = [];
  const year = new Date().getFullYear();

  if (input.jurisdiction) {
    parts.push(JURISDICTION_LABELS[input.jurisdiction]);
  }
  if (input.policyKind === "retention" && input.industry) {
    parts.push(INDUSTRY_LABELS[input.industry]);
  }
  if (input.policyKind === "classification" && input.entityCategory) {
    parts.push(ENTITY_LABELS[input.entityCategory]);
  }

  const hints =
    input.policyKind === "classification"
      ? CLASSIFICATION_MODE_QUERY_HINTS
      : RETENTION_MODE_QUERY_HINTS;
  parts.push(hints[input.mode]);

  const descSnippet = input.description.trim().slice(0, 120);
  if (descSnippet) {
    parts.push(descSnippet);
  }

  parts.push(String(year));
  return parts.join(" ");
}

/** @deprecated Use buildPolicySearchQuery */
export function buildRetentionSearchQuery(
  input: Omit<PolicySearchQueryInput, "policyKind"> & { policyKind?: "retention" },
): string {
  return buildPolicySearchQuery({ ...input, policyKind: "retention" });
}

export function buildWebResearchPromptAppendix(
  sources: WebSearchSource[],
  policyKind: PolicyKind = "retention",
): string {
  if (sources.length === 0) return "";

  const lines = sources.map(
    (s) => `[${s.id}] ${s.title} — ${s.url}\n    ${s.snippet}`,
  );

  const grounding =
    policyKind === "classification"
      ? "Ground entity definitions and sensitivity tiers in these sources when they apply."
      : "Ground regulatory retention periods in these sources when they apply.";

  return `WEB_RESEARCH_SOURCES (authoritative — cite by [n] in rule descriptions only):
${lines.join("\n")}

Rules:
- ${grounding}
- Do NOT invent URLs or legal citations not listed above.
- Output remains YAML only — no markdown links in YAML.
- If sources conflict with static mastery, prefer sources for definitions; note uncertainty in entity description or rule description text.`;
}
