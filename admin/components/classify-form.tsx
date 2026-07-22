"use client";

import { Loader2, Sparkles } from "lucide-react";
import {
  useActionState,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  classifyAction,
  type ClassifyActionState,
} from "@/lib/actions";
import {
  CLASSIFY_SAMPLE_SCENARIOS,
  type ClassifySampleRecord,
  type ClassifySampleScenario,
} from "@/lib/ai/classify-sample-schema";
import type { ClassificationPolicy } from "@/lib/types";
import {
  applyClassificationPolicyDefaults,
  applyClassifySampleRecordToForm,
  asScopePolicyView,
  buildMaskedMetadataSuggestion,
  checkPolicyScope,
  explainScopeReason,
  getResultViewState,
  getSelectedPolicy,
  trimClassificationPolicyForSample,
} from "@/lib/classify-playground";
import { AiPrivacyBadge } from "@/components/ai-privacy-badge";
import { AiPrivacyFootnote } from "@/components/ai-privacy-footnote";
import { AiTracingFootnote } from "@/components/ai-tracing-footnote";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { ErrorAlert, Panel, TableWrap } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

type Preset = {
  id: string;
  label: string;
  data_type: string;
  record_id: string;
  jurisdiction: string;
  source: string;
  metadata: string;
};

const PRESETS: Preset[] = [
  {
    id: "email-profile",
    label: "Email in profile",
    data_type: "customer_profile",
    record_id: "cust_scan_001",
    jurisdiction: "EU_GDPR",
    source: "crm_system",
    metadata: JSON.stringify(
      { email: "ada.lovelace@example.com", name: "Ada Lovelace" },
      null,
      2,
    ),
  },
  {
    id: "vn-cmnd",
    label: "VN CMND in HR record",
    data_type: "employee_record",
    record_id: "emp_scan_001",
    jurisdiction: "VN_PDPD",
    source: "database",
    metadata: JSON.stringify(
      { cmnd: "001234567890", full_name: "Nguyen Van A" },
      null,
      2,
    ),
  },
  {
    id: "mixed-spii",
    label: "Mixed SPII in support ticket",
    data_type: "support_ticket",
    record_id: "tkt_scan_001",
    jurisdiction: "EU_GDPR",
    source: "api",
    metadata: JSON.stringify(
      {
        email: "user@example.com",
        ssn: "123-45-6789",
        note: "Patient reports diagnosis of hypertension",
      },
      null,
      2,
    ),
  },
];

const SCENARIO_META: Record<
  ClassifySampleScenario,
  { label: string; hint: string }
> = {
  auto: {
    label: "Auto",
    hint: "Generate a representative record that should trigger detections",
  },
  pii: {
    label: "PII",
    hint: "Prefer email/phone style PII detections",
  },
  spii: {
    label: "SPII",
    hint: "Prefer national ID / health / critical detections",
  },
  mixed: {
    label: "Mixed",
    hint: "Include multiple entity types in one record",
  },
  clean: {
    label: "Clean",
    hint: "Stay in scope without detectable PII",
  },
};

function sensitivityClass(sensitivity: string | undefined): string {
  switch (sensitivity) {
    case "critical":
      return "border-destructive/40 text-destructive";
    case "high":
      return "border-accent/50 text-accent";
    case "medium":
      return "border-secondary/40 text-secondary";
    default:
      return "border-border text-muted-fg";
  }
}

