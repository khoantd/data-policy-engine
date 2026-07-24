"use client";

import dynamic from "next/dynamic";
import {
  Eraser,
  Loader2,
  Sparkles,
  Undo2,
  Wand2,
} from "lucide-react";
import { useActionState, useCallback, useRef, useState } from "react";
import {
  importPolicyAction,
  validatePolicyAction,
} from "@/lib/actions";
import {
  POLICY_SUGGEST_MODES,
  type PolicyKind,
  type PolicySuggestMode,
} from "@/lib/ai/policy-suggest-prompt";
import {
  CLASSIFICATION_ENTITY_CATEGORIES,
  CLASSIFICATION_JURISDICTION_STARTER_SENTENCES,
  ENTITY_CATEGORY_STARTER_SENTENCES,
  type ClassificationEntityCategory,
  type ClassificationJurisdiction,
} from "@/lib/ai/classification-skill-context";
import {
  INDUSTRY_STARTER_SENTENCES,
  JURISDICTION_STARTER_SENTENCES,
  RETENTION_INDUSTRIES,
  RETENTION_JURISDICTIONS,
  type RetentionIndustry,
  type RetentionJurisdiction,
} from "@/lib/ai/retention-skill-context";
import { stripYamlFences } from "@/lib/ai/strip-yaml-fences";
import {
  applyPolicySuggestEvent,
  createStreamAccumulator,
  parsePolicySuggestBuffer,
} from "@/lib/ai/policy-suggest-stream";
import type { WebSearchSource } from "@/lib/ai/tavily";
import { AiPrivacyBadge } from "@/components/ai-privacy-badge";
import { AiPrivacyFootnote } from "@/components/ai-privacy-footnote";
import { AiSourceReferences } from "@/components/ai-source-references";
import { AiTracingFootnote } from "@/components/ai-tracing-footnote";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { ErrorAlert, Panel } from "@/components/ui/layout";
import { YamlCodeEditorSkeleton } from "@/components/yaml-code-editor-skeleton";
import { cn } from "@/lib/utils";

const YamlCodeEditor = dynamic(
  () =>
    import("@/components/yaml-code-editor").then((m) => m.YamlCodeEditor),
  {
    ssr: false,
    loading: () => <YamlCodeEditorSkeleton />,
  },
);

const POLICY_KIND_META: Record<
  PolicyKind,
  { label: string; hint: string; disclaimer: string; placeholder: string }
> = {
  retention: {
    label: "Retention policy",
    hint: "How long to keep, archive, or delete data",
    disclaimer:
      "Retention mastery applies legal-hold priority, grace periods, and DSAR defaults — always verify with counsel before activating.",
    placeholder:
      "e.g. GDPR retention for inactive CRM profiles: delete after 2 years with 30-day grace…",
  },
  classification: {
    label: "Classification policy",
    hint: "Detect PII and sensitive data under jurisdiction rules",
    disclaimer:
      "Classification policies are operational drafts for detection rules — verify entity definitions and sensitivity tiers with counsel before activating.",
    placeholder:
      "e.g. GDPR PII detection for customer profiles: flag SPII (national ID, health) and review PII email/phone…",
  },
};

const ENTITY_CATEGORY_META: Record<
  ClassificationEntityCategory,
  { label: string; hint: string }
> = {
  email: { label: "Email", hint: "Email address PII" },
  phone: { label: "Phone", hint: "Phone number PII" },
  national_id: { label: "National ID", hint: "SSN, CMND, NRIC — SPII" },
  health: { label: "Health", hint: "Medical and health SPII" },
  financial: { label: "Financial", hint: "Account and payment data" },
  biometric: { label: "Biometric", hint: "Biometric identifiers — SPII" },
};

const MODE_META: Record<
  PolicySuggestMode,
  { label: string; hint: string }
> = {
  generate: {
    label: "Generate",
    hint: "Create YAML from your description",
  },
  polish: {
    label: "Polish",
    hint: "Clean up structure and naming",
  },
  enhance: {
    label: "Enhance",
    hint: "Strengthen grace, notify, DSAR, priorities",
  },
  expand: {
    label: "Expand",
    hint: "Add rules or scope from extra requirements",
  },
};

