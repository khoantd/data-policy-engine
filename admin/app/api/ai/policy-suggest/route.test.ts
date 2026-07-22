import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  getApiKey: vi.fn(async () => ""),
}));

vi.mock("@/lib/ai/litellm", () => ({
  getLiteLLMConfig: vi.fn(() => ({
    baseURL: "https://litellm.test/v1",
    apiKey: "test-key",
    model: "test-model",
  })),
}));

const searchPolicyReferencesMock = vi.fn();
const isTavilyConfiguredMock = vi.fn(() => true);

vi.mock("@/lib/ai/tavily", () => ({
  isTavilyConfigured: () => isTavilyConfiguredMock(),
  searchPolicyReferences: (...args: unknown[]) =>
    searchPolicyReferencesMock(...args),
  searchRetentionReferences: (...args: unknown[]) =>
    searchPolicyReferencesMock(...args),
}));

vi.mock("@/lib/ai/privalyse", () => ({
  resolvePrivacyHeader: vi.fn(async () => "skipped"),
}));

vi.mock("@/lib/ai/mask-for-llm", () => ({
  prepareLlmPrompt: vi.fn(async () => null),
  maskLlmText: vi.fn(async () => null),
  streamUnmaskDeltas: vi.fn(async function* () {
    yield "policy:\n";
    yield "  id: pol_streamed\n";
  }),
}));

async function* textStream() {
  yield "policy:\n";
  yield "  id: pol_streamed\n";
}

const streamTextMock = vi.fn();
const flushTracesMock = vi.fn(async () => undefined);

vi.mock("@/lib/ai/traced-ai", () => ({
  getTracedAI: () => ({
    streamText: (...args: unknown[]) => streamTextMock(...args),
    client: { id: "mock-client" },
  }),
  buildTraceContext: vi.fn(() => ({
    providerOptions: { langsmith: { name: "policy-suggest:generate" } },
  })),
  flushTraces: () => flushTracesMock(),
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => ({
    chat: (model: string) => ({ modelId: model }),
  }),
}));

function parseNdjson(body: string) {
  return body
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { event: string; [key: string]: unknown });
}

describe("POST /api/ai/policy-suggest", () => {
  beforeEach(() => {
    streamTextMock.mockReset();
    flushTracesMock.mockReset();
    searchPolicyReferencesMock.mockReset();
    isTavilyConfiguredMock.mockReturnValue(true);
    streamTextMock.mockReturnValue({ textStream: textStream() });
    searchPolicyReferencesMock.mockResolvedValue([
      {
        id: 1,
        title: "GDPR retention",
        url: "https://gdpr.eu/retention",
        snippet: "Storage limitation.",
        domain: "gdpr.eu",
      },
    ]);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("streams NDJSON with sources and YAML text", async () => {
    const { POST } = await import("@/app/api/ai/policy-suggest/route");
    const res = await POST(
      new Request("http://localhost/api/ai/policy-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          description: "Retain financial records for 7 years",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/x-ndjson");
    expect(res.headers.get("X-DRPE-AI-Web-Search")).toBe("on");
    expect(res.headers.get("X-DRPE-AI-Privacy")).toBe("skipped");

    const body = await res.text();
    const events = parseNdjson(body);
    expect(events.some((e) => e.event === "source")).toBe(true);
    expect(events.some((e) => e.event === "text")).toBe(true);
    expect(events.some((e) => e.event === "done")).toBe(true);
    const text = events
      .filter((e) => e.event === "text")
      .map((e) => e.delta as string)
      .join("");
    expect(text).toContain("pol_streamed");
    expect(streamTextMock).toHaveBeenCalledOnce();
    expect(flushTracesMock).toHaveBeenCalledOnce();
    const call = streamTextMock.mock.calls[0]?.[0] as {
      system?: string;
      providerOptions?: { langsmith?: { name?: string } };
    };
    expect(call.system).toContain("DATA_RETENTION_POLICY_MASTERY");
    expect(call.system).toContain("WEB_RESEARCH_SOURCES");
    expect(call.providerOptions?.langsmith?.name).toBe("policy-suggest:generate");
  });

  it("passes jurisdiction and industry hints into system prompt", async () => {
    const { POST } = await import("@/app/api/ai/policy-suggest/route");
    const res = await POST(
      new Request("http://localhost/api/ai/policy-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          description: "Healthcare patient records retention",
          jurisdiction: "EU_GDPR",
          industry: "healthcare",
        }),
      }),
    );
    await res.text();
    const call = streamTextMock.mock.calls[0]?.[0] as { system?: string };
    expect(call.system).toContain("EU_GDPR focus");
    expect(call.system).toContain("Industry: Healthcare");
  });

  it("skips Tavily when webSearch is false", async () => {
    const { POST } = await import("@/app/api/ai/policy-suggest/route");
    const res = await POST(
      new Request("http://localhost/api/ai/policy-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          description: "Retain financial records for 7 years",
          webSearch: false,
        }),
      }),
    );
    expect(res.headers.get("X-DRPE-AI-Web-Search")).toBe("skipped");
    expect(searchPolicyReferencesMock).not.toHaveBeenCalled();
    const call = streamTextMock.mock.calls[0]?.[0] as { system?: string };
    expect(call.system).not.toContain("WEB_RESEARCH_SOURCES");
  });

  it("returns 400 for invalid generate body", async () => {
    const { POST } = await import("@/app/api/ai/policy-suggest/route");
    const res = await POST(
      new Request("http://localhost/api/ai/policy-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "generate", description: "" }),
      }),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/description/i);
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});
