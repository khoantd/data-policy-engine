/** Aggregate audit hits into a relation graph for Insights. */

export type RelationMode = "policies" | "requesters";

export type AuditHitLike = {
  policy_id?: string | null;
  rule_id?: string | null;
  action?: string | null;
  requester?: string | null;
};

export type RelationNodeKind = "policy" | "rule" | "requester" | "other";

export type RelationNode = {
  id: string;
  kind: RelationNodeKind;
  label: string;
  hits: number;
  /** Policy id for policy/rule nodes; requester id for requester nodes. */
  entityId: string;
  policyId?: string;
  ruleId?: string;
};

export type RelationEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  actions: Record<string, number>;
};

export type RelationGraph = {
  mode: RelationMode;
  nodes: RelationNode[];
  edges: RelationEdge[];
  truncated: boolean;
  totalHits: number;
};

export const UNKNOWN_REQUESTER = "(unknown)";
export const OTHER_NODE_ID = "other";
export const OTHER_LABEL = "Other";

const DEFAULT_MAX_NODES = 100;

type EdgeAcc = {
  source: string;
  target: string;
  weight: number;
  actions: Record<string, number>;
};

function bumpAction(actions: Record<string, number>, action: string | null | undefined) {
  const key = action?.trim() || "(none)";
  actions[key] = (actions[key] ?? 0) + 1;
}

function layoutHint(index: number, total: number, kind: RelationNodeKind) {
  const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const baseX = kind === "requester" || kind === "policy" ? 40 : 320;
  const baseY = 40;
  return { x: baseX + col * 180, y: baseY + row * 100 };
}

/**
 * Build an aggregated relation graph from audit hit rows.
 * Caps unique nodes at `maxNodes` (default 100), folding lower-weight entities into Other.
 */
