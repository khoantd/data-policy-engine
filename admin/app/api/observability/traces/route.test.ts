import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  getApiKey: vi.fn(async () => ""),
}));

const listRecentTracesMock = vi.fn();
const isLangSmithConfiguredMock = vi.fn(() => true);

vi.mock("@/lib/ai/langsmith", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/langsmith")>();
  return {
    ...actual,
    isLangSmithConfigured: () => isLangSmithConfiguredMock(),
  };
});

vi.mock("@/lib/ai/langsmith-runs", () => ({
  listRecentTraces: (...args: unknown[]) => listRecentTracesMock(...args),
}));

describe("GET /api/observability/traces", () => {
  beforeEach(() => {
    listRecentTracesMock.mockReset();
    isLangSmithConfiguredMock.mockReturnValue(true);
    listRecentTracesMock.mockResolvedValue({
      project: "drpe-admin",
      traces: [
        {
          id: "run-1",
          name: "policy-suggest:generate",
          startTime: "2026-07-22T10:00:00.000Z",
          status: "success",
          latencyMs: 1200,
          route: "policy-suggest",
          mode: "generate",
          webSearch: "on",
          langsmithUrl:
            "https://smith.langchain.com/o/default/projects/p/proj-1?peek=run-1&peeked_trace=run-1",
        },
      ],
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns traces when configured", async () => {
    const { GET } = await import("@/app/api/observability/traces/route");
    const res = await GET(
      new Request("http://localhost/api/observability/traces?route=policy-suggest"),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { configured: boolean; traces: unknown[] };
    expect(body.configured).toBe(true);
    expect(body.traces).toHaveLength(1);
    expect(listRecentTracesMock).toHaveBeenCalledWith(
      expect.objectContaining({ route: "policy-suggest" }),
    );
  });

  it("returns 503 when LangSmith is not configured", async () => {
    isLangSmithConfiguredMock.mockReturnValue(false);
    const { GET } = await import("@/app/api/observability/traces/route");
    const res = await GET(new Request("http://localhost/api/observability/traces"));
    expect(res.status).toBe(503);
    expect(listRecentTracesMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid route filter", async () => {
    const { GET } = await import("@/app/api/observability/traces/route");
    const res = await GET(
      new Request("http://localhost/api/observability/traces?route=invalid"),
    );
    expect(res.status).toBe(400);
  });
});