const INDUSTRY_META: Record<
  RetentionIndustry,
  { label: string; hint: string }
> = {
  saas: { label: "SaaS", hint: "Software subscriptions and user accounts" },
  ecommerce: { label: "E-commerce", hint: "Orders, profiles, and checkout data" },
  finance: { label: "Finance", hint: "KYC, transactions, and audit logs" },
  healthcare: { label: "Healthcare", hint: "Patient records and HIPAA logs" },
  hr: { label: "HR", hint: "Applications, payroll, and employment records" },
};

const JURISDICTION_META: Record<
  RetentionJurisdiction,
  { label: string; hint: string }
> = {
  EU_GDPR: { label: "EU GDPR", hint: "Storage limitation and DSAR erasure" },
  VN_PDPD: { label: "VN PDPD", hint: "Vietnam Nghị định 13/2023" },
  SG_PDPA: { label: "SG PDPA", hint: "Purpose-limited Singapore retention" },
  GLOBAL: { label: "Global", hint: "Cross-jurisdiction strictest retention" },
};

function appendStarter(current: string, sentence: string): string {
  const trimmed = current.trim();
  if (!trimmed) return sentence;
  if (trimmed.includes(sentence)) return trimmed;
  return `${trimmed}\n${sentence}`;
}

export function PolicyImportAssist({
  aiConfigured,
  webSearchConfigured,
  tracingConfigured,
  privacyConfigured,
}: {
  aiConfigured: boolean;
  webSearchConfigured: boolean;
  tracingConfigured: boolean;
  privacyConfigured: boolean;
}) {
  const [policyKind, setPolicyKind] = useState<PolicyKind>("retention");
  const [description, setDescription] = useState("");
  const [yaml, setYaml] = useState("");
  const [previousYaml, setPreviousYaml] = useState<string | null>(null);
  const [lastMode, setLastMode] = useState<PolicySuggestMode | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<RetentionJurisdiction | null>(
    null,
  );
  const [industry, setIndustry] = useState<RetentionIndustry | null>(null);
  const [entityCategory, setEntityCategory] =
    useState<ClassificationEntityCategory | null>(null);
  const [sources, setSources] = useState<WebSearchSource[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(
    webSearchConfigured,
  );
  const [searching, setSearching] = useState(false);
  const [protectedFieldCount, setProtectedFieldCount] = useState<number | undefined>(
    undefined,
  );
  const abortRef = useRef<AbortController | null>(null);

  const [importState, importAction, importing] = useActionState(
    importPolicyAction,
    null,
  );
  const [valState, valAction, validating] = useActionState(
    validatePolicyAction,
    null,
  );

  const runSuggest = useCallback(
    async (mode: PolicySuggestMode) => {
      if (!aiConfigured || streaming) return;

      const desc = description.trim();
      const current = yaml.trim();
      if (mode === "generate" && !desc) {
        setAiError("Add a description before Generate.");
        return;
      }
      if (
        (mode === "polish" || mode === "enhance" || mode === "expand") &&
        !current
      ) {
        setAiError(`Paste or generate YAML before ${MODE_META[mode].label}.`);
        return;
      }
      if (mode === "expand" && !desc) {
        setAiError("Describe what to add before Expand.");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const priorYaml = yaml;
      setAiError(null);
      setStreaming(true);
      setSearching(webSearchEnabled && webSearchConfigured);
      setSources([]);
      setProtectedFieldCount(undefined);
      setLastMode(mode);
      setAiStatus(
        webSearchEnabled && webSearchConfigured
          ? "Searching references…"
          : mode === "generate"
            ? "Generating draft…"
            : `${MODE_META[mode].label}ing…`,
      );
      setPreviousYaml(priorYaml);
      setYaml("");
      setAiDraft(true);

      try {
        const res = await fetch("/api/ai/policy-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyKind,
            mode,
            description: description,
            yaml: current || undefined,
            jurisdiction: jurisdiction ?? undefined,
            industry: policyKind === "retention" ? (industry ?? undefined) : undefined,
            entityCategory:
              policyKind === "classification"
                ? (entityCategory ?? undefined)
                : undefined,
            webSearch: webSearchEnabled,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let message = `Request failed (${res.status})`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body.error) message = body.error;
          } catch {
            /* ignore */
          }
          setYaml(priorYaml);
          setAiDraft(false);
          setAiError(message);
          setAiStatus("");
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setYaml(priorYaml);
          setAiDraft(false);
          setAiError("No response stream from AI assist.");
          setAiStatus("");
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        const acc = createStreamAccumulator();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { events, remainder } = parsePolicySuggestBuffer(buffer);
          buffer = remainder;

          for (const event of events) {
            if (event.event === "status") {
              setAiStatus(event.message);
              if (event.message === "Searching references…") {
                setSearching(true);
              }
              if (
                event.message === "Generating draft…" ||
                event.message === "Masking sensitive fields…"
              ) {
                setSearching(false);
              }
            }
            if (event.event === "privacy") {
              setProtectedFieldCount(event.entityCount);
            }
            if (event.event === "error") {
              setAiError(event.message);
            }
            const next = applyPolicySuggestEvent(acc, event);
            Object.assign(acc, next);
            if (next.sources.length > 0) {
              setSources([...next.sources]);
            }
            if (next.text) {
              setYaml(stripYamlFences(next.text));
            }
          }
        }

        buffer += decoder.decode();
        if (buffer.trim()) {
          const { events } = parsePolicySuggestBuffer(`${buffer}\n`);
          for (const event of events) {
            if (event.event === "error") setAiError(event.message);
            const next = applyPolicySuggestEvent(acc, event);
            Object.assign(acc, next);
            if (next.sources.length > 0) setSources([...next.sources]);
            if (next.text) setYaml(stripYamlFences(next.text));
          }
        }

        const cleaned = stripYamlFences(acc.text);
        setYaml(cleaned);
        setSources(acc.sources);
        setSearching(false);
        setAiStatus(
          cleaned.trim()
            ? "Draft ready — review references and YAML"
            : "",
        );
        if (!cleaned.trim()) {
          setAiError("Model returned empty YAML. Try Regenerate.");
          setAiDraft(false);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setAiStatus("Cancelled");
          return;
        }
        setYaml(priorYaml);
        setAiDraft(false);
        setAiError(err instanceof Error ? err.message : "AI request failed");
        setAiStatus("");
      } finally {
        setStreaming(false);
      }
    },
    [aiConfigured, description, entityCategory, industry, jurisdiction, policyKind, streaming, webSearchConfigured, webSearchEnabled, yaml],
  );

  const toggleJurisdiction = useCallback(
    (value: RetentionJurisdiction | ClassificationJurisdiction) => {
    setJurisdiction((prev) => {
      const next = prev === value ? null : value;
      if (next) {
        const sentence =
          policyKind === "classification"
            ? CLASSIFICATION_JURISDICTION_STARTER_SENTENCES[value]
            : JURISDICTION_STARTER_SENTENCES[value];
        setDescription((d) => appendStarter(d, sentence));
      }
      return next;
    });
  },
  [policyKind],
);

  const toggleEntityCategory = useCallback(
    (value: ClassificationEntityCategory) => {
      setEntityCategory((prev) => {
        const next = prev === value ? null : value;
        if (next) {
          setDescription((d) =>
            appendStarter(d, ENTITY_CATEGORY_STARTER_SENTENCES[value]),
          );
        }
        return next;
      });
    },
    [],
  );

  const toggleIndustry = useCallback((value: RetentionIndustry) => {
    setIndustry((prev) => {
      const next = prev === value ? null : value;
      if (next) {
        setDescription((d) =>
          appendStarter(d, INDUSTRY_STARTER_SENTENCES[value]),
        );
      }
      return next;
    });
  }, []);

  const undoYaml = useCallback(() => {
    if (previousYaml === null) return;
    setYaml(previousYaml);
    setPreviousYaml(null);
    setAiDraft(false);
    setAiStatus("Restored previous YAML");
  }, [previousYaml]);

  const clearDraft = useCallback(() => {
    abortRef.current?.abort();
    setYaml("");
    setAiDraft(false);
    setAiStatus("");
    setAiError(null);
    setSources([]);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="AI policy assist" className="motion-safe:transition-shadow">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span
                id="policy-kind-label"
                className="text-xs font-medium text-foreground"
              >
                Policy type
              </span>
              <div
                role="tablist"
                aria-labelledby="policy-kind-label"
                className="flex flex-wrap gap-2"
              >
                {(["retention", "classification"] as const).map((kind) => (
                  <Button
                    key={kind}
                    type="button"
                    role="tab"
                    aria-selected={policyKind === kind}
                    variant="secondary"
                    size="sm"
                    disabled={streaming}
                    title={POLICY_KIND_META[kind].hint}
                    onClick={() => setPolicyKind(kind)}
                    className={cn(
                      policyKind === kind && "ring-2 ring-ring ring-offset-1",
                    )}
                  >
                    {POLICY_KIND_META[kind].label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-fg">
              AI-generated drafts need your review. Output is not imported until
              you validate and confirm. {POLICY_KIND_META[policyKind].disclaimer}
            </p>

            {!aiConfigured && (
              <p
                className="rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-muted-fg"
                role="status"
              >
                AI assist is off. Set{" "}
                <code className="font-mono text-xs">LITELLM_BASE_URL</code>,{" "}
                <code className="font-mono text-xs">LITELLM_API_KEY</code>, and{" "}
                <code className="font-mono text-xs">LITELLM_MODEL</code> in{" "}
                <code className="font-mono text-xs">.env.local</code>. You can
                still paste YAML and import.
              </p>
            )}

            {aiConfigured && tracingConfigured && <AiTracingFootnote />}

            {aiConfigured && (
              <AiPrivacyBadge
                configured={privacyConfigured}
                entityCount={protectedFieldCount}
              />
            )}
            {aiConfigured && privacyConfigured && <AiPrivacyFootnote />}

            <div className="flex flex-col gap-2">
              <span
                id="jurisdiction-hint-label"
                className="text-xs font-medium text-foreground"
              >
                Jurisdiction (optional)
              </span>
              <div
                role="group"
                aria-labelledby="jurisdiction-hint-label"
                className="flex flex-wrap gap-2"
              >
                {RETENTION_JURISDICTIONS.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={streaming}
                    aria-pressed={jurisdiction === value}
                    title={JURISDICTION_META[value].hint}
                    onClick={() => toggleJurisdiction(value)}
                    className={cn(
                      jurisdiction === value &&
                        "ring-2 ring-ring ring-offset-1",
                    )}
                  >
                    {JURISDICTION_META[value].label}
                  </Button>
                ))}
              </div>
            </div>

            {policyKind === "retention" ? (
              <div className="flex flex-col gap-2">
                <span
                  id="industry-hint-label"
                  className="text-xs font-medium text-foreground"
                >
                  Industry (optional)
                </span>
                <div
                  role="group"
                  aria-labelledby="industry-hint-label"
                  className="flex flex-wrap gap-2"
                >
                  {RETENTION_INDUSTRIES.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={streaming}
                      aria-pressed={industry === value}
                      title={INDUSTRY_META[value].hint}
                      onClick={() => toggleIndustry(value)}
                      className={cn(
                        industry === value && "ring-2 ring-ring ring-offset-1",
                      )}
                    >
                      {INDUSTRY_META[value].label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span
                  id="entity-category-label"
                  className="text-xs font-medium text-foreground"
                >
                  Entity category (optional)
                </span>
                <div
                  role="group"
                  aria-labelledby="entity-category-label"
                  className="flex flex-wrap gap-2"
                >
                  {CLASSIFICATION_ENTITY_CATEGORIES.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={streaming}
                      aria-pressed={entityCategory === value}
                      title={ENTITY_CATEGORY_META[value].hint}
                      onClick={() => toggleEntityCategory(value)}
                      className={cn(
                        entityCategory === value &&
                          "ring-2 ring-ring ring-offset-1",
                      )}
                    >
                      {ENTITY_CATEGORY_META[value].label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Textarea
              label="Policy description"
              name="description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={POLICY_KIND_META[policyKind].placeholder}
              disabled={streaming}
              className="min-h-[10rem] font-sans"
            />

            {webSearchConfigured && (
              <div className="flex flex-col gap-2">
                <span
                  id="web-search-label"
                  className="text-xs font-medium text-foreground"
                >
                  Web research
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={streaming || !aiConfigured}
                  aria-pressed={webSearchEnabled}
                  aria-labelledby="web-search-label"
                  title="Search current regulatory guidance before generating YAML"
                  onClick={() => setWebSearchEnabled((prev) => !prev)}
                  className={cn(
                    "w-fit",
                    webSearchEnabled && "ring-2 ring-ring ring-offset-1",
                  )}
                >
                  Use web research
                </Button>
              </div>
            )}

            <AiSourceReferences
              sources={sources}
              webSearchConfigured={webSearchConfigured}
              webSearchEnabled={webSearchEnabled}
              searching={searching}
            />

            <div
              role="group"
              aria-label="AI assist modes"
              className="flex flex-wrap gap-2"
            >
              {POLICY_SUGGEST_MODES.map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!aiConfigured || streaming}
                  aria-pressed={lastMode === mode}
                  title={MODE_META[mode].hint}
                  onClick={() => void runSuggest(mode)}
                  className={cn(
                    lastMode === mode && "ring-2 ring-ring ring-offset-1",
                  )}
                >
                  {mode === "generate" ? (
                    <Sparkles className="size-3.5" aria-hidden />
                  ) : (
                    <Wand2 className="size-3.5" aria-hidden />
                  )}
                  {MODE_META[mode].label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!aiConfigured || streaming || !lastMode}
                onClick={() => lastMode && void runSuggest(lastMode)}
              >
                {streaming ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Wand2 className="size-3.5" aria-hidden />
                )}
                Regenerate
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={previousYaml === null || streaming}
                onClick={undoYaml}
              >
                <Undo2 className="size-3.5" aria-hidden />
                Undo YAML
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!yaml || streaming}
                onClick={clearDraft}
              >
                <Eraser className="size-3.5" aria-hidden />
                Clear draft
              </Button>
            </div>

            <div aria-live="polite" className="min-h-[1.25rem] text-sm">
              {streaming && (
                <span className="inline-flex items-center gap-2 text-muted-fg">
                  <Loader2
                    className="size-3.5 motion-safe:animate-spin"
                    aria-hidden
                  />
                  {aiStatus || "Working…"}
                </span>
              )}
              {!streaming && aiStatus && (
                <span className="text-success">{aiStatus}</span>
              )}
            </div>
            {aiError && <ErrorAlert message={aiError} />}
          </div>
        </Panel>

        <Panel
          title={
            policyKind === "classification"
              ? "Classification policy YAML"
              : "Retention policy YAML"
          }
          className="motion-safe:transition-shadow"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {aiDraft && (
              <span
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-primary"
                role="status"
              >
                AI-generated draft
              </span>
            )}
            {sources.length > 0 && (
              <span
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                role="status"
              >
                Enriched with {sources.length}{" "}
                {sources.length === 1 ? "reference" : "references"}
              </span>
            )}
            {!yaml.trim() && !streaming && (
              <span className="text-xs text-muted-fg">
                Empty — Generate from a description or paste YAML below.
              </span>
            )}
          </div>
          <YamlCodeEditor
            value={yaml}
            onChange={(next) => {
              setYaml(next);
              if (aiDraft) setAiDraft(true);
            }}
            dirty={aiDraft}
            label="Draft YAML"
            height="24rem"
          />
        </Panel>
      </div>

      <form action={importAction} className="flex flex-col gap-3">
        <input type="hidden" name="yaml" value={yaml} />
        <input
          type="hidden"
          name="reference_sources"
          value={JSON.stringify(sources)}
        />
        {(importState?.error || valState?.error) && (
          <ErrorAlert
            message={(importState?.error || valState?.error)!}
          />
        )}
        {valState?.ok && (
          <p className="text-sm text-success" role="status">
            {valState.message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={importing || streaming || !yaml.trim()}>
            {importing ? "Importing…" : "Import"}
          </Button>
          <Button
            type="submit"
            formAction={valAction}
            variant="secondary"
            disabled={validating || streaming || !yaml.trim()}
          >
            {validating ? "Checking…" : "Validate only"}
          </Button>
        </div>
      </form>
    </div>
  );
}
