import { describe, expect, it } from "vitest";
import {
  applyPolicyDefaults,
  getTargetMatchStatus,
  trimPolicyForSample,
} from "@/lib/evaluate-playground";
import type { Policy } from "@/lib/types";

const samplePolicy = {
  id: "pol_gdpr_customer",
  name: "GDPR Customer",
  version: 3,
  status: "active",
  jurisdiction: "EU_GDPR",
  policy_kind: "retention",
  data_classification: "PII",
  scope: {
    data_types: ["customer_profile"],
    sources: ["crm_system"],
  },
  rules: [
    {
      id: "rule_inactive_delete",
      priority: 100,
      action: "delete",
      condition: { all: [] },
    },
  ],
} as unknown as Policy;

describe("applyPolicyDefaults", () => {
  it("derives jurisdiction, data type, and source from policy scope", () => {
    expect(applyPolicyDefaults(samplePolicy)).toEqual({
      jurisdiction: "EU_GDPR",
      dataType: "customer_profile",
      source: "crm_system",
    });
  });
});

describe("trimPolicyForSample", () => {
  it("returns a minimal policy snapshot for AI", () => {
    const trimmed = trimPolicyForSample(samplePolicy);
    expect(trimmed.id).toBe("pol_gdpr_customer");
    expect(trimmed.rules).toHaveLength(1);
    expect(trimmed.rules[0].action).toBe("delete");
  });
});

describe("getTargetMatchStatus", () => {
  it("returns null when no target is selected", () => {
    expect(getTargetMatchStatus("pol_a", null)).toBeNull();
  });

  it("detects matched, different, and none states", () => {
    expect(getTargetMatchStatus("pol_a", "pol_a")).toBe("matched");
    expect(getTargetMatchStatus("pol_b", "pol_a")).toBe("different");
    expect(getTargetMatchStatus(null, "pol_a")).toBe("none");
  });
});
