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

const generateObjectMock = vi.fn();
const scheduleTraceFlushMock = vi.fn();

vi.mock("@/lib/ai/traced-ai", () => ({
  getTracedAI: () => ({
    generateObject: (...args: unknown[]) => generateObjectMock(...args),
    client: { id: "mock-client" },
  }),
  buildTraceContext: vi.fn(() => ({
    providerOptions: { langsmith: { name: "evaluate-sample:single" } },
  })),
  scheduleTraceFlush: (...args: unknown[]) => scheduleTraceFlushMock(...args),
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => ({
    chat: (model: string) => ({ modelId: model }),
  }),
}));

vi.mock("@/lib/ai/privalyse", () => ({
  resolvePrivacyHeader: vi.fn(async () => "skipped"),
}));

vi.mock("@/lib/ai/mask-for-llm", () => ({
  prepareLlmPrompt: vi.fn(async () => null),
  finalizeLlmObject: vi.fn(async (obj: unknown) => obj),
}));

const samplePolicy = {
  id: "pol_gdpr_customer",
  jurisdiction: "EU_GDPR",
  scope: { data_types: ["customer_profile"], sources: ["crm_system"] },
  rules: [
    {
      id: "rule_inactive_delete",
      priority: 100,
      action: "delete",
      condition: { all: [] },
    },
  ],
};

describe("POST /api/ai/evaluate-sample", () => {
  beforeEach(() => {
    generateObjectMock.mockReset();
    scheduleTraceFlushMock.mockReset();
    generateObjectMock.mockResolvedValue({
      object: {
        record: {
          data_type: "customer_profile",
          record_id: "cust_sample_001",
          metadata: [{ key: "status", value: "inactive" }],
          source: null,
          jurisdiction: "EU_GDPR",
          context: null,
        },
      },
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns single record when body is valid", async () => {
    const { POST } = await import("@/app/api/ai/evaluate-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/evaluate-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "single", policy: samplePolicy }),
      }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      record: { record_id: string; metadata: Record<string, unknown> };
    };
    expect(body.record.record_id).toBe("cust_sample_001");
    expect(body.record.metadata).toEqual({ status: "inactive" });
    expect(res.headers.get("X-DRPE-AI-Privacy")).toBe("skipped");
    expect(generateObjectMock).toHaveBeenCalledOnce();
    expect(scheduleTraceFlushMock).toHaveBeenCalledOnce();
    const call = generateObjectMock.mock.calls[0]?.[0] as {
      providerOptions?: { langsmith?: { name?: string } };
    };
    expect(call.providerOptions?.langsmith?.name).toBe("evaluate-sample:single");
  });

  it("uses batch schema for batch mode", async () => {
    generateObjectMock.mockResolvedValue({
      object: {
        records: [
          {
            data_type: "customer_profile",
            record_id: "a",
            metadata: [{ key: "status", value: "inactive" }],
            source: null,
            jurisdiction: null,
            context: null,
          },
          {
            data_type: "customer_profile",
            record_id: "b",
            metadata: [{ key: "status", value: "active" }],
            source: null,
            jurisdiction: null,
            context: null,
          },
        ],
      },
    });
    const { POST } = await import("@/app/api/ai/evaluate-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/evaluate-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "batch", policy: samplePolicy }),
      }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { records: unknown[] };
    expect(body.records).toHaveLength(2);
    const call = generateObjectMock.mock.calls[0]?.[0] as {
      prompt?: string;
    };
    expect(call.prompt).toContain("Generate 2–5 distinct records");
  });

  it("forces source from catalog system source_key", async () => {
    const { POST } = await import("@/app/api/ai/evaluate-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/evaluate-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          policy: samplePolicy,
          system: {
            id: "sys_crm",
            name: "CRM",
            source_key: "crm_system",
          },
          process: { id: "proc_a", name: "Onboarding" },
        }),
      }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { record: { source: string | null } };
    expect(body.record.source).toBe("crm_system");
    const call = generateObjectMock.mock.calls[0]?.[0] as { prompt?: string };
    expect(call.prompt).toContain("crm_system");
    expect(call.prompt).toContain("Onboarding");
  });

  it("returns 400 for invalid body", async () => {
    const { POST } = await import("@/app/api/ai/evaluate-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/evaluate-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "single", policy: { id: "x" } }),
      }),
    );
    expect(res.status).toBe(400);
    expect(generateObjectMock).not.toHaveBeenCalled();
  });
});
