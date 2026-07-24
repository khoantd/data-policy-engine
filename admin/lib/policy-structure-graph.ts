/** Build a structural policy graph (definition attributes, not audit hits). */

import type {
  ClassificationPolicy,
  Policy,
  PolicyListItem,
} from "@/lib/types";

export type StructureGraphMode = "fleet" | "detail";

export type StructureNodeKind =
  | "policy"
  | "rule"
  | "entity"
  | "data_type"
  | "source"
  | "tag"
  | "reference"
  | "jurisdiction"
  | "system"
  | "process"
  | "other";

export type StructureRelation =
  | "contains"
  | "scopes"
  | "excludes"
  | "in"
  | "provenanced_by"
  | "tagged"
  | "applies_to";

export type StructureNode = {
  id: string;
  kind: StructureNodeKind;
  label: string;
  /** Degree / connection weight for ranking when truncating. */
  weight: number;
  policyId?: string;
  meta?: string;
};

export type StructureEdge = {
  id: string;
  source: string;
  target: string;
  relation: StructureRelation;
};

export type StructureGraph = {
  mode: StructureGraphMode;
  nodes: StructureNode[];
  edges: StructureEdge[];
  truncated: boolean;
};

export const OTHER_NODE_ID = "other";
export const OTHER_LABEL = "Other";

const DEFAULT_MAX_NODES = 100;

type NodeAcc = {
  id: string;
  kind: StructureNodeKind;
  label: string;
  policyId?: string;
  meta?: string;
  weight: number;
};

type EdgeAcc = {
  source: string;
  target: string;
  relation: StructureRelation;
};

function bump(node: NodeAcc, amount = 1) {
  node.weight += amount;
}

function ensureNode(
  map: Map<string, NodeAcc>,
  partial: Omit<NodeAcc, "weight"> & { weight?: number },
): NodeAcc {
  let node = map.get(partial.id);
  if (!node) {
    node = {
      id: partial.id,
      kind: partial.kind,
      label: partial.label,
      policyId: partial.policyId,
      meta: partial.meta,
      weight: partial.weight ?? 0,
    };
    map.set(partial.id, node);
  }
  return node;
}

function addEdge(
  edges: Map<string, EdgeAcc>,
  source: string,
  target: string,
  relation: StructureRelation,
) {
  const id = `${source}->${target}:${relation}`;
  if (!edges.has(id)) {
    edges.set(id, { source, target, relation });
  }
}

