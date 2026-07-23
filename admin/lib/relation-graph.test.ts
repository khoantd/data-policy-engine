import { describe, expect, it } from "vitest";
import {
  OTHER_LABEL,
  UNKNOWN_REQUESTER,
  buildRelationGraph,
} from "./relation-graph";

describe("buildRelationGraph policies mode", () => {
  it("aggregates policy → rule edges with weights and actions", () => {
    const graph = buildRelationGraph(
      [
        { policy_id: "pol_a", rule_id: "r1", action: "delete" },
        { policy_id: "pol_a", rule_id: "r1", action: "delete" },
        { policy_id: "pol_a", rule_id: "r2", action: "retain" },
      ],
      "policies",
    );
    expect(graph.totalHits).toBe(3);
    expect(graph.nodes.find((n) => n.id === "policy:pol_a")?.hits).toBe(3);
    const edge = graph.edges.find((e) => e.id === "policy:pol_a->rule:pol_a::r1");
    expect(edge?.weight).toBe(2);
    expect(edge?.actions.delete).toBe(2);
  });

  it("tracks policy-only hits without a rule", () => {
    const graph = buildRelationGraph(
      [{ policy_id: "pol_b", action: "flag" }],
      "policies",
    );
    expect(graph.nodes).toHaveLength(1);
    expect(graph.edges[0]?.source).toBe("policy:pol_b");
    expect(graph.edges[0]?.target).toBe("policy:pol_b");
    expect(graph.edges[0]?.weight).toBe(1);
  });
});

describe("buildRelationGraph requesters mode", () => {
  it("maps requester → policy and collapses missing requester", () => {
    const graph = buildRelationGraph(
      [
        { policy_id: "pol_a", requester: "crm_cleanup_job", action: "delete" },
        { policy_id: "pol_a", requester: null, action: "retain" },
        { policy_id: "pol_b", requester: "  ", action: "delete" },
      ],
      "requesters",
    );
    const unknown = graph.nodes.find((n) => n.label === UNKNOWN_REQUESTER);
    expect(unknown).toBeTruthy();
    expect(unknown!.hits).toBe(2);
    const edge = graph.edges.find(
      (e) => e.source === "requester:crm_cleanup_job" && e.target === "policy:pol_a",
    );
    expect(edge?.weight).toBe(1);
  });

  it("folds excess nodes into Other when over maxNodes", () => {
    const logs = Array.from({ length: 12 }, (_, i) => ({
      policy_id: `pol_${i}`,
      requester: `req_${i}`,
      action: "delete",
    }));
    // Each log adds 2 nodes; maxNodes=5 keeps 4 + Other
    const graph = buildRelationGraph(logs, "requesters", { maxNodes: 5 });
    expect(graph.truncated).toBe(true);
    expect(graph.nodes.length).toBeLessThanOrEqual(5);
    expect(graph.nodes.some((n) => n.label === OTHER_LABEL)).toBe(true);
  });
});
