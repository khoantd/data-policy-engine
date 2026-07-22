import { describe, expect, it } from "vitest";
import { buildPolicySuggestSystemPrompt } from "@/lib/ai/policy-suggest-prompt";
import type { WebSearchSource } from "@/lib/ai/tavily";
import {
  buildRetentionSearchQuery,
  buildWebResearchPromptAppendix,
} from "@/lib/ai/web-search";

describe("buildRetentionSearchQuery", () => {
  it("includes jurisdiction, industry, and description snippet", () => {
    const query = buildRetentionSearchQuery({
      mode: "generate",
      description: "Retain inactive CRM profiles for 2 years",
      jurisdiction: "EU_GDPR",
      industry: "healthcare",
    });
    expect(query).toContain("EU GDPR");
    expect(query).toContain("healthcare HIPAA");
    expect(query).toContain("inactive CRM profiles");
    expect(query).toMatch(/\d{4}/);
  });

  it("works with minimal input", () => {
    const query = buildRetentionSearchQuery({
      mode: "polish",
      description: "",
    });
    expect(query).toContain("data retention");
  });
});

describe("buildWebResearchPromptAppendix", () => {
  it("returns empty string for no sources", () => {
    expect(buildWebResearchPromptAppendix([])).toBe("");
  });

  it("formats numbered sources and citation rules", () => {
    const sources: WebSearchSource[] = [
      {
        id: 1,
        title: "GDPR retention",
        url: "https://gdpr.eu/article-5/",
        snippet: "Storage limitation principle.",
        domain: "gdpr.eu",
      },
    ];
    const appendix = buildWebResearchPromptAppendix(sources);
    expect(appendix).toContain("WEB_RESEARCH_SOURCES");
    expect(appendix).toContain("[1] GDPR retention — https://gdpr.eu/article-5/");
    expect(appendix).toContain("Do NOT invent URLs");
  });
});

describe("buildPolicySuggestSystemPrompt with sources", () => {
  it("appends web research appendix when sources provided", () => {
    const prompt = buildPolicySuggestSystemPrompt(
      "generate",
      { jurisdiction: "EU_GDPR" },
      [
        {
          id: 1,
          title: "Test",
          url: "https://example.com",
          snippet: "snippet",
          domain: "example.com",
        },
      ],
    );
    expect(prompt).toContain("WEB_RESEARCH_SOURCES");
    expect(prompt).toContain("EU_GDPR focus");
  });
});