export function ClassifyPlayground({
  policies,
  aiConfigured,
  tracingConfigured,
  privacyConfigured,
}: {
  policies: ClassificationPolicy[];
  aiConfigured: boolean;
  tracingConfigured: boolean;
  privacyConfigured: boolean;
}) {
  const formId = useId();
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [policyId, setPolicyId] = useState(policies[0]?.id ?? "");
  const [scenario, setScenario] = useState<ClassifySampleScenario>("auto");
  const [generating, setGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [dataType, setDataType] = useState(PRESETS[0].data_type);
  const [recordId, setRecordId] = useState(PRESETS[0].record_id);
  const [jurisdiction, setJurisdiction] = useState(PRESETS[0].jurisdiction);
  const [source, setSource] = useState(PRESETS[0].source);
  const [metadata, setMetadata] = useState(PRESETS[0].metadata);

  const [state, action, pending] = useActionState<
    ClassifyActionState | null,
    FormData
  >(classifyAction, null);

  const selectedPolicy = getSelectedPolicy(policies, policyId);
  const scopeView = selectedPolicy
    ? asScopePolicyView(selectedPolicy)
    : undefined;
  const scopeCheck = checkPolicyScope(selectedPolicy, {
    dataType,
    jurisdiction,
    source,
  });
  const selectedDataTypes = scopeView?.scope_data_types ?? [];
  const selectedSources = scopeView?.scope_sources ?? [];
  const resultView = getResultViewState(state?.result);
  const activeReason = scopeCheck.reasons[0] ?? "none";
  const diagnostics = state?.result?.diagnostics;
  const policyScopeSummary = diagnostics?.policy_scope_summary;
  const policyDataTypes = policyScopeSummary?.data_types ?? [];
  const policySources = policyScopeSummary?.sources ?? [];
  const maskedSuggestion = useMemo(() => {
    if (!state?.result || !state.submittedMetadata) return null;
    return buildMaskedMetadataSuggestion(
      state.submittedMetadata,
      state.result.detected_entities ?? [],
    );
  }, [state]);

  useEffect(() => {
    if (policies.length === 0) {
      setPolicyId("");
      return;
    }
    if (!policies.some((p) => p.id === policyId)) {
      setPolicyId(policies[0].id);
    }
  }, [policies, policyId]);

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setDataType(preset.data_type);
    setRecordId(preset.record_id);
    setJurisdiction(preset.jurisdiction);
    setSource(preset.source);
    setMetadata(preset.metadata);
    setAiStatus("");
    setAiError(null);
  }

  const handlePolicyChange = useCallback(
    (nextPolicyId: string) => {
      setPolicyId(nextPolicyId);
      const policy = policies.find((p) => p.id === nextPolicyId);
      if (!policy) return;
      const defaults = applyClassificationPolicyDefaults(policy);
      setJurisdiction(defaults.jurisdiction);
      if (defaults.dataType) setDataType(defaults.dataType);
      if (defaults.source) setSource(defaults.source);
    },
    [policies],
  );

  const generateSampleData = useCallback(async () => {
    if (!aiConfigured || generating || !selectedPolicy) return;

    setAiError(null);
    setGenerating(true);
    setAiStatus("Generating sample data…");

    try {
      const res = await fetch("/api/ai/classify-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          policy: trimClassificationPolicyForSample(selectedPolicy),
        }),
      });

      if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
          const body = (await res.json()) as { error?: string };
          if (body.error) message = body.error;
        } catch {
          /* ignore */
        }
        setAiError(message);
        setAiStatus("");
        return;
      }

      const body = (await res.json()) as { record: ClassifySampleRecord };
      const applied = applyClassifySampleRecordToForm(body.record);
      setPresetId("");
      setDataType(applied.dataType);
      setRecordId(applied.recordId);
      setSource(applied.source);
      setJurisdiction(applied.jurisdiction || selectedPolicy.jurisdiction);
      setMetadata(applied.metadata);
      setAiStatus("AI sample ready — review before scan");
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Sample generation failed",
      );
      setAiStatus("");
    } finally {
      setGenerating(false);
    }
  }, [aiConfigured, generating, scenario, selectedPolicy]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.2fr]">
      <Panel title="Scan input">
        <form action={action} className="flex flex-col gap-4" id={formId}>
          <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={
                  !aiConfigured ||
                  generating ||
                  !selectedPolicy ||
                  policies.length === 0
                }
                aria-busy={generating}
                onClick={() => void generateSampleData()}
              >
                {generating ? (
                  <Loader2
                    className="size-3.5 motion-safe:animate-spin"
                    aria-hidden
                  />
                ) : (
                  <Sparkles className="size-3.5" aria-hidden />
                )}
                Generate sample data
              </Button>
              <div
                role="group"
                aria-label="Sample scenario"
                className="flex flex-wrap gap-1.5"
              >
                {CLASSIFY_SAMPLE_SCENARIOS.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={generating || !aiConfigured}
                    aria-pressed={scenario === value}
                    title={SCENARIO_META[value].hint}
                    onClick={() => setScenario(value)}
                    className={cn(
                      scenario === value && "ring-2 ring-ring ring-offset-1",
                    )}
                  >
                    {SCENARIO_META[value].label}
                  </Button>
                ))}
              </div>
            </div>
            {!aiConfigured && (
              <p className="text-xs text-muted-fg" role="status">
                AI sample generation is off. Set{" "}
                <code className="font-mono text-xs">LITELLM_BASE_URL</code>,{" "}
                <code className="font-mono text-xs">LITELLM_API_KEY</code>, and{" "}
                <code className="font-mono text-xs">LITELLM_MODEL</code> in{" "}
                <code className="font-mono text-xs">.env.local</code>. Quick
                samples below still work offline.
              </p>
            )}
            {aiConfigured && tracingConfigured && <AiTracingFootnote />}
            {aiConfigured && (
              <AiPrivacyBadge configured={privacyConfigured} />
            )}
            {aiConfigured && privacyConfigured && <AiPrivacyFootnote />}
            <div aria-live="polite" className="min-h-[1.25rem] text-sm">
              {generating && (
                <span className="inline-flex items-center gap-2 text-muted-fg">
                  <Loader2
                    className="size-3.5 motion-safe:animate-spin"
                    aria-hidden
                  />
                  {aiStatus || "Working…"}
                </span>
              )}
              {!generating && aiStatus && (
                <span className="text-success">{aiStatus}</span>
              )}
            </div>
            {aiError && <ErrorAlert message={aiError} />}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground">
              Quick samples
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Quick samples">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-pressed={presetId === preset.id}
                  disabled={generating}
                  onClick={() => applyPreset(preset.id)}
                  className={cn(
                    presetId === preset.id && "ring-2 ring-ring ring-offset-1",
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Select
            label="Classification policy"
            name="policy_id"
            value={policyId}
            disabled={generating}
            onChange={(e) => handlePolicyChange(e.target.value)}
          >
            {policies.length === 0 && (
              <option value="">No active classification policies</option>
            )}
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </Select>

          {selectedPolicy && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-fg">
              <p className="font-medium text-foreground">Selected policy scope</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md border border-border px-2 py-0.5">
                  Jurisdiction: {selectedPolicy.jurisdiction}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5">
                  Data types:{" "}
                  {selectedDataTypes.length > 0
                    ? selectedDataTypes.join(", ")
                    : "Any"}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5">
                  Sources:{" "}
                  {selectedSources.length > 0
                    ? selectedSources.join(", ")
                    : "Any"}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5">
                  Entities: {selectedPolicy.entities.length}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Data type"
            name="data_type"
            value={dataType}
            disabled={generating}
            onChange={(e) => setDataType(e.target.value)}
          />
          {selectedPolicy && selectedDataTypes.length > 0 && (
            <div className="-mt-2 flex flex-wrap gap-2">
              {selectedDataTypes.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={generating}
                  onClick={() => setDataType(value)}
                  className={cn(dataType === value && "ring-2 ring-ring ring-offset-1")}
                >
                  {value}
                </Button>
              ))}
            </div>
          )}
          <Input
            label="Record ID"
            name="record_id"
            value={recordId}
            disabled={generating}
            onChange={(e) => setRecordId(e.target.value)}
          />
          <Input
            label="Jurisdiction"
            name="jurisdiction"
            value={jurisdiction}
            disabled={generating}
            onChange={(e) => setJurisdiction(e.target.value)}
          />
          <Input
            label="Source"
            name="source"
            value={source}
            disabled={generating}
            onChange={(e) => setSource(e.target.value)}
            placeholder={
              selectedSources.length
                ? selectedSources[0]
                : "Optional source"
            }
          />
          {selectedPolicy && selectedSources.length > 0 && (
            <div className="-mt-2 flex flex-wrap gap-2">
              {selectedSources.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={generating}
                  onClick={() => setSource(value)}
                  className={cn(source === value && "ring-2 ring-ring ring-offset-1")}
                >
                  {value}
                </Button>
              ))}
            </div>
          )}
          {selectedPolicy && !scopeCheck.inScope && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {explainScopeReason(activeReason)} Allowed data types:{" "}
              {selectedDataTypes.join(", ") || "any"}.
            </div>
          )}
          <Textarea
            label="Metadata (JSON)"
            name="metadata"
            rows={10}
            value={metadata}
            disabled={generating}
            onChange={(e) => setMetadata(e.target.value)}
            className="font-mono text-xs"
          />

          <Button
            type="submit"
            disabled={pending || generating || policies.length === 0}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden />
                Scanning…
              </>
            ) : (
              "Run scan"
            )}
          </Button>
        </form>
        {state?.error && (
          <div className="mt-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
      </Panel>

      <Panel title="Detection results">
        <div aria-live="polite" className="flex flex-col gap-4">
          {resultView.kind === "idle" && (
            <p className="text-sm text-muted-fg">
              Run a scan to see whether the selected policy applied, what entities were detected, and what handling is recommended.
            </p>
          )}
          {state?.result && resultView.kind !== "idle" && (
            <>
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <p className="text-sm font-medium text-foreground">{resultView.title}</p>
                <p className="mt-1 text-sm text-muted-fg">{resultView.description}</p>
                {"suggestion" in resultView && (
                  <p className="mt-2 text-sm text-foreground">{resultView.suggestion}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={state.result.result.action} />
                <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                  Policy applied: {diagnostics?.selected_policy_applied ? "yes" : "no"}
                </span>
                <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                  Applicable policies: {diagnostics?.applicable_policy_count ?? 0}
                </span>
                <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                  Detections: {state.result.detected_entities?.length ?? 0}
                </span>
                {state.result.result.handling && (
                  <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                    {state.result.result.handling}
                  </span>
                )}
                {diagnostics?.out_of_scope_reason &&
                  diagnostics.out_of_scope_reason !== "none" && (
                  <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-900">
                    Scope issue: {diagnostics.out_of_scope_reason}
                  </span>
                )}
                {state.result.result.max_classification && (
                  <span className="text-xs text-muted-fg">
                    Max class: {state.result.result.max_classification}
                  </span>
                )}
                {state.result.result.max_sensitivity && (
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-xs",
                      sensitivityClass(state.result.result.max_sensitivity),
                    )}
                  >
                    Sensitivity: {state.result.result.max_sensitivity}
                  </span>
                )}
              </div>

              {policyScopeSummary && (
                <div className="rounded-md border border-border bg-surface p-3 text-xs text-muted-fg">
                  <p>
                    Policy jurisdiction:{" "}
                    <span className="font-medium text-foreground">
                      {policyScopeSummary.jurisdiction}
                    </span>
                  </p>
                  <p className="mt-1">
                    Policy data types:{" "}
                    <span className="font-medium text-foreground">
                      {policyDataTypes.join(", ") || "Any"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Policy sources:{" "}
                    <span className="font-medium text-foreground">
                      {policySources.join(", ") || "Any"}
                    </span>
                  </p>
                </div>
              )}

              {maskedSuggestion && (
                <div className="rounded-md border border-primary/25 bg-primary/5 p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Suggested correction
                      </p>
                      <p className="mt-1 text-sm text-muted-fg">
                        Detected fields are masked below so you can review a
                        safer redacted version before reuse or sharing.
                      </p>
                    </div>
                    <span className="rounded-md border border-primary/30 bg-surface px-2 py-0.5 text-xs text-foreground">
                      {maskedSuggestion.maskedFields.length} field
                      {maskedSuggestion.maskedFields.length === 1 ? "" : "s"} masked
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {maskedSuggestion.maskedFields.map((field) => (
                      <span
                        key={field.field}
                        className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground"
                      >
                        <span className="font-mono">{field.field}</span>:{" "}
                        {field.maskedValue}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Textarea
                      label="Masked metadata preview"
                      value={JSON.stringify(maskedSuggestion.metadata, null, 2)}
                      rows={10}
                      readOnly
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {(state.result.detected_entities?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-fg">
                  {resultView.kind === "out_of_scope"
                    ? "No entities were scanned because the selected policy did not apply to this request."
                    : "No entities detected."}
                </p>
              ) : (
                <TableWrap>
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-fg">
                        <th className="px-3 py-2 font-medium">Entity</th>
                        <th className="px-3 py-2 font-medium">Field</th>
                        <th className="px-3 py-2 font-medium">Class</th>
                        <th className="px-3 py-2 font-medium">Sensitivity</th>
                        <th className="px-3 py-2 font-medium">Detector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.result.detected_entities?.map((ent, idx) => (
                        <tr key={`${ent.entity_id}-${ent.field}-${idx}`} className="border-b border-border/60">
                          <td className="px-3 py-2">{ent.label}</td>
                          <td className="px-3 py-2 font-mono text-xs">{ent.field}</td>
                          <td className="px-3 py-2">{ent.classification}</td>
                          <td className="px-3 py-2">
                            <span
                              className={cn(
                                "rounded border px-1.5 py-0.5 text-xs",
                                sensitivityClass(ent.sensitivity),
                              )}
                            >
                              {ent.sensitivity}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-fg">{ent.detector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              )}
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}
