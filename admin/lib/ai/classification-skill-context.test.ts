import { describe, expect, it } from "vitest";
import {
  CLASSIFICATION_MASTERY_MARKER,
  buildClassificationSkillAppendix,
} from "@/lib/ai/classification-skill-context";
import { buildPolicySuggestSystemPrompt } from "@/lib/ai/policy-suggest-prompt";

describe("buildClassificationSkillAppendix", () => {
  it("includes core principles and marker", () => {
    const appendix = buildClassificationSkillAppendix();
    expect(appendix).toContain(CLASSIFICATION_MASTERY_MARKER);
    expect(appendix).toContain("SPII defaults to critical");
  });

  it("appends jurisdiction and entity category hints", () => {
    const appendix = buildClassificationSkillAppendix({
      jurisdiction: "EU_GDPR",
      entityCategory: "national_id",
    });
    expect(appendix).toContain("EU_GDPR classification focus");
    expect(appendix).toContain("Entity: National ID");
  });
});

describe("classification policy suggest prompt", () => {
  it("uses classification DSL contract", () => {
    const prompt = buildPolicySuggestSystemPrompt(
      "generate",
      { jurisdiction: "EU_GDPR" },
      [],
      "classification",
    );
    expect(prompt).toContain("classification_policy:");
    expect(prompt).toContain(CLASSIFICATION_MASTERY_MARKER);
  });
});
