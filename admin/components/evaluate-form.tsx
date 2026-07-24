"use client";

import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useId, useState } from "react";
import {
  evaluateAction,
  type EvaluateActionState,
} from "@/lib/actions";
import {
  EVALUATE_SAMPLE_SCENARIOS,
  type EvaluateSampleRecord,
  type EvaluateSampleScenario,
} from "@/lib/ai/evaluate-sample-schema";
import {
  applyPolicyDefaults,
  applySampleRecordToForm,
  formatBatchRecords,
  getTargetMatchStatus,
  trimPolicyForSample,
  type TargetMatchStatus,
} from "@/lib/evaluate-playground";
import type { EvaluationResponse, Policy, PolicyListItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useLazyPolicy } from "@/lib/use-lazy-policy";
import { AiPrivacyBadge } from "@/components/ai-privacy-badge";
import { AiPrivacyFootnote } from "@/components/ai-privacy-footnote";
import { StatusBadge } from "@/components/status-badge";
import { AiTracingFootnote } from "@/components/ai-tracing-footnote";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import {
  EmptyState,
  ErrorAlert,
  Panel,
  TableWrap,
} from "@/components/ui/layout";
import { cn } from "@/lib/utils";

type Preset = {
  id: string;
  label: string;
  data_type: string;
  record_id: string;
  source: string;
  jurisdiction: string;
  metadata: string;
  context: string;
};

const PRESETS: Preset[] = [
  {
    id: "inactive-delete",
    label: "Inactive → delete",
    data_type: "customer_profile",
    record_id: "cust_12345",
    source: "crm_system",
    jurisdiction: "EU_GDPR",
    metadata: JSON.stringify(
      {
        status: "inactive",
        created_at: "2021-03-15T10:00:00Z",
        last_activity_at: "2023-06-01T00:00:00Z",
        legal_hold: false,
        tags: ["newsletter"],
      },
      null,
      2,
    ),
    context: JSON.stringify(
      { requester: "crm_cleanup_job", reason: "scheduled_review" },
      null,
      2,
    ),
  },
  {
    id: "active-retain",
    label: "Active → retain",
    data_type: "customer_profile",
    record_id: "cust_active",
    source: "crm_system",
    jurisdiction: "EU_GDPR",
    metadata: JSON.stringify(
      {
        status: "active",
        created_at: "2024-01-01T00:00:00Z",
        last_activity_at: "2026-01-01T00:00:00Z",
      },
      null,
      2,
    ),
    context: "",
  },
];

const BATCH_PRESET = JSON.stringify(
  [
    {
      data_type: "customer_profile",
      source: "crm_system",
      record_id: "a",
      metadata: {
        status: "inactive",
        last_activity_at: "2023-01-01T00:00:00Z",
      },
      jurisdiction: "EU_GDPR",
    },
    {
      data_type: "customer_profile",
      source: "crm_system",
      record_id: "b",
      metadata: {
        status: "active",
        created_at: "2024-01-01T00:00:00Z",
      },
      jurisdiction: "EU_GDPR",
    },
  ],
  null,
  2,
);

const SCENARIO_META: Record<
  EvaluateSampleScenario,
  { label: string; hint: string }
> = {
  auto: { label: "Auto", hint: "Pick a matching rule from the policy" },
  delete: { label: "Delete", hint: "Metadata that triggers delete" },
  retain: { label: "Retain", hint: "Metadata that triggers retain" },
  archive: { label: "Archive", hint: "Metadata that triggers archive" },
  legal_hold: { label: "Legal hold", hint: "Legal hold or litigation tags" },
};

function TargetMatchBadge({ status }: { status: TargetMatchStatus }) {
  const styles: Record<TargetMatchStatus, string> = {
    matched:
      "border-success/30 bg-success/10 text-success",
    different:
      "border-warning/30 bg-accent/10 text-warning",
    none: "border-border bg-muted/60 text-muted-fg",
  };
  const labels: Record<TargetMatchStatus, string> = {
    matched: "Matched target policy",
    different: "Different policy matched",
    none: "Target policy not matched",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
        styles[status],
      )}
      role="status"
    >
      {labels[status]}
    </span>
  );
}

