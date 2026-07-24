"use client";

import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { TraceSummary } from "@/lib/ai/langsmith-runs";
import { StatusDot } from "@/components/status-dot";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  ContentCard,
  EmptyState,
  ErrorAlert,
  Kpi,
  KpiStrip,
  PageToolbar,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";
import { PaginationControls } from "@/components/ui/pagination";
import { paginateItems } from "@/lib/pagination";
import { formatDate } from "@/lib/utils";

const SETUP_SNIPPET = `# LiteLLM (required for AI assist)
LITELLM_BASE_URL=https://your-litellm.example/v1
LITELLM_API_KEY=
LITELLM_MODEL=gpt-4o-mini

# Tavily (optional — Policy Import web research)
TAVILY_API_KEY=

# Privacy masking (optional — FastAPI privalyse-mask extra)
# From repo root: pip install -e ".[ai]"
# PRIVACY_MASK_ENABLED=true

# LangSmith (optional — trace export)
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_PROJECT=drpe-admin
# LANGSMITH_PROJECT_ID=   # project/session UUID
# LANGSMITH_TENANT_ID=    # workspace tenant UUID for UI links
# LANGSMITH_WORKSPACE_ID= # service keys (lsv2_sk_…) only — tenant UUID, not project ID`;

type Tab = "tracing" | "setup" | "integrations";

type Filters = {
  route: "all" | "policy-suggest" | "evaluate-sample" | "classify-sample";
  status: "all" | "success" | "error";
  webSearch: "all" | "on" | "off" | "skipped";
  window: "24h" | "7d" | "30d";
  search: string;
};

