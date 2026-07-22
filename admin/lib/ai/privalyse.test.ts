import { afterEach, describe, expect, it, vi } from "vitest";

const drpeFetchMock = vi.fn();

vi.mock("@/lib/drpe-client", () => ({
  drpeFetch: (...args: unknown[]) => drpeFetchMock(...args),
}));

describe("privalyse client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    drpeFetchMock.mockReset();
  });

  it("reports disabled when PRIVACY_MASK_ENABLED is false", async () => {
    vi.stubEnv("PRIVACY_MASK_ENABLED", "false");
    const { getPrivacyStatus } = await import("@/lib/ai/privalyse");
    const status = await getPrivacyStatus();
    expect(status.available).toBe(false);
    expect(status.enabled).toBe(false);
    expect(drpeFetchMock).not.toHaveBeenCalled();
  });

  it("fetches privacy status from FastAPI", async () => {
    vi.stubEnv("PRIVACY_MASK_ENABLED", "true");
    drpeFetchMock.mockResolvedValue({
      available: true,
      enabled: true,
      model_size: "sm",
      languages: ["en"],
    });
    const { getPrivacyStatus } = await import("@/lib/ai/privalyse");
    const status = await getPrivacyStatus();
    expect(status.available).toBe(true);
    expect(drpeFetchMock).toHaveBeenCalledWith("/privacy/status");
  });

  it("masks text via FastAPI", async () => {
    vi.stubEnv("PRIVACY_MASK_ENABLED", "true");
    drpeFetchMock.mockResolvedValue({
      masked_text: "Contact {Email_1}",
      mapping_token: "tok_abc",
      entity_count: 1,
    });
    const { maskForLlm } = await import("@/lib/ai/privalyse");
    const result = await maskForLlm("Contact sarah@example.com");
    expect(result?.masked_text).toBe("Contact {Email_1}");
    expect(drpeFetchMock).toHaveBeenCalledWith("/privacy/mask", {
      method: "POST",
      body: JSON.stringify({ text: "Contact sarah@example.com" }),
    });
  });
});
