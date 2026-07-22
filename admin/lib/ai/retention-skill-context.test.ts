import { describe, expect, it } from "vitest";
import {
  RETENTION_MASTERY_MARKER,
  buildRetentionSkillAppendix,
} from "@/lib/ai/retention-skill-context";
import { buildPolicySuggestSystemPrompt } from "@/lib/ai/policy-suggest-prompt";

describe("buildRetentionSkillAppendix", () => {
  it("includes core principles and marker", () => {
    const appendix = buildRetentionSkillAppendix();
    expect(appendix).toContain(RETENTION_MASTERY_MARKER);
    expect(appendix).toContain("Legal hold is sacred");
    expect(appendix).toContain("Jurisdiction quick reference");
  });

  it("appends jurisdiction slice when hinted", () => {
    const appendix = buildRetentionSkillAppendix({ jurisdiction: "EU_GDPR" });
    expect(appendix).toContain("EU_GDPR focus");
    expect(appendix).toContain("Art. 5(1)(e) storage limitation");
  });

  it("appends industry slice when hinted", () => {
    const appendix = buildRetentionSkillAppendix({ industry: "saas" });
    expect(appendix).toContain("Industry: SaaS");
    expect(appendix).toContain("user_profile");
  });

  it("combines jurisdiction and industry hints", () => {
    const appendix = buildRetentionSkillAppendix({
      jurisdiction: "VN_PDPD",
      industry: "finance",
    });
    expect(appendix).toContain("VN_PDPD focus");
    expect(appendix).toContain("Industry: Financial");
  });
});

describe("buildPolicySuggestSystemPrompt", () => {
  it("embeds retention mastery in system prompt", () => {
    const prompt = buildPolicySuggestSystemPrompt("generate", {
      jurisdiction: "EU_GDPR",
    });
    expect(prompt).toContain(RETENTION_MASTERY_MARKER);
    expect(prompt).toContain("Mode: generate");
    expect(prompt).toContain("Output ONLY valid YAML");
  });
});