function formatLatency(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function ObservabilityDashboard({
  liteLLMConfigured,
  tavilyConfigured,
  langsmithConfigured,
  privacyConfigured,
  model,
  project,
  projectUrl,
}: {
  liteLLMConfigured: boolean;
  tavilyConfigured: boolean;
  langsmithConfigured: boolean;
  privacyConfigured: boolean;
  model: string | null;
  project: string | null;
  projectUrl: string | null;
}) {
  const setupId = useId();
  const searchId = useId();
  const [tab, setTab] = useState<Tab>("tracing");
  const [setupOpen, setSetupOpen] = useState(!langsmithConfigured);
  const [filters, setFilters] = useState<Filters>({
    route: "all",
    status: "all",
    webSearch: "all",
    window: "7d",
    search: "",
  });
  const [traces, setTraces] = useState<TraceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [listMessage, setListMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadTraces = useCallback(async () => {
    if (!langsmithConfigured) return;
    setLoading(true);
    setFetchError(null);
    setListMessage(null);
    try {
      const params = new URLSearchParams();
      if (filters.route !== "all") params.set("route", filters.route);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.webSearch !== "all") params.set("webSearch", filters.webSearch);
      params.set("window", filters.window);

      const res = await fetch(`/api/observability/traces?${params.toString()}`);
      const body = (await res.json()) as {
        traces?: TraceSummary[];
        error?: string;
        configured?: boolean;
      };

      if (!res.ok) {
        setFetchError(body.error ?? "Failed to load traces");
        setTraces([]);
        return;
      }

      setTraces(body.traces ?? []);
      if ((body.traces?.length ?? 0) === 0) {
        setListMessage("No traces in this window. Run AI assist on Policy Import or Evaluate.");
      }
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Failed to load traces",
      );
      setTraces([]);
    } finally {
      setLoading(false);
    }
  }, [filters.route, filters.status, filters.webSearch, filters.window, langsmithConfigured]);

  useEffect(() => {
    if (tab === "tracing") {
      void loadTraces();
    }
  }, [loadTraces, tab]);

  const filteredTraces = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return traces;
    return traces.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.route?.toLowerCase().includes(q) ?? false),
    );
  }, [filters.search, traces]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.route, filters.status, filters.webSearch, filters.window]);

  const pagination = useMemo(
    () => paginateItems(filteredTraces, page),
    [filteredTraces, page],
  );

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl<Tab>
        ariaLabel="Observability views"
        value={tab}
        onChange={setTab}
        options={[
          { value: "tracing", label: "Tracing" },
          { value: "setup", label: "Setup" },
          { value: "integrations", label: "Integrations" },
        ]}
      />

      {tab === "tracing" && (
        <>
          <KpiStrip>
            <Kpi
              label="LiteLLM"
              value={liteLLMConfigured ? "On" : "Off"}
              hint={model ?? undefined}
              compact
            />
            <Kpi
              label="Tavily"
              value={tavilyConfigured ? "On" : "Off"}
              compact
            />
            <Kpi
              label="LangSmith"
              value={langsmithConfigured ? "On" : "Off"}
              hint={project ?? undefined}
              compact
            />
            <Kpi
              label="Privalyse"
              value={privacyConfigured ? "On" : "Off"}
              compact
            />
            <Kpi
              label="Model"
              value={model ?? "—"}
              compact
            />
          </KpiStrip>

          {!langsmithConfigured ? (
            <EmptyState message="LangSmith tracing is off. Enable LANGSMITH_TRACING and LANGSMITH_API_KEY to list traces here." />
          ) : (
            <>
              <PageToolbar>
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="obs-window" className="text-xs font-medium">
                      Time window
                    </label>
                    <Select
                      id="obs-window"
                      value={filters.window}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          window: e.target.value as Filters["window"],
                        }))
                      }
                    >
                      <option value="24h">Last 24 hours</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="obs-route" className="text-xs font-medium">
                      Route
                    </label>
                    <Select
                      id="obs-route"
                      value={filters.route}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          route: e.target.value as Filters["route"],
                        }))
                      }
                    >
                      <option value="all">All routes</option>
                      <option value="policy-suggest">Policy suggest</option>
                      <option value="evaluate-sample">Evaluate sample</option>
                      <option value="classify-sample">Classify sample</option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="obs-status" className="text-xs font-medium">
                      Status
                    </label>
                    <Select
                      id="obs-status"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          status: e.target.value as Filters["status"],
                        }))
                      }
                    >
                      <option value="all">All</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="obs-web-search" className="text-xs font-medium">
                      Web search
                    </label>
                    <Select
                      id="obs-web-search"
                      value={filters.webSearch}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          webSearch: e.target.value as Filters["webSearch"],
                        }))
                      }
                    >
                      <option value="all">All</option>
                      <option value="on">On</option>
                      <option value="off">Off</option>
                      <option value="skipped">Skipped</option>
                    </Select>
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor={searchId} className="text-xs font-medium">
                      Search
                    </label>
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-fg"
                        aria-hidden
                      />
                      <input
                        id={searchId}
                        type="search"
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, search: e.target.value }))
                        }
                        placeholder="Filter by run name or route"
                        className="w-full rounded-md border border-border bg-surface py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-fit"
                    aria-busy={loading}
                    disabled={loading}
                    onClick={() => void loadTraces()}
                  >
                    {loading ? (
                      <Loader2
                        className="size-3.5 motion-safe:animate-spin"
                        aria-hidden
                      />
                    ) : (
                      <RefreshCw className="size-3.5" aria-hidden />
                    )}
                    Refresh
                  </Button>
                </div>
                <div
                  aria-live="polite"
                  className="w-full text-sm text-muted-fg"
                >
                  {loading && "Loading traces…"}
                  {!loading && listMessage}
                </div>
              </PageToolbar>

              {fetchError && <ErrorAlert message={fetchError} />}

              <ContentCard>
                {filteredTraces.length === 0 && !loading ? (
                  <EmptyState message={listMessage ?? "No traces to show."} />
                ) : (
                  <>
                    <TableWrap stickyHeader>
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className={tableHeaderClass}>
                          <tr>
                            <th className={`${tableCellClass} font-medium`}>Status</th>
                            <th className={`${tableCellClass} font-medium`}>Name</th>
                            <th className={`${tableCellClass} font-medium`}>Route</th>
                            <th className={`${tableCellClass} font-medium`}>Mode</th>
                            <th className={`${tableCellClass} font-medium`}>Web search</th>
                            <th className={`${tableCellClass} font-medium`}>Latency</th>
                            <th className={`${tableCellClass} font-medium`}>Start time</th>
                            <th className={`${tableCellClass} font-medium`}>Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagination.items.map((trace) => (
                            <tr key={trace.id} className={tableRowClass}>
                              <td className={tableCellClass}>
                                <StatusDot status={trace.status} />
                              </td>
                              <td className={`${tableCellClass} font-mono text-xs`}>
                                {trace.name}
                              </td>
                              <td className={`${tableCellClass} font-mono text-xs`}>
                                {trace.route ?? "—"}
                              </td>
                              <td className={`${tableCellClass} font-mono text-xs`}>
                                {trace.mode ?? "—"}
                              </td>
                              <td className={tableCellClass}>
                                {trace.webSearch ? (
                                  <StatusDot status={trace.webSearch} />
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className={`${tableCellClass} font-mono text-xs`}>
                                {formatLatency(trace.latencyMs)}
                              </td>
                              <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>
                                {formatDate(trace.startTime)}
                              </td>
                              <td className={tableCellClass}>
                                <a
                                  href={trace.langsmithUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-secondary hover:underline cursor-pointer text-xs"
                                  aria-label={`Open trace ${trace.name} in LangSmith`}
                                >
                                  LangSmith
                                  <ExternalLink className="size-3" aria-hidden />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableWrap>
                    <div className="px-4 pb-4 md:px-5">
                      <PaginationControls
                        page={pagination.page}
                        hasPrev={pagination.hasPrev}
                        hasNext={pagination.hasNext}
                        from={pagination.from}
                        to={pagination.to}
                        total={pagination.total}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                        className="mt-0"
                      />
                    </div>
                  </>
                )}
              </ContentCard>
            </>
          )}
        </>
      )}

      {tab === "setup" && (
        <ContentCard title="Environment setup">
          <div className="flex flex-col gap-3 p-4 md:p-5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              aria-expanded={setupOpen}
              aria-controls={setupId}
              onClick={() => setSetupOpen((open) => !open)}
            >
              {setupOpen ? "Hide" : "Show"} environment snippet
            </Button>
            {setupOpen && (
              <pre
                id={setupId}
                className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs text-foreground"
              >
                {SETUP_SNIPPET}
              </pre>
            )}
            <p className="text-sm text-muted-fg">
              Copy into{" "}
              <code className="font-mono text-xs">admin/.env.local</code> for
              Next.js AI routes. Install privacy masking on the API with{" "}
              <code className="font-mono text-xs">pip install -e &quot;.[ai]&quot;</code>{" "}
              from the repo root. See{" "}
              <a
                href="https://docs.langchain.com/langsmith/trace-with-vercel-ai-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline cursor-pointer"
              >
                LangSmith + Vercel AI SDK docs
              </a>
              .
            </p>
          </div>
        </ContentCard>
      )}

      {tab === "integrations" && (
        <ContentCard title="Connected services">
          <div className="flex flex-col gap-4 p-4 md:p-5 text-sm">
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-fg">LiteLLM</p>
                <StatusDot
                  status={liteLLMConfigured ? "success" : "off"}
                  label={liteLLMConfigured ? "Configured" : "Not configured"}
                />
                {model && (
                  <p className="mt-1 font-mono text-xs text-muted-fg">{model}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-fg">Tavily web research</p>
                <StatusDot
                  status={tavilyConfigured ? "success" : "off"}
                  label={tavilyConfigured ? "Configured" : "Not configured"}
                />
              </div>
              <div>
                <p className="text-xs text-muted-fg">LangSmith tracing</p>
                <StatusDot
                  status={langsmithConfigured ? "success" : "off"}
                  label={langsmithConfigured ? "Configured" : "Not configured"}
                />
                {project && (
                  <p className="mt-1 font-mono text-xs text-muted-fg">{project}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-fg">Privalyse masking</p>
                <StatusDot
                  status={privacyConfigured ? "success" : "off"}
                  label={privacyConfigured ? "Configured" : "Not configured"}
                />
                <p className="mt-1 text-xs text-muted-fg">
                  FastAPI{" "}
                  <code className="font-mono text-[11px]">/api/v1/privacy/*</code>
                </p>
              </div>
            </div>
            {projectUrl && (
              <p>
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-secondary hover:underline cursor-pointer"
                >
                  Open LangSmith project
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </p>
            )}
            <p className="text-xs text-muted-fg">
              Traces contain redacted inputs/outputs. Privacy masking keeps PII
              out of model prompts via FastAPI privalyse-mask. Metadata only
              (route, mode, web search) is shown in the tracing view.{" "}
              <Link href="/policies/import" className="text-secondary hover:underline cursor-pointer">
                Policy Import
              </Link>{" "}
              and{" "}
              <Link href="/evaluate" className="text-secondary hover:underline cursor-pointer">
                Evaluate
              </Link>{" "}
              produce traces when LangSmith is enabled.
            </p>
          </div>
        </ContentCard>
      )}
    </div>
  );
}
