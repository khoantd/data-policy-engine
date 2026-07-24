import { describe, expect, it } from "vitest";
import type { ClassificationPolicy, Policy, PolicyListItem } from "@/lib/types";
import {
  OTHER_LABEL,
  buildPolicyStructureGraph,
  filterStructureGraphByKinds,
  type StructureNodeKind,
} from "./policy-structure-graph";

const fleetItems: PolicyListItem[] = [
  {
    id: "gdpr_customer",
    name: "GDPR Customer",
    version: 2,
    status: "active",
    jurisdiction: "EU",
    policy_kind: "retention",
    data_classification: "PII",
    scope_data_types: ["customer", "order"],
    scope_sources: ["postgres.crm"],
    excluded_data_types: ["analytics"],
    rule_count: 3,
  },
  {
    id: "class_pii",
    name: "PII Classification",
    version: 1,
    status: "active",
    jurisdiction: "EU",
    policy_kind: "classification",
    entity_count: 2,
    scope_data_types: ["customer"],
    scope_sources: ["postgres.crm"],
    rule_count: 1,
  },
];

const retentionPolicy: Policy = {
  id: "gdpr_customer",
  name: "GDPR Customer",
  version: 2,
  status: "active",
  jurisdiction: "EU",
  policy_kind: "retention",
  data_classification: "PII",
  tags: ["gdpr", "customer"],
  scope: {
    data_types: ["customer"],
    sources: ["postgres.crm"],
    exclude: { data_types: ["analytics"] },
  },
  rules: [
    {
      id: "delete_inactive",
      priority: 10,
      action: "delete",
      requires_approval: false,
      condition: { all: [{ field: "last_login", operator: "older_than", value: "2y" }] },
    },
  ],
  reference_sources: [
    {
      id: 1,
      title: "GDPR Art. 5",
      url: "https://example.com/gdpr",
      snippet: "storage limitation",
      domain: "example.com",
    },
  ],
};

const classificationPolicy: ClassificationPolicy = {
  id: "class_pii",
  name: "PII Classification",
  version: 1,
  status: "active",
  jurisdiction: "EU",
  policy_kind: "classification",
  entities: [
    {
      id: "email",
      label: "Email",
      classification: "PII",
      sensitivity: "medium",
    },
  ],
  rules: [
    {
      id: "mask_email",
      priority: 1,
      action: "mask",
      condition: { all: [{ field: "entity", operator: "eq", value: "email" }] },
    },
  ],
  scope: { data_types: ["customer"], sources: ["api"] },
};

describe("buildPolicyStructureGraph fleet mode", () => {
  it("links policies to shared jurisdiction, data types, and sources", () => {
    const graph = buildPolicyStructureGraph({ mode: "fleet", policies: fleetItems });
    expect(graph.mode).toBe("fleet");
    expect(graph.nodes.find((n) => n.id === "policy:gdpr_customer")?.kind).toBe(
      "policy",
    );
    expect(graph.nodes.find((n) => n.id === "jurisdiction:EU")?.kind).toBe(
      "jurisdiction",
    );
    expect(graph.nodes.find((n) => n.id === "data_type:customer")).toBeTruthy();
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "data_type:customer" &&
          e.relation === "scopes",
      ),
    ).toBe(true);
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "jurisdiction:EU" &&
          e.relation === "in",
      ),
    ).toBe(true);
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "data_type:analytics" &&
          e.relation === "excludes",
      ),
    ).toBe(true);
  });

  it("folds excess nodes into Other when over maxNodes", () => {
    const many: PolicyListItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `pol_${i}`,
      name: `Policy ${i}`,
      version: 1,
      status: "active",
      jurisdiction: `J${i}`,
      policy_kind: "retention",
      scope_data_types: [`dt_${i}`],
      rule_count: 1,
    }));
    const graph = buildPolicyStructureGraph({
      mode: "fleet",
      policies: many,
      maxNodes: 8,
    });
    expect(graph.truncated).toBe(true);
    expect(graph.nodes.length).toBeLessThanOrEqual(8);
    expect(graph.nodes.some((n) => n.label === OTHER_LABEL)).toBe(true);
  });
});

