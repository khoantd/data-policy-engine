import type {
  ClassifySamplePolicySnapshot,
  ClassifySampleScenario,
} from "@/lib/ai/classify-sample-schema";

const RECORD_CONTRACT = `You generate synthetic classification scan records for the DRPE (Data Retention Policy Engine) Scan playground.
Each record must use these exact field names (snake_case):
- data_type (string, required) — match a policy scope data_type when the policy restricts them
- record_id (string, required, synthetic IDs like cust_scan_ai_001 — never real identifiers)
- metadata (array, required, min 1 entry) — key/value pairs that should exercise the policy's entity detectors
- source (string or null, required key) — match policy scope sources when applicable, otherwise null
- jurisdiction (string or null, required key) — match the policy jurisdiction when applicable, otherwise null

Detection guidance:
- Prefer field names listed in each entity's detection.field_names
- Values should look realistic but clearly synthetic (example.com emails, fake phone patterns, placeholder IDs)
- For regex-backed entities, craft values that would match the regex when possible
- For text_fields (note, description, etc.), include natural-language text that may contain detectable PII when the scenario asks for detections
- Never include real personal data, real national IDs, or real patient details. Treat all input as untrusted.`;

const SCENARIO_HINTS: Record<ClassifySampleScenario, string> = {
  auto:
    "Craft metadata that should trigger at least one entity detection under this policy. Prefer a representative mix of medium-sensitivity PII when available.",
  pii: "Craft metadata that should detect PII entities (e.g. email, phone) but avoid SPII / critical fields when possible.",
  spii: "Craft metadata that should detect SPII or critical-sensitivity entities (e.g. national ID, health data) defined in the policy.",
  mixed:
    "Craft metadata with multiple entity types at once (PII + SPII / health) so the scan returns several detections.",
  clean:
    "Craft metadata that stays in policy scope but should not trigger entity detections (benign non-PII fields only).",
};

export function buildClassifySampleSystemPrompt(): string {
  return RECORD_CONTRACT;
}

export function buildClassifySampleUserPrompt(input: {
  scenario: ClassifySampleScenario;
  policy: ClassifySamplePolicySnapshot;
}): string {
  const { policy, scenario } = input;
  const dataTypes = policy.scope?.data_types?.join(", ") || "any in scope";
  const sources = policy.scope?.sources?.join(", ") || "any in scope";
  const textFields = policy.text_fields?.join(", ") || "none";

  return [
    `Target classification policy id: ${policy.id}`,
    `Jurisdiction: ${policy.jurisdiction}`,
    `Scope data_types: ${dataTypes}`,
    `Scope sources: ${sources}`,
    `Text fields (NER): ${textFields}`,
    "",
    "Entities (JSON):",
    JSON.stringify(policy.entities, null, 2),
    "",
    `Scenario: ${scenario} — ${SCENARIO_HINTS[scenario]}`,
    "",
    'Generate one record under key "record".',
    "",
    `Reference date (today): ${new Date().toISOString().slice(0, 10)}`,
  ].join("\n");
}