function ResultDetail({
  response,
  targetPolicyId,
}: {
  response: EvaluationResponse;
  targetPolicyId?: string | null;
}) {
  const r = response.result;
  const matchStatus = getTargetMatchStatus(
    r.matched_policy,
    targetPolicyId ?? null,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {matchStatus && <TargetMatchBadge status={matchStatus} />}
        <StatusBadge status={r.action} />
        <StatusBadge status={r.confidence} />
        {r.requires_approval && (
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border bg-accent/10 text-warning border-accent/30">
            Approval required
          </span>
        )}
      </div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-muted-fg">Record</dt>
          <dd className="font-mono text-xs">{response.record_id}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Evaluation ID</dt>
          <dd className="font-mono text-xs break-all">
            {response.evaluation_id}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Matched policy</dt>
          <dd className="font-mono text-xs">
            {r.matched_policy ?? "—"}
            {r.policy_version != null ? ` @v${r.policy_version}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Matched rule</dt>
          <dd className="font-mono text-xs">{r.matched_rule ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Jurisdiction</dt>
          <dd className="font-mono text-xs">
            {response.jurisdiction_applied ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Evaluated at</dt>
          <dd className="font-mono text-xs whitespace-nowrap">
            {formatDate(response.evaluated_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Grace ends</dt>
          <dd className="font-mono text-xs">
            {r.grace_period_ends ? formatDate(r.grace_period_ends) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Notify at</dt>
          <dd className="font-mono text-xs">
            {r.notify_at ? formatDate(r.notify_at) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Retain until</dt>
          <dd className="font-mono text-xs">
            {r.retain_until ? formatDate(r.retain_until) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-fg">Archive target</dt>
          <dd className="font-mono text-xs">{r.archive_target ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase text-muted-fg">Audit ref</dt>
          <dd className="font-mono text-xs break-all">
            {response.audit_ref ?? "null (dry-run or none)"}
          </dd>
        </div>
      </dl>

      {(response.conflicting_policies?.length ?? 0) > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase text-muted-fg">
            Conflicts
          </h3>
          <TableWrap>
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
                <tr>
                  <th className="px-3 py-2 font-medium">Policy</th>
                  <th className="px-3 py-2 font-medium">Rule</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {response.conflicting_policies!.map((c, i) => (
                  <tr
                    key={`${c.policy_id}-${c.rule_id}-${i}`}
                    className="border-b border-border/70"
                  >
                    <td className="px-3 py-2 font-mono text-xs">
                      {c.policy_id}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{c.rule_id}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={c.action} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {c.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer text-sm text-secondary hover:underline transition-colors duration-150 list-none [&::-webkit-details-marker]:hidden">
          <span className="underline-offset-2 group-open:no-underline">
            Raw JSON
          </span>
        </summary>
        <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">
          {JSON.stringify(response, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export function EvaluatePlayground({
  policies,
  aiConfigured,
  tracingConfigured,
  privacyConfigured,
}: {
  policies: PolicyListItem[];
  aiConfigured: boolean;
  tracingConfigured: boolean;
  privacyConfigured: boolean;
}) {
  const formId = useId();
  const [state, action, pending] = useActionState(
    evaluateAction,
    null as EvaluateActionState | null,
  );
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [dryRun, setDryRun] = useState(true);
  const [targetPolicyId, setTargetPolicyId] = useState(
    () => policies[0]?.id ?? "",
  );
  const [scenario, setScenario] = useState<EvaluateSampleScenario>("auto");
  const [generating, setGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [dataType, setDataType] = useState(PRESETS[0].data_type);
  const [recordId, setRecordId] = useState(PRESETS[0].record_id);
  const [source, setSource] = useState(PRESETS[0].source);
  const [jurisdiction, setJurisdiction] = useState(PRESETS[0].jurisdiction);
  const [metadata, setMetadata] = useState(PRESETS[0].metadata);
  const [context, setContext] = useState(PRESETS[0].context);
  const [batchRecords, setBatchRecords] = useState(BATCH_PRESET);
  const [applied, setApplied] = useState(false);

  const selectedListItem = policies.find((p) => p.id === targetPolicyId);
  const {
    policy: selectedFullPolicy,
    loading: fullPolicyLoading,
    error: fullPolicyError,
  } = useLazyPolicy<Policy>(targetPolicyId || null);

  useEffect(() => {
    if (state?.result || state?.results) setApplied(true);
    if (state?.error) setApplied(false);
  }, [state]);

  useEffect(() => {
    if (policies.length === 0) {
      setTargetPolicyId("");
      return;
    }
    if (!policies.some((p) => p.id === targetPolicyId)) {
      setTargetPolicyId(policies[0].id);
    }
  }, [policies, targetPolicyId]);

  const handlePolicyChange = useCallback(
    (policyId: string) => {
      setTargetPolicyId(policyId);
      const policy = policies.find((p) => p.id === policyId);
      if (!policy) return;
      const defaults = applyPolicyDefaults(policy);
      setJurisdiction(defaults.jurisdiction);
      if (defaults.dataType) setDataType(defaults.dataType);
      if (defaults.source) setSource(defaults.source);
    },
    [policies],
  );

  const generateSampleData = useCallback(async () => {
    if (!aiConfigured || generating || !selectedFullPolicy) return;

    setAiError(null);
    setGenerating(true);
    setAiStatus("Generating sample data…");

    try {
      const res = await fetch("/api/ai/evaluate-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          scenario: mode === "single" ? scenario : "auto",
          policy: trimPolicyForSample(selectedFullPolicy),
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

      const body = (await res.json()) as
        | { record: EvaluateSampleRecord }
        | { records: EvaluateSampleRecord[] };

      if (mode === "batch" && "records" in body) {
        setBatchRecords(formatBatchRecords(body.records));
        setAiStatus(`Generated ${body.records.length} sample records`);
      } else if ("record" in body) {
        const applied = applySampleRecordToForm(body.record);
        setDataType(applied.dataType);
        setRecordId(applied.recordId);
        setSource(applied.source);
        setJurisdiction(applied.jurisdiction || selectedFullPolicy.jurisdiction);
        setMetadata(applied.metadata);
        setContext(applied.context);
        setAiStatus("Sample record ready — review before evaluate");
      }
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Sample generation failed",
      );
      setAiStatus("");
    } finally {
      setGenerating(false);
    }
  }, [aiConfigured, generating, mode, scenario, selectedFullPolicy]);

  function applyPreset(preset: Preset) {
    setMode("single");
    setDataType(preset.data_type);
    setRecordId(preset.record_id);
    setSource(preset.source);
    setJurisdiction(preset.jurisdiction);
    setMetadata(preset.metadata);
    setContext(preset.context);
  }

  const hasResult = Boolean(state?.result || state?.results);

  const batchMatchSummary =
    targetPolicyId && state?.results
      ? state.results.filter(
          (r) => r.result.matched_policy === targetPolicyId,
        ).length
      : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Request">
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="mode" value={mode} />

          {policies.length === 0 ? (
            <p className="text-sm text-muted-fg" role="status">
              No active policies loaded.{" "}
              <Link
                href="/policies/import"
                className="text-secondary underline-offset-2 hover:underline cursor-pointer"
              >
                Import a policy
              </Link>{" "}
              first.
            </p>
          ) : (
            <>
              <Select
                label="Target policy"
                id={`${formId}-target-policy`}
                value={targetPolicyId}
                onChange={(e) => handlePolicyChange(e.target.value)}
                disabled={generating}
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) — {p.jurisdiction}
                  </option>
                ))}
              </Select>
              {selectedListItem && (
                <p className="text-xs text-muted-fg">
                  Evaluation still considers all active policies. This selection
                  drives sample data and highlights whether your target policy
                  matched.{" "}
                  <Link
                    href={`/policies/${encodeURIComponent(selectedListItem.id)}`}
                    className="text-secondary underline-offset-2 hover:underline cursor-pointer"
                  >
                    View policy
                  </Link>
                  {" · "}
                  <Link
                    href="/policies"
                    className="text-secondary underline-offset-2 hover:underline cursor-pointer"
                  >
                    All policies ({policies.length})
                  </Link>
                </p>
              )}
              {fullPolicyError && (
                <p className="text-xs text-destructive" role="alert">
                  {fullPolicyError}
                </p>
              )}
            </>
          )}

          <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
            <Button
              type="button"
              size="sm"
              variant={mode === "single" ? "primary" : "secondary"}
              onClick={() => setMode("single")}
              aria-pressed={mode === "single"}
              disabled={generating}
            >
              Single
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "batch" ? "primary" : "secondary"}
              onClick={() => setMode("batch")}
              aria-pressed={mode === "batch"}
              disabled={generating}
            >
              Batch
            </Button>
          </div>

          <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={
                  !aiConfigured ||
                  generating ||
                  fullPolicyLoading ||
                  !selectedFullPolicy ||
                  policies.length === 0
                }
                aria-busy={generating}
                onClick={() => void generateSampleData()}
              >
                {generating ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-3.5" aria-hidden />
                )}
                Generate sample data
              </Button>
              {mode === "single" && (
                <div
                  role="group"
                  aria-label="Sample scenario"
                  className="flex flex-wrap gap-1.5"
                >
                  {EVALUATE_SAMPLE_SCENARIOS.map((value) => (
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
                        scenario === value &&
                          "ring-2 ring-ring ring-offset-1",
                      )}
                    >
                      {SCENARIO_META[value].label}
                    </Button>
                  ))}
                </div>
              )}
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

          {mode === "single" && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">
                  Quick samples
                </span>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Quick samples"
                >
                  {PRESETS.map((p) => (
                    <Button
                      key={p.id}
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => applyPreset(p)}
                      disabled={generating}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Data type"
                  name="data_type"
                  id={`${formId}-data-type`}
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  required
                  disabled={generating}
                />
                <Input
                  label="Record ID"
                  name="record_id"
                  id={`${formId}-record-id`}
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  required
                  disabled={generating}
                />
                <Input
                  label="Source"
                  name="source"
                  id={`${formId}-source`}
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  disabled={generating}
                />
                <Input
                  label="Jurisdiction"
                  name="jurisdiction"
                  id={`${formId}-jurisdiction`}
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  disabled={generating}
                />
              </div>

              <Textarea
                label="Metadata (JSON object)"
                name="metadata"
                id={`${formId}-metadata`}
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                rows={10}
                disabled={generating}
              />
              <Textarea
                label="Context (JSON object, optional)"
                name="context"
                id={`${formId}-context`}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                className="min-h-[6rem]"
                disabled={generating}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${formId}-dry-run`}
                  name="dry_run"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  disabled={generating}
                  className="size-4 cursor-pointer accent-[var(--color-primary)]"
                  value="on"
                />
                <label
                  htmlFor={`${formId}-dry-run`}
                  className="cursor-pointer text-sm text-foreground"
                >
                  Dry-run (no audit_ref)
                </label>
              </div>
            </>
          )}

          {mode === "batch" && (
            <>
              <p className="text-sm text-muted-fg">
                Submit up to 1000 records. Batch uses live evaluate (no dry-run
                endpoint).
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setBatchRecords(BATCH_PRESET)}
                disabled={generating}
              >
                Load sample batch
              </Button>
              <Textarea
                label="Records (JSON array)"
                name="batch_records"
                id={`${formId}-batch`}
                value={batchRecords}
                onChange={(e) => setBatchRecords(e.target.value)}
                rows={16}
                disabled={generating}
              />
            </>
          )}

          {state?.error && <ErrorAlert message={state.error} />}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={pending || generating}>
              {pending
                ? "Evaluating…"
                : mode === "batch"
                  ? "Evaluate batch"
                  : dryRun
                    ? "Dry-run evaluate"
                    : "Evaluate"}
            </Button>
            {applied && hasResult && !pending && !state?.error && (
              <span
                className="text-sm text-success motion-safe:transition-opacity duration-200"
                role="status"
              >
                Evaluation complete
              </span>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Result">
        {!hasResult && !state?.error ? (
          <EmptyState message="Submit a request to see the evaluation decision." />
        ) : state?.result ? (
          <ResultDetail
            response={state.result}
            targetPolicyId={targetPolicyId || null}
          />
        ) : state?.results ? (
          <div className="space-y-6">
            {targetPolicyId && (
              <p className="text-sm text-muted-fg" role="status">
                {batchMatchSummary}/{state.results.length} records matched target
                policy{" "}
                <span className="font-mono text-xs">{targetPolicyId}</span>
              </p>
            )}
            <p className="text-sm text-muted-fg">
              {state.results.length} result
              {state.results.length === 1 ? "" : "s"}
            </p>
            {state.results.map((res) => (
              <div
                key={res.evaluation_id}
                className="border-b border-border/70 pb-6 last:border-0 last:pb-0"
              >
                <ResultDetail
                  response={res}
                  targetPolicyId={targetPolicyId || null}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="Fix the request errors and try again." />
        )}
      </Panel>
    </div>
  );
}
