import { describe, expect, it } from "vitest";
import {
  buildPolicySuggestSystemPrompt,
  buildPolicySuggestUserPrompt,
} from "@/lib/ai/policy-suggest-prompt";
import { policySuggestBodySchema } from "@/lib/ai/policy-suggest-schema";
import { stripYamlFences } from "@/lib/ai/strip-yaml-fences";

describe("stripYamlFences", () => {
  it("unwraps a full yaml fence", () => {
    const input = "```yaml\npolicy:\n  id: pol_x\n```";
    expect(stripYamlFences(input)).toBe("policy:\n  id: pol_x");
  });

  it("unwraps a bare fence", () => {
    expect(stripYamlFences("```\nfoo: 1\n```")).toBe("foo: 1");
  });

  it("strips opening fence during streaming-style partials", () => {
    expect(stripYamlFences("```yaml\npolicy:\n  id: a")).toBe(
      "policy:\n  id: a",
    );
  });

  it("leaves plain yaml unchanged", () => {
    expect(stripYamlFences("policy:\n  id: plain")).toBe("policy:\n  id: plain");
  });
});

describe("policy suggest prompts", () => {
  it("embeds mode instructions in the system prompt", () => {
    const sys = buildPolicySuggestSystemPrompt("enhance");
    expect(sys).toContain("Mode: enhance");
    expect(sys).toContain("strengthen retention controls");
    expect(sys).toContain("Output ONLY valid YAML");
  });

  it("includes description and yaml in the user prompt", () => {
    const user = buildPolicySuggestUserPrompt({
      mode: "polish",
      description: "Tighten naming",
      yaml: "policy:\n  id: pol_a",
    });
    expect(user).toContain("Tighten naming");
    expect(user).toContain("policy:\n  id: pol_a");
    expect(user).toContain("Respond with YAML only.");
  });

  it("uses a skeleton fallback when description and yaml are empty", () => {
    const user = buildPolicySuggestUserPrompt({
      mode: "generate",
      description: "   ",
    });
    expect(user).toContain("minimal draft");
  });
});

describe("policySuggestBodySchema", () => {
  it("accepts generate with description", () => {
    const r = policySuggestBodySchema.safeParse({
      mode: "generate",
      description: "GDPR delete inactive after 2y",
    });
    expect(r.success).toBe(true);
  });

  it("rejects generate without description", () => {
    const r = policySuggestBodySchema.safeParse({
      mode: "generate",
      description: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects polish without yaml", () => {
    const r = policySuggestBodySchema.safeParse({
      mode: "polish",
      description: "optional",
      yaml: "",
    });
    expect(r.success).toBe(false);
  });

  it("accepts enhance with yaml", () => {
    const r = policySuggestBodySchema.safeParse({
      mode: "enhance",
      description: "",
      yaml: "policy:\n  id: x\n  name: X\n  jurisdiction: EU_GDPR\n  data_classification: PII\n  rules: []",
    });
    expect(r.success).toBe(true);
  });

  it("rejects expand without description", () => {
    const r = policySuggestBodySchema.safeParse({
      mode: "expand",
      description: "",
      yaml: "policy:\n  id: x",
    });
    expect(r.success).toBe(false);
  });
});
