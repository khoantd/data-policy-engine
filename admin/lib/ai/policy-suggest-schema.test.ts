import { describe, expect, it } from "vitest";
import { policySuggestBodySchema } from "@/lib/ai/policy-suggest-schema";

describe("policySuggestBodySchema hints", () => {
  it("accepts optional jurisdiction and industry", () => {
    const parsed = policySuggestBodySchema.safeParse({
      mode: "generate",
      description: "Retain CRM profiles for 2 years",
      jurisdiction: "EU_GDPR",
      industry: "saas",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.jurisdiction).toBe("EU_GDPR");
      expect(parsed.data.industry).toBe("saas");
    }
  });

  it("rejects invalid jurisdiction", () => {
    const parsed = policySuggestBodySchema.safeParse({
      mode: "generate",
      description: "Test",
      jurisdiction: "US_CCPA",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid industry", () => {
    const parsed = policySuggestBodySchema.safeParse({
      mode: "generate",
      description: "Test",
      industry: "retail",
    });
    expect(parsed.success).toBe(false);
  });
});
