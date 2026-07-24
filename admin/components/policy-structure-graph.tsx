"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { lightTheme, type GraphEdge, type GraphNode, type Theme } from "reagraph";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import {
  buildPolicyStructureGraph,
  filterStructureGraphByKinds,
  type CatalogLinksByPolicy,
  type PolicyCatalogLinks,
  type StructureEdge,
  type StructureGraph,
  type StructureNode,
  type StructureNodeKind,
  type StructureRelation,
} from "@/lib/policy-structure-graph";
import type {
  ClassificationPolicy,
  Policy,
  PolicyListItem,
} from "@/lib/types";

const PolicyStructureCanvas = dynamic(
  () =>
    import("@/components/policy-structure-canvas").then(
      (m) => m.PolicyStructureCanvas,
    ),
  { ssr: false, loading: () => <GraphCanvasFallback /> },
);

const KIND_COLORS: Record<StructureNodeKind, string> = {
  policy: "#1E40AF",
  rule: "#3B82F6",
  entity: "#3B82F6",
  data_type: "#64748B",
  source: "#64748B",
  tag: "#0F766E",
  reference: "#475569",
  jurisdiction: "#0369A1",
  system: "#B45309",
  process: "#0F766E",
  other: "#9CA3AF",
};

const LEGEND: { kind: StructureNodeKind; label: string }[] = [
  { kind: "policy", label: "Policy" },
  { kind: "rule", label: "Rule" },
  { kind: "entity", label: "Entity" },
  { kind: "data_type", label: "Data type" },
  { kind: "source", label: "Source" },
  { kind: "system", label: "System" },
  { kind: "process", label: "Process" },
  { kind: "tag", label: "Tag" },
  { kind: "reference", label: "Reference" },
  { kind: "jurisdiction", label: "Jurisdiction" },
];

const structureTheme: Theme = {
  ...lightTheme,
  canvas: { background: "#FFFFFF" },
  node: {
    ...lightTheme.node,
    fill: "#3B82F6",
    activeFill: "#D97706",
    label: {
      ...lightTheme.node.label,
      color: "#111827",
      activeColor: "#D97706",
      stroke: "#FFFFFF",
    },
    subLabel: {
      color: "#6B7280",
      stroke: "transparent",
      activeColor: "#D97706",
    },
  },
  ring: {
    fill: "#DBEAFE",
    activeFill: "#D97706",
  },
  edge: {
    ...lightTheme.edge,
    fill: "rgba(144, 164, 174, 0.6)",
    activeFill: "#D97706",
    label: {
      ...lightTheme.edge.label,
      color: "#6B7280",
      activeColor: "#D97706",
    },
  },
  arrow: {
    fill: "rgba(144, 164, 174, 0.8)",
    activeFill: "#D97706",
  },
};

function GraphCanvasFallback() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-fg">
      Loading graph…
    </div>
  );
}

function labelFor(nodes: StructureNode[], id: string): string {
  return nodes.find((n) => n.id === id)?.label ?? id;
}

function relationLabel(relation: StructureRelation): string {
  return relation.replace(/_/g, " ");
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useInitialFocus(initialFocus?: string | null) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialFocus ?? null,
  );

  useEffect(() => {
    if (!initialFocus) return;
    setSelectedId(initialFocus);
  }, [initialFocus]);

  function select(id: string | null) {
    setSelectedId(id);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("focus", id);
    else url.searchParams.delete("focus");
    window.history.replaceState({}, "", url.toString());
  }

  return { selectedId, select };
}

function toReagraphNodes(graph: StructureGraph): GraphNode[] {
  return graph.nodes.map((n) => ({
    id: n.id,
    label: n.label,
    // Kind is shown via node color + legend / detail panel — not as a
    // permanent subLabel (those stack under every name and collide).
    fill: KIND_COLORS[n.kind],
    data: { kind: n.kind, policyId: n.policyId, meta: n.meta },
    size: n.kind === "policy" ? 10 : 7,
  }));
}

function toReagraphEdges(graph: StructureGraph): GraphEdge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    // Relation text lives in the adjacency table; edge labels collide with nodes.
    fill: "rgba(144, 164, 174, 0.6)",
  }));
}

