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
    providerOptions: { langsmith: { name: "classify-sample:single" } },
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
  id: "pol_gdpr_pii_detect",
  jurisdiction: "EU_GDPR",
  scope: { data_types: ["customer_profile"], sources: ["crm_system"] },
  text_fields: ["note"],
  entities: [
    {
      id: "ent_email",
      label: "Email address",
      classification: "PII",
      sensitivity: "medium",
      detection: {
        field_names: ["email"],
        regex: null,
        ner_types: ["EMAIL"],
      },
    },
  ],
};

describe("POST /api/ai/classify-sample", () => {
  beforeEach(() => {
    generateObjectMock.mockReset();
    scheduleTraceFlushMock.mockReset();
    generateObjectMock.mockResolvedValue({
      object: {
        record: {
          data_type: "customer_profile",
          record_id: "cust_scan_ai_001",
          metadata: [{ key: "email", value: "ada.lovelace@example.com" }],
          source: "crm_system",
          jurisdiction: "EU_GDPR",
        },
      },
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns a single synthetic record when body is valid", async () => {
    const { POST } = await import("@/app/api/ai/classify-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/classify-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy: samplePolicy }),
      }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      record: { record_id: string; metadata: Record<string, unknown> };
    };
    expect(body.record.record_id).toBe("cust_scan_ai_001");
    expect(body.record.metadata).toEqual({
      email: "ada.lovelace@example.com",
    });
    expect(res.headers.get("X-DRPE-AI-Privacy")).toBe("skipped");
    expect(generateObjectMock).toHaveBeenCalledOnce();
    expect(scheduleTraceFlushMock).toHaveBeenCalledOnce();
    const call = generateObjectMock.mock.calls[0]?.[0] as {
      providerOptions?: { langsmith?: { name?: string } };
      prompt?: string;
    };
    expect(call.providerOptions?.langsmith?.name).toBe(
      "classify-sample:single",
    );
    expect(call.prompt).toContain("Target classification policy id");
  });

  it("returns 400 for invalid body", async () => {
    const { POST } = await import("@/app/api/ai/classify-sample/route");
    const res = await POST(
      new Request("http://localhost/api/ai/classify-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy: { id: "x" } }),
      }),
    );
    expect(res.status).toBe(400);
    expect(generateObjectMock).not.toHaveBeenCalled();
  });
});