function finalize(
  mode: StructureGraphMode,
  nodeMap: Map<string, NodeAcc>,
  edgeMap: Map<string, EdgeAcc>,
  maxNodes: number,
): StructureGraph {
  const ranked = [...nodeMap.values()].sort((a, b) => b.weight - a.weight);
  let truncated = false;
  const keep = new Set<string>();

  if (ranked.length <= maxNodes) {
    for (const n of ranked) keep.add(n.id);
  } else {
    truncated = true;
    // Prefer keeping policy nodes in the top set
    const policies = ranked.filter((n) => n.kind === "policy");
    const others = ranked.filter((n) => n.kind !== "policy");
    for (const n of policies) {
      if (keep.size >= maxNodes - 1) break;
      keep.add(n.id);
    }
    for (const n of others) {
      if (keep.size >= maxNodes - 1) break;
      keep.add(n.id);
    }
    keep.add(OTHER_NODE_ID);
  }

  const remapped = (id: string) => (keep.has(id) ? id : OTHER_NODE_ID);

  const finalNodeMap = new Map<string, NodeAcc>();
  for (const n of nodeMap.values()) {
    const id = remapped(n.id);
    if (id === OTHER_NODE_ID && n.id !== OTHER_NODE_ID) {
      const other = ensureNode(finalNodeMap, {
        id: OTHER_NODE_ID,
        kind: "other",
        label: OTHER_LABEL,
      });
      bump(other, n.weight);
      continue;
    }
    const existing = finalNodeMap.get(id);
    if (existing) {
      bump(existing, n.weight);
    } else {
      finalNodeMap.set(id, { ...n, id });
    }
  }

  if (truncated && !finalNodeMap.has(OTHER_NODE_ID)) {
    finalNodeMap.set(OTHER_NODE_ID, {
      id: OTHER_NODE_ID,
      kind: "other",
      label: OTHER_LABEL,
      weight: 0,
    });
  }

  const finalEdges = new Map<string, EdgeAcc>();
  for (const e of edgeMap.values()) {
    const source = remapped(e.source);
    const target = remapped(e.target);
    if (source === target && source === OTHER_NODE_ID) continue;
    addEdge(finalEdges, source, target, e.relation);
  }

  const nodes: StructureNode[] = [...finalNodeMap.values()]
    .map((n) => ({
      id: n.id,
      kind: n.kind,
      label: n.label,
      weight: n.weight,
      policyId: n.policyId,
      meta: n.meta,
    }))
    .sort((a, b) => b.weight - a.weight);

  const edges: StructureEdge[] = [...finalEdges.values()]
    .map((e) => ({
      id: `${e.source}->${e.target}:${e.relation}`,
      source: e.source,
      target: e.target,
      relation: e.relation,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return { mode, nodes, edges, truncated };
}

function buildFleetGraph(
  policies: PolicyListItem[],
  maxNodes: number,
  catalogLinks?: CatalogLinksByPolicy,
): StructureGraph {
  const nodeMap = new Map<string, NodeAcc>();
  const edgeMap = new Map<string, EdgeAcc>();

  for (const p of policies) {
    const policyId = `policy:${p.id}`;
    const policyNode = ensureNode(nodeMap, {
      id: policyId,
      kind: "policy",
      label: p.name || p.id,
      policyId: p.id,
      meta: `${p.policy_kind} · ${p.status}`,
    });
    bump(policyNode, 1 + (p.rule_count ?? 0));

    const jurId = `jurisdiction:${p.jurisdiction}`;
    const jur = ensureNode(nodeMap, {
      id: jurId,
      kind: "jurisdiction",
      label: p.jurisdiction,
    });
    bump(jur);
    bump(policyNode);
    addEdge(edgeMap, policyId, jurId, "in");

    for (const dt of p.scope_data_types ?? []) {
      const id = `data_type:${dt}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "data_type",
        label: dt,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "scopes");
    }
    for (const src of p.scope_sources ?? []) {
      const id = `source:${src}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "source",
        label: src,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "scopes");
    }
    for (const dt of p.excluded_data_types ?? []) {
      const id = `data_type:${dt}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "data_type",
        label: dt,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "excludes");
    }
    for (const src of p.excluded_sources ?? []) {
      const id = `source:${src}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "source",
        label: src,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "excludes");
    }

    const links = catalogLinks?.[p.id];
    for (const sys of links?.systems ?? []) {
      const id = `system:${sys.id}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "system",
        label: sys.name,
        meta: sys.source_key || undefined,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "applies_to");
    }
    for (const proc of links?.processes ?? []) {
      const id = `process:${proc.id}`;
      const node = ensureNode(nodeMap, {
        id,
        kind: "process",
        label: proc.name,
      });
      bump(node);
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "applies_to");
    }
  }

  return finalize("fleet", nodeMap, edgeMap, maxNodes);
}

function isClassification(
  policy: Policy | ClassificationPolicy,
): policy is ClassificationPolicy {
  return policy.policy_kind === "classification" || "entities" in policy;
}

function buildDetailGraph(
  policy: Policy | ClassificationPolicy,
  maxNodes: number,
  catalogLinks?: PolicyCatalogLinks,
): StructureGraph {
  const nodeMap = new Map<string, NodeAcc>();
  const edgeMap = new Map<string, EdgeAcc>();
  const policyId = `policy:${policy.id}`;

  const policyNode = ensureNode(nodeMap, {
    id: policyId,
    kind: "policy",
    label: policy.name || policy.id,
    policyId: policy.id,
    meta: `${policy.policy_kind} · ${policy.status}`,
  });
  bump(policyNode, 2);

  const jurId = `jurisdiction:${policy.jurisdiction}`;
  ensureNode(nodeMap, {
    id: jurId,
    kind: "jurisdiction",
    label: policy.jurisdiction,
  });
  bump(policyNode);
  addEdge(edgeMap, policyId, jurId, "in");

  for (const tag of policy.tags ?? []) {
    const id = `tag:${tag}`;
    const node = ensureNode(nodeMap, { id, kind: "tag", label: tag });
    bump(node);
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "tagged");
  }

  const scope = policy.scope;
  for (const dt of scope?.data_types ?? []) {
    const id = `data_type:${dt}`;
    ensureNode(nodeMap, { id, kind: "data_type", label: dt });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "scopes");
  }
  for (const src of scope?.sources ?? []) {
    const id = `source:${src}`;
    ensureNode(nodeMap, { id, kind: "source", label: src });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "scopes");
  }
  for (const dt of scope?.exclude?.data_types ?? []) {
    const id = `data_type:${dt}`;
    ensureNode(nodeMap, { id, kind: "data_type", label: dt });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "excludes");
  }
  for (const src of scope?.exclude?.sources ?? []) {
    const id = `source:${src}`;
    ensureNode(nodeMap, { id, kind: "source", label: src });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "excludes");
  }

  for (const rule of policy.rules ?? []) {
    const id = `rule:${policy.id}::${rule.id}`;
    const action =
      "action" in rule ? String(rule.action) : undefined;
    ensureNode(nodeMap, {
      id,
      kind: "rule",
      label: rule.id,
      policyId: policy.id,
      meta: action,
    });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "contains");
  }

  if (isClassification(policy)) {
    for (const entity of policy.entities ?? []) {
      const id = `entity:${policy.id}::${entity.id}`;
      ensureNode(nodeMap, {
        id,
        kind: "entity",
        label: entity.label || entity.id,
        policyId: policy.id,
        meta: entity.classification,
      });
      bump(policyNode);
      addEdge(edgeMap, policyId, id, "contains");
    }
  }

  for (const ref of policy.reference_sources ?? []) {
    const id = `reference:${ref.id}`;
    ensureNode(nodeMap, {
      id,
      kind: "reference",
      label: ref.title || String(ref.id),
      meta: ref.domain || undefined,
    });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "provenanced_by");
  }

  for (const sys of catalogLinks?.systems ?? []) {
    const id = `system:${sys.id}`;
    ensureNode(nodeMap, {
      id,
      kind: "system",
      label: sys.name,
      meta: sys.source_key || undefined,
    });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "applies_to");
  }
  for (const proc of catalogLinks?.processes ?? []) {
    const id = `process:${proc.id}`;
    ensureNode(nodeMap, {
      id,
      kind: "process",
      label: proc.name,
    });
    bump(policyNode);
    addEdge(edgeMap, policyId, id, "applies_to");
  }

  return finalize("detail", nodeMap, edgeMap, maxNodes);
}

export type CatalogLinkRef = {
  id: string;
  name: string;
  source_key?: string | null;
};

export type PolicyCatalogLinks = {
  systems?: CatalogLinkRef[];
  processes?: CatalogLinkRef[];
};

export type CatalogLinksByPolicy = Record<string, PolicyCatalogLinks>;

export type BuildFleetInput = {
  mode: "fleet";
  policies: PolicyListItem[];
  maxNodes?: number;
  catalogLinks?: CatalogLinksByPolicy;
};

export type BuildDetailInput = {
  mode: "detail";
  policy: Policy | ClassificationPolicy;
  maxNodes?: number;
  catalogLinks?: PolicyCatalogLinks;
};

export function buildPolicyStructureGraph(
  input: BuildFleetInput | BuildDetailInput,
): StructureGraph {
  const maxNodes = input.maxNodes ?? DEFAULT_MAX_NODES;
  if (input.mode === "fleet") {
    return buildFleetGraph(input.policies, maxNodes, input.catalogLinks);
  }
  return buildDetailGraph(input.policy, maxNodes, input.catalogLinks);
}

/** Keep nodes whose kind is in `visibleKinds`; edges need both endpoints. */
export function filterStructureGraphByKinds(
  graph: StructureGraph,
  visibleKinds: Set<StructureNodeKind>,
): StructureGraph {
  const nodes = graph.nodes.filter((n) => visibleKinds.has(n.kind));
  const keep = new Set(nodes.map((n) => n.id));
  const edges = graph.edges.filter(
    (e) => keep.has(e.source) && keep.has(e.target),
  );
  return {
    mode: graph.mode,
    nodes,
    edges,
    truncated: graph.truncated,
  };
}
