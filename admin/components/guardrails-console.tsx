"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useMemo, useState, useTransition } from "react";
import {
  deleteGuardrailPolicyAction,
  evaluateGuardEventAction,
  saveGuardrailPolicyAction,
} from "@/lib/actions";
import {
  GUARDRAILS_EVENT_PRESETS,
  buildGuardrailsTargets,
  getPresetEventJson,
  resolveInitialTargetId,
} from "@/lib/guardrails-playground";
import type {
  GuardrailPolicyResponse,
  GuardrailsStatusResponse,
  PolicyListItem,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import {
  EmptyState,
  ErrorAlert,
  Panel,
} from "@/components/ui/layout";

export function GuardrailsConsole({
  status,
  agentPolicies,
  scratchPolicies,
  initialPolicyId = null,
}: {
  status: GuardrailsStatusResponse;
  agentPolicies: PolicyListItem[];
  scratchPolicies: GuardrailPolicyResponse[];
  initialPolicyId?: string | null;
}) {
  const formId = useId();
  const targets = useMemo(
    () => buildGuardrailsTargets(agentPolicies, scratchPolicies),
    [agentPolicies, scratchPolicies],
  );

  const [targetId, setTargetId] = useState(() =>
    resolveInitialTargetId(targets, initialPolicyId),
  );
  const [eventJson, setEventJson] = useState(
    () => getPresetEventJson("pipe-to-shell") ?? "{}",
  );
  const [presetId, setPresetId] = useState("pipe-to-shell");

  const selectedTarget = targets.find((t) => t.id === targetId) ?? null;
  const selectedScratch =
    scratchPolicies.find((p) => p.id === targetId) ?? null;

  const [scratchId, setScratchId] = useState(scratchPolicies[0]?.id ?? "");
  const selectedScratchDoc =
    scratchPolicies.find((p) => p.id === scratchId) ?? null;
  const [name, setName] = useState(selectedScratchDoc?.name ?? "default");
  const [policyJson, setPolicyJson] = useState(
    JSON.stringify(selectedScratchDoc?.policy ?? {}, null, 2),
  );

  const [saveState, saveAction, saving] = useActionState(
    saveGuardrailPolicyAction,
    null,
  );
  const [evalState, evalAction, evaluating] = useActionState(
    evaluateGuardEventAction,
    null,
  );
  const [pending, startTransition] = useTransition();
  const [listError, setListError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (targets.length === 0) {
      setTargetId("");
      return;
    }
    if (!targets.some((t) => t.id === targetId)) {
      setTargetId(resolveInitialTargetId(targets, initialPolicyId));
    }
  }, [targets, targetId, initialPolicyId]);

  useEffect(() => {
    if (evalState?.verdict) setApplied(true);
    if (evalState?.error) setApplied(false);
  }, [evalState]);

  function applyPreset(id: string) {
    const json = getPresetEventJson(id);
    if (!json) return;
    setPresetId(id);
    setEventJson(json);
  }

  function selectScratch(id: string) {
    const doc = scratchPolicies.find((p) => p.id === id);
    setScratchId(id);
    if (doc) {
      setName(doc.name);
      setPolicyJson(JSON.stringify(doc.policy, null, 2));
    }
  }

  function startNewScratch() {
    setScratchId("");
    setName("new-policy");
    setPolicyJson(
      JSON.stringify(scratchPolicies[0]?.policy ?? {}, null, 2),
    );
  }

  const agentCount = agentPolicies.length;
  const canEvaluate = Boolean(targetId) && status.available;

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="guardrails-status-heading"
        className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5"
      >
        <h2 id="guardrails-status-heading" className="sr-only">
          Runtime status
        </h2>
        <StatusBadge status={status.available ? "ready" : "draft"} />
        <span className="text-sm text-muted-fg">
          {status.available ? "Runtime available" : "Runtime unavailable"}
          {status.enabled ? " · enabled" : " · disabled"}
          {status.ogr_version ? ` · OGR ${status.ogr_version}` : ""}
        </span>
        {!status.available && (
          <p className="w-full text-sm text-muted-fg" role="status">
            Install with{" "}
            <code className="font-mono text-xs">
              pip install &quot;drpe[guardrails]&quot;
            </code>{" "}
            and restart the API. You can still select policies and prepare
            events offline.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Scan input">
          <form action={evalAction} className="flex flex-col gap-4">
            <input type="hidden" name="policy_id" value={targetId} />

            {targets.length === 0 ? (
              <p className="text-sm text-muted-fg" role="status">
                No agent or scratch policies loaded.{" "}
                <Link
                  href="/policies/import"
                  className="cursor-pointer text-secondary underline-offset-2 hover:underline"
                >
                  Create an agent policy
                </Link>{" "}
                (Kind: Agent) or add a scratch OGR document below.
              </p>
            ) : (
              <>
                <Select
                  label="Target policy"
                  id={`${formId}-target-policy`}
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  disabled={evaluating}
                >
                  {agentCount > 0 && (
                    <optgroup label="Agent policies">
                      {targets
                        .filter((t) => t.source === "agent")
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.id})
                            {t.jurisdiction ? ` — ${t.jurisdiction}` : ""}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {scratchPolicies.length > 0 && (
                    <optgroup label="Scratch OGR documents">
                      {targets
                        .filter((t) => t.source === "scratch")
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.id})
                          </option>
                        ))}
                    </optgroup>
                  )}
                </Select>
                {selectedTarget && (
                  <p className="text-xs text-muted-fg">
                    {selectedTarget.source === "agent"
                      ? "Evaluates the active agent policy’s OGR document (same engine path as production hooks)."
                      : "Evaluates a deployer scratch OGR JSON document."}{" "}
                    {selectedTarget.source === "agent" && (
                      <>
                        <Link
                          href={`/policies/${encodeURIComponent(selectedTarget.id)}`}
                          className="cursor-pointer text-secondary underline-offset-2 hover:underline"
                        >
                          View policy
                        </Link>
                        {" · "}
                      </>
                    )}
                    <Link
                      href="/policies?kind=agent"
                      className="cursor-pointer text-secondary underline-offset-2 hover:underline"
                    >
                      All agent policies ({agentCount})
                    </Link>
                  </p>
                )}
              </>
            )}

            <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground">
                Quick samples
              </p>
              <div
                role="group"
                aria-label="GuardEvent sample"
                className="flex flex-wrap gap-1.5"
              >
                {GUARDRAILS_EVENT_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={evaluating}
                    aria-pressed={presetId === preset.id}
                    title={preset.hint}
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      presetId === preset.id &&
                        "ring-2 ring-ring ring-offset-1",
                    )}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-fg" role="status">
                Samples align with default{" "}
                <code className="font-mono text-[11px]">command_rules</code>{" "}
                (pipe-to-shell, rm -rf, sudo). Review JSON before evaluate.
              </p>
            </div>

            <Textarea
              label="GuardEvent JSON"
              id={`${formId}-event`}
              name="event_json"
              value={eventJson}
              onChange={(e) => {
                setPresetId("");
                setEventJson(e.target.value);
              }}
              rows={14}
              className="font-mono text-xs"
              required
              disabled={evaluating}
            />

            <Button type="submit" disabled={evaluating || !canEvaluate}>
              {evaluating ? "Scanning…" : "Scan event"}
            </Button>
            {!status.available && (
              <p className="text-xs text-muted-fg" role="status">
                Scan is disabled until the Guardrails runtime is available.
              </p>
            )}
          </form>
        </Panel>

        <Panel title="Verdict">
          {!applied && !evalState?.error && (
            <EmptyState message="Run a scan to inspect the GuardEvent verdict." />
          )}
          {evalState?.error && <ErrorAlert message={evalState.error} />}
          {evalState?.verdict && (
            <div
              className="flex flex-col gap-4 motion-safe:transition-opacity motion-safe:duration-150"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={evalState.verdict.decision} />
                <span className="font-mono text-xs text-muted-fg">
                  {evalState.verdict.provider}
                  {evalState.verdict.latency_ms != null
                    ? ` · ${evalState.verdict.latency_ms} ms`
                    : ""}
                  {evalState.verdict.confidence != null
                    ? ` · conf ${evalState.verdict.confidence}`
                    : ""}
                </span>
              </div>

              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-muted-fg">Event</dt>
                  <dd className="font-mono text-xs">
                    {evalState.verdict.event_id}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-fg">Guard</dt>
                  <dd className="font-mono text-xs">
                    {evalState.verdict.guard_id}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-fg">Target</dt>
                  <dd className="font-mono text-xs">
                    {targetId || "—"}
                    {selectedTarget?.source
                      ? ` · ${selectedTarget.source}`
                      : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-fg">OGR</dt>
                  <dd className="font-mono text-xs">
                    {evalState.verdict.ogr_version}
                  </dd>
                </div>
              </dl>

              {evalState.verdict.reasons.length > 0 && (
                <div>
                  <h3 className="mb-1 text-xs font-medium uppercase text-muted-fg">
                    Reasons
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {evalState.verdict.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evalState.verdict.categories.length > 0 && (
                <div>
                  <h3 className="mb-1 text-xs font-medium uppercase text-muted-fg">
                    Categories
                  </h3>
                  <p className="font-mono text-xs text-muted-fg">
                    {evalState.verdict.categories
                      .map((c) => `${c.id} (${c.score})`)
                      .join(" · ")}
                  </p>
                </div>
              )}

              {evalState.verdict.evidence.length > 0 && (
                <details className="rounded-md border border-border bg-muted/20 p-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    Evidence ({evalState.verdict.evidence.length})
                  </summary>
                  <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-muted-fg">
                    {JSON.stringify(evalState.verdict.evidence, null, 2)}
                  </pre>
                </details>
              )}

              <details className="rounded-md border border-border bg-muted/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Raw verdict JSON
                </summary>
                <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-muted-fg">
                  {JSON.stringify(evalState.verdict, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </Panel>
      </div>

      <details className="rounded-md border border-border bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-foreground">
          Scratch OGR documents
          <span className="ml-2 font-normal text-muted-fg">
            Optional raw JSON · lifecycle agent policies live under Policies
          </span>
        </summary>
        <div className="border-t border-border p-4 md:p-5">
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Documents
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={startNewScratch}
                >
                  New
                </Button>
              </div>
              {scratchPolicies.length === 0 ? (
                <EmptyState message="No scratch documents yet." />
              ) : (
                <ul className="flex flex-col gap-1">
                  {scratchPolicies.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => selectScratch(p.id)}
                        className={
                          scratchId === p.id
                            ? "w-full cursor-pointer rounded-md bg-muted px-3 py-2 text-left text-sm font-medium"
                            : "w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-muted-fg hover:bg-muted/60"
                        }
                      >
                        <span className="block truncate">{p.name}</span>
                        <span className="block truncate font-mono text-[10px] opacity-70">
                          {p.id}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form action={saveAction} className="flex flex-col gap-3">
              <input type="hidden" name="policy_id" value={scratchId} />
              <Input
                label="Document name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                label="OGR policy JSON"
                name="policy_json"
                value={policyJson}
                onChange={(e) => setPolicyJson(e.target.value)}
                rows={14}
                className="font-mono text-xs"
                required
              />
              <p className="text-xs text-muted-fg">
                {selectedScratchDoc
                  ? `Updated ${formatDate(selectedScratchDoc.updated_at)}`
                  : "Creating a new scratch document"}
                {selectedScratch && scratchId === targetId
                  ? " · currently selected as scan target"
                  : ""}
              </p>
              {saveState?.error && <ErrorAlert message={saveState.error} />}
              {saveState?.ok && saveState.message && (
                <p className="text-sm text-foreground" role="status">
                  {saveState.message}
                </p>
              )}
              {listError && <ErrorAlert message={listError} />}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Saving…"
                    : scratchId
                      ? "Save document"
                      : "Create document"}
                </Button>
                {scratchId && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        const res =
                          await deleteGuardrailPolicyAction(scratchId);
                        if (res.error) setListError(res.error);
                        else {
                          setListError(null);
                          startNewScratch();
                        }
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
                {scratchId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setTargetId(scratchId)}
                  >
                    Use as scan target
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </details>
    </div>
  );
}
