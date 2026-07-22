import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const searchMock = vi.fn();

vi.mock("@tavily/core", () => ({
  tavily: () => ({ search: searchMock }),
}));

describe("searchRetentionReferences", () => {
  beforeEach(() => {
    vi.stubEnv("TAVILY_API_KEY", "tvly-test-key");
    searchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("filters non-https URLs and normalizes sources", async () => {
    searchMock.mockResolvedValue({
      results: [
        {
          title: "Valid",
          url: "https://gdpr.eu/article-5",
          content: "Storage limitation.",
        },
        {
          title: "Insecure",
          url: "http://insecure.example/bad",
          content: "Should be dropped.",
        },
        {
          title: "Invalid",
          url: "not-a-url",
          content: "Should be dropped.",
        },
      ],
    });

    const { searchRetentionReferences } = await import("@/lib/ai/tavily");
    const sources = await searchRetentionReferences({
      mode: "generate",
      description: "GDPR retention",
      jurisdiction: "EU_GDPR",
    });

    expect(sources).toHaveLength(1);
    expect(sources[0]?.id).toBe(1);
    expect(sources[0]?.url).toBe("https://gdpr.eu/article-5");
    expect(sources[0]?.domain).toBe("gdpr.eu");
  });

  it("returns empty array when API key is missing", async () => {
    vi.stubEnv("TAVILY_API_KEY", "");
    const { searchRetentionReferences } = await import("@/lib/ai/tavily");
    const sources = await searchRetentionReferences({
      mode: "generate",
      description: "test",
    });
    expect(sources).toEqual([]);
    expect(searchMock).not.toHaveBeenCalled();
  });
});
