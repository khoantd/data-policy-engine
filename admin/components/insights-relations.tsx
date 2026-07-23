"use client";

import Link from "next/link";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import {
  EmptyState,
  PageToolbar,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import type { AuditEntry } from "@/lib/types";
import {
  buildRelationGraph,
  positionsForGraph,
  type RelationEdge,
  type RelationMode,
  type RelationNode,
  type RelationNodeKind,
} from "@/lib/relation-graph";

const MODE_OPTIONS: { value: RelationMode; label: string }[] = [
  { value: "policies", label: "Policies" },
  { value: "requesters", label: "Requesters" },
];

const KIND_COLORS: Record<RelationNodeKind, string> = {
  policy: "var(--primary)",
  rule: "var(--secondary)",
  requester: "var(--secondary)",
  other: "var(--muted-fg)",
};

type RelationNodeData = {
  label: string;
  kind: RelationNodeKind;
  hits: number;
  selected: boolean;
};

function RelationFlowNode({ data }: NodeProps) {
  const d = data as RelationNodeData;
  const border = d.selected ? "var(--accent)" : KIND_COLORS[d.kind];
  return (
    <div
      className={cn(
        "min-w-[120px] max-w-[180px] rounded-md border-2 bg-surface px-3 py-2 shadow-sm",
        "cursor-pointer",
      )}
      style={{ borderColor: border }}
      title={`${d.label} (${d.hits} hits)`}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-fg" />
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-fg">
        {d.kind}
      </div>
      <div className="truncate font-mono text-xs text-foreground">{d.label}</div>
      <div className="mt-0.5 text-[11px] text-muted-fg">{d.hits} hits</div>
      <Handle type="source" position={Position.Right} className="!bg-muted-fg" />
    </div>
  );
}

const nodeTypes = { relation: RelationFlowNode };

function topActions(actions: Record<string, number>, limit = 3): string[] {
  return Object.entries(actions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => `${name} (${count})`);
}

function auditHrefForNode(node: RelationNode): string {
  const qs = new URLSearchParams();
  if (node.kind === "policy" || node.kind === "rule") {
    if (node.policyId) qs.set("policy_id", node.policyId);
  }
  if (node.kind === "requester" && node.entityId !== "(unknown)") {
    qs.set("requester", node.entityId);
  }
  const s = qs.toString();
  return s ? `/audit?${s}` : "/audit";
}

function policyHref(node: RelationNode): string | null {
  if (node.policyId) return `/policies/${encodeURIComponent(node.policyId)}`;
  if (node.kind === "policy") return `/policies/${encodeURIComponent(node.entityId)}`;
  return null;
}

export function InsightsRelations({
  logs,
  initial,
}: {
  logs: AuditEntry[];
  initial: {
    mode?: string;
    event_type?: string;
    policy_id?: string;
    requester?: string;
  };
}) {
  const initialMode: RelationMode =
    initial.mode === "requesters" ? "requesters" : "policies";
  const [mode, setMode] = useState<RelationMode>(initialMode);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const graph = useMemo(() => buildRelationGraph(logs, mode), [logs, mode]);
  const positions = useMemo(() => positionsForGraph(graph), [graph]);

  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? null;
  const selectedEdges = graph.edges.filter(
    (e) => e.source === selectedId || e.target === selectedId,
  );

  const flowNodes: Node[] = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: "relation",
        position: positions[n.id] ?? { x: 0, y: 0 },
        data: {
          label: n.label,
          kind: n.kind,
          hits: n.hits,
          selected: n.id === selectedId,
        } satisfies RelationNodeData,
        draggable: false,
      })),
    [graph.nodes, positions, selectedId],
  );

  const maxWeight = Math.max(1, ...graph.edges.map((e) => e.weight));
  const flowEdges: Edge[] = useMemo(
    () =>
      graph.edges
        .filter((e) => e.source !== e.target)
        .map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: String(e.weight),
          style: {
            stroke: "rgba(144, 164, 174, 0.6)",
            strokeWidth: 1 + (e.weight / maxWeight) * 4,
          },
          labelStyle: { fontSize: 10, fill: "var(--muted-fg)" },
          animated: false,
        })),
    [graph.edges, maxWeight],
  );

  function onModeChange(next: RelationMode) {
    setMode(next);
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", next);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          ariaLabel="Relation mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={onModeChange}
        />
        <p className="text-xs text-muted-fg" aria-live="polite">
          {graph.totalHits} hits · {graph.nodes.length} nodes
          {graph.truncated ? " · truncated to top entities" : ""}
        </p>
      </div>

      <PageToolbar>
        <form
          method="get"
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <input type="hidden" name="mode" value={mode} />
          <Select
            label="Event type"
            name="event_type"
            defaultValue={initial.event_type || ""}
          >
            <option value="">All</option>
            <option value="evaluation">evaluation</option>
            <option value="action">action</option>
            <option value="notify">notify</option>
            <option value="pending_grace">pending_grace</option>
            <option value="flag">flag</option>
            <option value="dsar_access">dsar_access</option>
            <option value="dsar_erasure">dsar_erasure</option>
          </Select>
          <Input
            label="Policy ID"
            name="policy_id"
            defaultValue={initial.policy_id || ""}
          />
          <Input
            label="Requester"
            name="requester"
            defaultValue={initial.requester || ""}
          />
          <div className="flex items-end lg:col-span-2">
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              Filter
            </Button>
          </div>
        </form>
      </PageToolbar>

      <div
        className="flex flex-wrap gap-3 text-xs text-muted-fg"
        aria-label="Node legend"
      >
        <LegendSwatch color={KIND_COLORS.policy} label="Policy" />
        <LegendSwatch color={KIND_COLORS.rule} label="Rule" />
        <LegendSwatch color={KIND_COLORS.requester} label="Requester" />
        <LegendSwatch color={KIND_COLORS.other} label="Other" />
        <span className="text-muted-fg">
          Selection highlight uses amber accent
        </span>
      </div>

      {graph.nodes.length === 0 ? (
        <EmptyState message="No audit hits for this filter. Run enforcement or DSAR to populate relations." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-4 min-w-0">
            <div
              className="hidden h-[420px] overflow-hidden rounded-md border border-border bg-surface lg:block"
              role="img"
              aria-label="Relation network graph. Use the adjacency table below for an accessible alternative."
            >
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                panOnDrag
                zoomOnScroll
                proOptions={{ hideAttribution: true }}
                onNodeClick={(_, node) => setSelectedId(node.id)}
                onPaneClick={() => setSelectedId(null)}
              >
                <Background gap={16} color="var(--border)" />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>

            <div className="lg:hidden">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Nodes
              </h2>
              <ul className="flex flex-col gap-1" role="listbox" aria-label="Relation nodes">
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
                      onClick={() => setSelectedId(n.id)}
                    >
                      <span>
                        <span className="text-[10px] uppercase text-muted-fg">
                          {n.kind}{" "}
                        </span>
                        <span className="font-mono text-xs">{n.label}</span>
                      </span>
                      <span className="text-xs text-muted-fg">{n.hits}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <section aria-labelledby="adjacency-heading">
              <h2
                id="adjacency-heading"
                className="mb-2 text-sm font-semibold text-foreground"
              >
                Adjacency list
              </h2>
              <TableWrap stickyHeader>
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className={tableHeaderClass}>
                    <tr>
                      <th className={`${tableCellClass} font-medium`}>Source</th>
                      <th className={`${tableCellClass} font-medium`}>Target</th>
                      <th className={`${tableCellClass} font-medium`}>Hits</th>
                      <th className={`${tableCellClass} font-medium`}>
                        Top actions
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
                          edge.source === selectedId || edge.target === selectedId
                        }
                        onSelect={() => setSelectedId(edge.source)}
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
                Select a node in the graph or table to inspect hits and open
                related Audit / Policy views.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase text-muted-fg">
                    {selectedNode.kind}
                  </div>
                  <div className="font-mono text-xs break-all">
                    {selectedNode.label}
                  </div>
                </div>
                <div>
                  <span className="text-muted-fg">Hits: </span>
                  {selectedNode.hits}
                </div>
                {selectedEdges.length > 0 && (
                  <div>
                    <div className="mb-1 text-muted-fg">Connected edges</div>
                    <ul className="list-disc space-y-1 pl-4 text-xs">
                      {selectedEdges.slice(0, 8).map((e) => (
                        <li key={e.id}>
                          <span className="font-mono">
                            {labelFor(graph.nodes, e.source)} →{" "}
                            {labelFor(graph.nodes, e.target)}
                          </span>{" "}
                          ({e.weight})
                          {topActions(e.actions).length > 0 && (
                            <span className="text-muted-fg">
                              {" "}
                              · {topActions(e.actions).join(", ")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Link
                    href={auditHrefForNode(selectedNode)}
                    className="text-sm text-primary underline cursor-pointer hover:text-secondary"
                  >
                    View in Audit
                  </Link>
                  {policyHref(selectedNode) && (
                    <Link
                      href={policyHref(selectedNode)!}
                      className="text-sm text-primary underline cursor-pointer hover:text-secondary"
                    >
                      Open policy
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

function labelFor(nodes: RelationNode[], id: string): string {
  return nodes.find((n) => n.id === id)?.label ?? id;
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}

function AdjacencyRow({
  edge,
  nodes,
  selected,
  onSelect,
}: {
  edge: RelationEdge;
  nodes: RelationNode[];
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
      <td className={`${tableCellClass} font-mono text-xs`}>
        {labelFor(nodes, edge.target)}
      </td>
      <td className={tableCellClass}>{edge.weight}</td>
      <td className={`${tableCellClass} text-xs text-muted-fg`}>
        {topActions(edge.actions).join(", ") || "—"}
      </td>
    </tr>
  );
}
