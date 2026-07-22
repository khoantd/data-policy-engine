import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildLangSmithRunUrl,
  formatLangSmithApiError,
  getLangSmithConfig,
  getLangSmithUiHost,
  isLangSmithConfigured,
  resolveLangSmithWorkspaceId,
} from "@/lib/ai/langsmith";

describe("langsmith config", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    vi.resetModules();
  });

  it("returns null when tracing is disabled", () => {
    process.env.LANGSMITH_TRACING = "false";
    process.env.LANGSMITH_API_KEY = "test-key";
    expect(getLangSmithConfig()).toBeNull();
    expect(isLangSmithConfigured()).toBe(false);
  });

  it("returns config when tracing and api key are set", () => {
    process.env.LANGSMITH_TRACING = "true";
    process.env.LANGSMITH_API_KEY = "test-key";
    process.env.LANGSMITH_PROJECT = "drpe-test";
    process.env.LANGSMITH_PROJECT_ID = "proj-123";
    process.env.LANGSMITH_WORKSPACE_ID = "ws-123";
    process.env.LANGSMITH_TENANT_ID = "tenant-123";
    const config = getLangSmithConfig();
    expect(config).toEqual({
      enabled: true,
      apiKey: "test-key",
      project: "drpe-test",
      projectId: "proj-123",
      endpoint: "https://api.smith.langchain.com",
      workspaceId: "ws-123",
      tenantId: "tenant-123",
    });
    expect(isLangSmithConfigured()).toBe(true);
  });

  it("builds run url with tenant id, project id, and peek params", () => {
    process.env.LANGSMITH_TRACING = "true";
    process.env.LANGSMITH_API_KEY = "test-key";
    process.env.LANGSMITH_TENANT_ID = "tenant-123";
    process.env.LANGSMITH_ENDPOINT = "https://api.smith.langchain.com";
    expect(
      buildLangSmithRunUrl({
        runId: "run-123",
        traceId: "trace-456",
        projectId: "proj-789",
      }),
    ).toBe(
      "https://smith.langchain.com/o/tenant-123/projects/p/proj-789?peek=run-123&peeked_trace=trace-456",
    );
  });

  it("maps regional api host to ui host", () => {
    process.env.LANGSMITH_ENDPOINT = "https://apac.api.smith.langchain.com";
    expect(getLangSmithUiHost()).toBe("https://apac.smith.langchain.com");
  });

  it("uses workspace id only for service keys", () => {
    const service = resolveLangSmithWorkspaceId({
      enabled: true,
      apiKey: "lsv2_sk_test",
      project: "drpe",
      endpoint: "https://api.smith.langchain.com",
      workspaceId: "ws-123",
    });
    const personal = resolveLangSmithWorkspaceId({
      enabled: true,
      apiKey: "lsv2_pt_test",
      project: "drpe",
      endpoint: "https://api.smith.langchain.com",
      workspaceId: "ws-123",
    });
    expect(service).toBe("ws-123");
    expect(personal).toBeUndefined();
  });

  it("adds setup hints for service-key 403 errors", () => {
    process.env.LANGSMITH_TRACING = "true";
    process.env.LANGSMITH_API_KEY = "lsv2_sk_test";
    delete process.env.LANGSMITH_WORKSPACE_ID;
    const message = formatLangSmithApiError(
      new Error(
        "Failed to fetch /sessions. Received status [403]: Forbidden. Message:",
      ),
    );
    expect(message).toContain("LANGSMITH_WORKSPACE_ID");
    expect(message).toContain("LANGSMITH_ENDPOINT");
  });
});
