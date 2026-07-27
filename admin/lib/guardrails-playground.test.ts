import { describe, expect, it } from "vitest";
import {
  buildGuardrailsTargets,
  decisionTone,
  getPresetEventJson,
  guardrailsPlaygroundHref,
  parsePolicySearchParam,
  resolveInitialTargetId,
} from "@/lib/guardrails-playground";

describe("buildGuardrailsTargets", () => {
  it("lists agent policies before scratch documents", () => {
    const targets = buildGuardrailsTargets(
      [{ id: "pol_agent", name: "Agent", jurisdiction: "GLOBAL" }],
      [{ id: "ogr_1", name: "scratch" }],
    );
    expect(targets).toEqual([
      {
        id: "pol_agent",
        name: "Agent",
        source: "agent",
        jurisdiction: "GLOBAL",
      },
      { id: "ogr_1", name: "scratch", source: "scratch" },
    ]);
  });
});

describe("resolveInitialTargetId", () => {
  const targets = buildGuardrailsTargets(
    [{ id: "pol_a", name: "A", jurisdiction: "GLOBAL" }],
    [{ id: "ogr_x", name: "X" }],
  );

  it("prefers deep-linked id when present", () => {
    expect(resolveInitialTargetId(targets, "ogr_x")).toBe("ogr_x");
  });

  it("defaults to first agent policy", () => {
    expect(resolveInitialTargetId(targets, null)).toBe("pol_a");
    expect(resolveInitialTargetId(targets, "missing")).toBe("pol_a");
  });
});

describe("parsePolicySearchParam", () => {
  it("parses string and array forms", () => {
    expect(parsePolicySearchParam("pol_agent")).toBe("pol_agent");
    expect(parsePolicySearchParam(["pol_a", "pol_b"])).toBe("pol_a");
    expect(parsePolicySearchParam("  ")).toBeNull();
    expect(parsePolicySearchParam(undefined)).toBeNull();
  });
});

describe("guardrailsPlaygroundHref", () => {
  it("builds a policy deep link", () => {
    expect(guardrailsPlaygroundHref("pol_agent_default")).toBe(
      "/guardrails?policy=pol_agent_default",
    );
  });
});

describe("getPresetEventJson", () => {
  it("returns fresh JSON for known presets", () => {
    const raw = getPresetEventJson("pipe-to-shell");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as {
      payload: { arguments: { command: string } };
      timestamp: string;
    };
    expect(parsed.payload.arguments.command).toContain("| bash");
    expect(parsed.timestamp).toMatch(/^\d{4}-/);
  });

  it("returns null for unknown presets", () => {
    expect(getPresetEventJson("nope")).toBeNull();
  });
});

describe("decisionTone", () => {
  it("maps verdict decisions to UI tones", () => {
    expect(decisionTone("allow")).toBe("success");
    expect(decisionTone("block")).toBe("destructive");
    expect(decisionTone("require_approval")).toBe("warning");
    expect(decisionTone("unknown")).toBe("muted");
  });
});