describe("buildPolicyStructureGraph detail mode", () => {
  it("expands retention policy rules, scope, tags, and references", () => {
    const graph = buildPolicyStructureGraph({
      mode: "detail",
      policy: retentionPolicy,
    });
    expect(graph.mode).toBe("detail");
    expect(graph.nodes.find((n) => n.id === "policy:gdpr_customer")?.label).toBe(
      "GDPR Customer",
    );
    expect(graph.nodes.find((n) => n.id === "rule:gdpr_customer::delete_inactive")).toBeTruthy();
    expect(graph.nodes.find((n) => n.id === "tag:gdpr")).toBeTruthy();
    expect(graph.nodes.find((n) => n.id === "reference:1")).toBeTruthy();
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "rule:gdpr_customer::delete_inactive" &&
          e.relation === "contains",
      ),
    ).toBe(true);
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "reference:1" &&
          e.relation === "provenanced_by",
      ),
    ).toBe(true);
  });

  it("expands classification entities and rules", () => {
    const graph = buildPolicyStructureGraph({
      mode: "detail",
      policy: classificationPolicy,
    });
    expect(graph.nodes.find((n) => n.id === "entity:class_pii::email")?.kind).toBe(
      "entity",
    );
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:class_pii" &&
          e.target === "entity:class_pii::email" &&
          e.relation === "contains",
      ),
    ).toBe(true);
  });

  it("includes system and process applies_to edges when catalog links provided", () => {
    const graph = buildPolicyStructureGraph({
      mode: "detail",
      policy: retentionPolicy,
      catalogLinks: {
        systems: [{ id: "sys_crm", name: "CRM", source_key: "crm_system" }],
        processes: [{ id: "proc_onboard", name: "Onboarding" }],
      },
    });
    expect(graph.nodes.find((n) => n.id === "system:sys_crm")?.kind).toBe(
      "system",
    );
    expect(graph.nodes.find((n) => n.id === "process:proc_onboard")?.kind).toBe(
      "process",
    );
    expect(
      graph.edges.some(
        (e) =>
          e.relation === "applies_to" && e.target === "system:sys_crm",
      ),
    ).toBe(true);
  });
});

describe("buildPolicyStructureGraph fleet catalog links", () => {
  it("attaches systems to policies in fleet mode", () => {
    const graph = buildPolicyStructureGraph({
      mode: "fleet",
      policies: fleetItems,
      catalogLinks: {
        gdpr_customer: {
          systems: [{ id: "sys_crm", name: "CRM" }],
        },
      },
    });
    expect(graph.nodes.some((n) => n.id === "system:sys_crm")).toBe(true);
    expect(
      graph.edges.some(
        (e) =>
          e.source === "policy:gdpr_customer" &&
          e.target === "system:sys_crm" &&
          e.relation === "applies_to",
      ),
    ).toBe(true);
  });
});

describe("filterStructureGraphByKinds", () => {
  const fullGraph = buildPolicyStructureGraph({
    mode: "detail",
    policy: retentionPolicy,
    catalogLinks: {
      systems: [{ id: "sys_crm", name: "CRM", source_key: "crm_system" }],
      processes: [{ id: "proc_onboard", name: "Onboarding" }],
    },
  });

  it("hides system nodes and applies_to edges when system is excluded", () => {
    const kinds = new Set<StructureNodeKind>(
      fullGraph.nodes.map((n) => n.kind).filter((k) => k !== "system"),
    );
    const filtered = filterStructureGraphByKinds(fullGraph, kinds);
    expect(filtered.nodes.some((n) => n.kind === "system")).toBe(false);
    expect(
      filtered.edges.some(
        (e) => e.relation === "applies_to" && e.target === "system:sys_crm",
      ),
    ).toBe(false);
    expect(filtered.nodes.some((n) => n.kind === "process")).toBe(true);
    expect(filtered.mode).toBe(fullGraph.mode);
    expect(filtered.truncated).toBe(fullGraph.truncated);
  });

  it("returns empty nodes and edges when visibleKinds is empty", () => {
    const filtered = filterStructureGraphByKinds(fullGraph, new Set());
    expect(filtered.nodes).toEqual([]);
    expect(filtered.edges).toEqual([]);
  });

  it("is identity when all node kinds are visible", () => {
    const kinds = new Set<StructureNodeKind>(
      fullGraph.nodes.map((n) => n.kind),
    );
    const filtered = filterStructureGraphByKinds(fullGraph, kinds);
    expect(filtered.nodes).toEqual(fullGraph.nodes);
    expect(filtered.edges).toEqual(fullGraph.edges);
  });
});