export function PolicyStructureGraph({
  mode,
  policies,
  policy,
  catalogLinks,
  fleetCatalogLinks,
  initialFocus,
  fleetHref = "/policies/graph",
}: {
  mode: "fleet" | "detail";
  policies?: PolicyListItem[];
  policy?: Policy | ClassificationPolicy;
  catalogLinks?: PolicyCatalogLinks;
  fleetCatalogLinks?: CatalogLinksByPolicy;
  initialFocus?: string | null;
  fleetHref?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const { selectedId, select } = useInitialFocus(initialFocus);
  const [visibleKinds, setVisibleKinds] = useState<Set<StructureNodeKind>>(
    () => new Set(LEGEND.map((item) => item.kind)),
  );

  const fullGraph = useMemo(() => {
    if (mode === "fleet") {
      return buildPolicyStructureGraph({
        mode: "fleet",
        policies: policies ?? [],
        catalogLinks: fleetCatalogLinks,
      });
    }
    if (!policy) {
      return buildPolicyStructureGraph({ mode: "fleet", policies: [] });
    }
    return buildPolicyStructureGraph({
      mode: "detail",
      policy,
      catalogLinks,
    });
  }, [mode, policies, policy, catalogLinks, fleetCatalogLinks]);

  const presentKinds = useMemo(() => {
    const present = new Set<StructureNodeKind>();
    for (const n of fullGraph.nodes) present.add(n.kind);
    return present;
  }, [fullGraph]);

  const kindOptions = useMemo(
    () => LEGEND.filter((item) => presentKinds.has(item.kind)),
    [presentKinds],
  );

  const graph = useMemo(
    () => filterStructureGraphByKinds(fullGraph, visibleKinds),
    [fullGraph, visibleKinds],
  );

  useEffect(() => {
    if (!selectedId) return;
    const node = fullGraph.nodes.find((n) => n.id === selectedId);
    if (node && !visibleKinds.has(node.kind)) {
      select(null);
    }
  }, [selectedId, visibleKinds, fullGraph.nodes, select]);

  const nodes = useMemo(() => toReagraphNodes(graph), [graph]);
  const edges = useMemo(() => toReagraphEdges(graph), [graph]);
  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? null;
  const selectedEdges = graph.edges.filter(
    (e) => e.source === selectedId || e.target === selectedId,
  );

  const layoutType =
    mode === "detail" ? "hierarchicalTd" : "forceDirected2d";

  function toggleKind(kind: StructureNodeKind) {
    setVisibleKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  if (fullGraph.nodes.length === 0) {
    return (
      <EmptyState message="No policy structure to visualize for this selection." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span
            id="structure-kind-filter-label"
            className="text-xs font-medium text-foreground"
          >
            Kind
          </span>
          <div
            role="group"
            aria-labelledby="structure-kind-filter-label"
            aria-label="Kind filter"
            className="flex flex-wrap gap-1.5"
          >
            {kindOptions.map((item) => {
              const pressed = visibleKinds.has(item.kind);
              return (
                <Button
                  key={item.kind}
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-pressed={pressed}
                  title={
                    pressed
                      ? `Hide ${item.label} nodes`
                      : `Show ${item.label} nodes`
                  }
                  onClick={() => toggleKind(item.kind)}
                  className={cn(
                    "gap-1.5 text-xs",
                    pressed
                      ? "ring-2 ring-ring ring-offset-1"
                      : "opacity-55",
                  )}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: KIND_COLORS[item.kind] }}
                    aria-hidden
                  />
                  {item.label}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-fg">
            Selection uses amber accent
          </p>
        </div>
        <p className="text-xs text-muted-fg" aria-live="polite">
          {graph.nodes.length} nodes · {graph.edges.length} edges
          {fullGraph.truncated ? " · truncated" : ""}
        </p>
      </div>

      {graph.nodes.length === 0 ? (
        <EmptyState message="No nodes match the selected kinds. Turn a Kind back on to restore the graph." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-4">
            <div
              className="relative hidden h-[420px] overflow-hidden rounded-md border border-border bg-surface lg:block"
              role="img"
              aria-label="Policy structure network graph. Use the adjacency table below for an accessible alternative."
            >
              <PolicyStructureCanvas
                nodes={nodes}
                edges={edges}
                theme={structureTheme}
                layoutType={layoutType}
                animated={!reducedMotion}
                selections={selectedId ? [selectedId] : []}
                actives={selectedId ? [selectedId] : []}
                onNodeClick={(nodeId) => select(nodeId)}
                onCanvasClick={() => select(null)}
              />
            </div>

            <div className="lg:hidden">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Nodes
              </h2>
              <ul
                className="flex flex-col gap-1"
                role="listbox"
                aria-label="Structure nodes"
              >
                {graph.nodes.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedId === n.id}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors duration-150",
                        selectedId === n.id
                          ? "border-accent bg-amber-50"
                          : "border-border bg-surface hover:bg-muted",
                      )}
                      onClick={() => select(n.id)}
                    >
                      <span>
                        <span className="text-[10px] uppercase text-muted-fg">
                          {n.kind}{" "}
                        </span>
                        <span className="font-mono text-xs">{n.label}</span>
                      </span>
                      <span className="text-xs text-muted-fg">{n.weight}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <section aria-labelledby="structure-adjacency-heading">
              <h2
                id="structure-adjacency-heading"
                className="mb-2 text-sm font-semibold text-foreground"
              >
                Adjacency list
              </h2>
              <TableWrap stickyHeader>
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className={tableHeaderClass}>
                    <tr>
                      <th className={`${tableCellClass} font-medium`}>
                        Source
                      </th>
                      <th className={`${tableCellClass} font-medium`}>
                        Relation
                      </th>
                      <th className={`${tableCellClass} font-medium`}>
                        Target
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {graph.edges.map((edge) => (
                      <AdjacencyRow
                        key={edge.id}
                        edge={edge}
                        nodes={graph.nodes}
                        selected={
                          edge.source === selectedId ||
                          edge.target === selectedId
                        }
                        onSelect={() => select(edge.source)}
                      />
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            </section>
          </div>

          <aside
            className="rounded-md border border-border bg-surface p-4"
            aria-live="polite"
          >
            <h2 className="text-sm font-semibold text-foreground">Detail</h2>
            {!selectedNode ? (
              <p className="mt-2 text-sm text-muted-fg">
                Select a node in the graph or table to inspect connections.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase text-muted-fg">
                    {selectedNode.kind}
                  </div>
                  <div className="break-all font-mono text-xs">
                    {selectedNode.label}
                  </div>
                </div>
                {selectedNode.meta && (
                  <div>
                    <span className="text-muted-fg">Meta: </span>
                    <span className="font-mono text-xs">
                      {selectedNode.meta}
                    </span>
                  </div>
                )}
                {selectedEdges.length > 0 && (
                  <div>
                    <div className="mb-1 text-muted-fg">Connected</div>
                    <ul className="list-disc space-y-1 pl-4 text-xs">
                      {selectedEdges.slice(0, 12).map((e) => (
                        <li key={e.id}>
                          <span className="font-mono">
                            {labelFor(graph.nodes, e.source)} →{" "}
                            {labelFor(graph.nodes, e.target)}
                          </span>{" "}
                          <span className="text-muted-fg">
                            ({relationLabel(e.relation)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {selectedNode.policyId && (
                    <Link
                      href={`/policies/${encodeURIComponent(selectedNode.policyId)}`}
                      className="cursor-pointer text-sm text-primary underline hover:text-secondary"
                    >
                      Open policy
                    </Link>
                  )}
                  {mode === "detail" && (
                    <Link
                      href={fleetHref}
                      className="cursor-pointer text-sm text-primary underline hover:text-secondary"
                    >
                      View fleet structure
                    </Link>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function AdjacencyRow({
  edge,
  nodes,
  selected,
  onSelect,
}: {
  edge: StructureEdge;
  nodes: StructureNode[];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <tr
      className={cn(tableRowClass, selected && "bg-amber-50", "cursor-pointer")}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
    >
      <td className={`${tableCellClass} font-mono text-xs`}>
        {labelFor(nodes, edge.source)}
      </td>
      <td className={`${tableCellClass} text-xs text-muted-fg`}>
        {relationLabel(edge.relation)}
      </td>
      <td className={`${tableCellClass} font-mono text-xs`}>
        {labelFor(nodes, edge.target)}
      </td>
    </tr>
  );
}