export function buildRelationGraph(
  logs: AuditHitLike[],
  mode: RelationMode,
  options?: { maxNodes?: number },
): RelationGraph {
  const maxNodes = options?.maxNodes ?? DEFAULT_MAX_NODES;
  const edgeMap = new Map<string, EdgeAcc>();
  const nodeHits = new Map<string, number>();
  let totalHits = 0;

  const ensureNode = (id: string) => {
    nodeHits.set(id, (nodeHits.get(id) ?? 0) + 1);
  };

  for (const log of logs) {
    totalHits += 1;
    if (mode === "policies") {
      const policyId = log.policy_id?.trim();
      if (!policyId) continue;
      const ruleId = log.rule_id?.trim();
      const policyNodeId = `policy:${policyId}`;
      ensureNode(policyNodeId);
      if (ruleId) {
        const ruleNodeId = `rule:${policyId}::${ruleId}`;
        ensureNode(ruleNodeId);
        const edgeKey = `${policyNodeId}->${ruleNodeId}`;
        let edge = edgeMap.get(edgeKey);
        if (!edge) {
          edge = { source: policyNodeId, target: ruleNodeId, weight: 0, actions: {} };
          edgeMap.set(edgeKey, edge);
        }
        edge.weight += 1;
        bumpAction(edge.actions, log.action);
      } else {
        // Policy-only hits: self-edge weight tracked as node hits only
        const edgeKey = `${policyNodeId}->${policyNodeId}`;
        let edge = edgeMap.get(edgeKey);
        if (!edge) {
          edge = { source: policyNodeId, target: policyNodeId, weight: 0, actions: {} };
          edgeMap.set(edgeKey, edge);
        }
        edge.weight += 1;
        bumpAction(edge.actions, log.action);
      }
    } else {
      const requesterRaw = log.requester?.trim();
      const requesterLabel = requesterRaw || UNKNOWN_REQUESTER;
      const requesterNodeId = `requester:${requesterLabel}`;
      const policyId = log.policy_id?.trim();
      if (!policyId) {
        ensureNode(requesterNodeId);
        continue;
      }
      const policyNodeId = `policy:${policyId}`;
      ensureNode(requesterNodeId);
      ensureNode(policyNodeId);
      const edgeKey = `${requesterNodeId}->${policyNodeId}`;
      let edge = edgeMap.get(edgeKey);
      if (!edge) {
        edge = { source: requesterNodeId, target: policyNodeId, weight: 0, actions: {} };
        edgeMap.set(edgeKey, edge);
      }
      edge.weight += 1;
      bumpAction(edge.actions, log.action);
    }
  }

  const ranked = [...nodeHits.entries()].sort((a, b) => b[1] - a[1]);
  let truncated = false;
  const keep = new Set<string>();
  if (ranked.length <= maxNodes) {
    for (const [id] of ranked) keep.add(id);
  } else {
    truncated = true;
    for (const [id] of ranked.slice(0, maxNodes - 1)) keep.add(id);
    keep.add(OTHER_NODE_ID);
  }

  const remapped = (id: string) => (keep.has(id) ? id : OTHER_NODE_ID);

  const finalEdges = new Map<string, EdgeAcc>();
  for (const edge of edgeMap.values()) {
    const source = remapped(edge.source);
    const target = remapped(edge.target);
    const key = `${source}->${target}`;
    let acc = finalEdges.get(key);
    if (!acc) {
      acc = { source, target, weight: 0, actions: {} };
      finalEdges.set(key, acc);
    }
    acc.weight += edge.weight;
    for (const [action, count] of Object.entries(edge.actions)) {
      acc.actions[action] = (acc.actions[action] ?? 0) + count;
    }
  }

  const finalNodeHits = new Map<string, number>();
  for (const [id, hits] of nodeHits) {
    const mapped = remapped(id);
    finalNodeHits.set(mapped, (finalNodeHits.get(mapped) ?? 0) + hits);
  }

  const nodes: RelationNode[] = [];
  for (const [id, hits] of finalNodeHits) {
    if (id === OTHER_NODE_ID) {
      nodes.push({
        id,
        kind: "other",
        label: OTHER_LABEL,
        hits,
        entityId: OTHER_LABEL,
      });
      continue;
    }
    if (id.startsWith("policy:")) {
      const policyId = id.slice("policy:".length);
      nodes.push({
        id,
        kind: "policy",
        label: policyId,
        hits,
        entityId: policyId,
        policyId,
      });
    } else if (id.startsWith("rule:")) {
      const rest = id.slice("rule:".length);
      const sep = rest.indexOf("::");
      const policyId = sep >= 0 ? rest.slice(0, sep) : rest;
      const ruleId = sep >= 0 ? rest.slice(sep + 2) : rest;
      nodes.push({
        id,
        kind: "rule",
        label: ruleId,
        hits,
        entityId: ruleId,
        policyId,
        ruleId,
      });
    } else if (id.startsWith("requester:")) {
      const label = id.slice("requester:".length);
      nodes.push({
        id,
        kind: "requester",
        label,
        hits,
        entityId: label,
      });
    }
  }

  nodes.sort((a, b) => b.hits - a.hits);

  const edges: RelationEdge[] = [...finalEdges.values()]
    .filter((e) => e.weight > 0)
    .map((e) => ({
      id: `${e.source}->${e.target}`,
      source: e.source,
      target: e.target,
      weight: e.weight,
      actions: e.actions,
    }))
    .sort((a, b) => b.weight - a.weight);

  return { mode, nodes, edges, truncated, totalHits };
}

/** Static positions for xyflow (no animated force). */
export function positionsForGraph(graph: RelationGraph): Record<string, { x: number; y: number }> {
  const leftKinds: RelationNodeKind[] =
    graph.mode === "requesters" ? ["requester", "other"] : ["policy", "other"];
  const rightKinds: RelationNodeKind[] =
    graph.mode === "requesters" ? ["policy"] : ["rule"];

  const left = graph.nodes.filter((n) => leftKinds.includes(n.kind));
  const right = graph.nodes.filter((n) => rightKinds.includes(n.kind));
  const positions: Record<string, { x: number; y: number }> = {};

  left.forEach((n, i) => {
    positions[n.id] = { x: 40, y: 40 + i * 90 };
  });
  right.forEach((n, i) => {
    positions[n.id] = { x: 380, y: 40 + i * 90 };
  });

  // Orphans (e.g. policy-only self in policies mode without rules)
  graph.nodes.forEach((n, i) => {
    if (!positions[n.id]) {
      positions[n.id] = layoutHint(i, graph.nodes.length, n.kind);
    }
  });

  return positions;
}
