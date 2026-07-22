import { describe, expect, it, vi } from "vitest";

const maskForLlmMock = vi.fn();
const unmaskFromLlmMock = vi.fn();

vi.mock("@/lib/ai/privalyse", () => ({
  maskForLlm: (...args: unknown[]) => maskForLlmMock(...args),
  unmaskFromLlm: (...args: unknown[]) => unmaskFromLlmMock(...args),
}));

describe("mask-for-llm", () => {
  it("prepareLlmPrompt returns null when mask fails", async () => {
    maskForLlmMock.mockResolvedValue(null);
    const { prepareLlmPrompt } = await import("@/lib/ai/mask-for-llm");
    const result = await prepareLlmPrompt(["hello"]);
    expect(result).toBeNull();
  });

  it("prepareLlmPrompt joins parts and masks", async () => {
    maskForLlmMock.mockResolvedValue({
      masked_text: "masked",
      mapping_token: "tok",
      entity_count: 2,
    });
    const { prepareLlmPrompt } = await import("@/lib/ai/mask-for-llm");
    const result = await prepareLlmPrompt(["part one", "part two"]);
    expect(result).toEqual({
      maskedText: "masked",
      mappingToken: "tok",
      entityCount: 2,
    });
    expect(maskForLlmMock).toHaveBeenCalledWith("part one\n\npart two");
  });

  it("streamUnmaskDeltas emits suffix deltas", async () => {
    unmaskFromLlmMock
      .mockResolvedValueOnce("Hello")
      .mockResolvedValueOnce("Hello world")
      .mockResolvedValueOnce("Hello world");

    async function* chunks() {
      yield "Hello";
      yield " world";
    }

    const { streamUnmaskDeltas } = await import("@/lib/ai/mask-for-llm");
    const deltas: string[] = [];
    for await (const delta of streamUnmaskDeltas(chunks(), "tok")) {
      deltas.push(delta);
    }
    expect(deltas).toEqual(["Hello", " world"]);
    expect(unmaskFromLlmMock).toHaveBeenLastCalledWith(
      "Hello world",
      "tok",
      true,
    );
  });

  it("finalizeLlmObject unmasks JSON", async () => {
    unmaskFromLlmMock.mockResolvedValue(
      JSON.stringify({ record: { record_id: "cust_real" } }),
    );
    const { finalizeLlmObject } = await import("@/lib/ai/mask-for-llm");
    const result = await finalizeLlmObject(
      { record: { record_id: "{Name_1}" } },
      "tok",
    );
    expect(result).toEqual({ record: { record_id: "cust_real" } });
  });
});
