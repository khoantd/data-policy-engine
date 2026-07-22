import { describe, expect, it } from "vitest";
import type { Run } from "langsmith/schemas";
import {
  buildTraceListFilter,
  sanitizeRunForApi,
} from "@/lib/ai/langsmith-runs";
import { DRPE_METADATA_KEYS } from "@/lib/ai/langsmith";

describe("langsmith-runs", () => {
  it("builds route filter", () => {
    expect(
      buildTraceListFilter({ route: "policy-suggest" }),
    ).toContain("policy-suggest");
  });

  it("combines route and web search filters", () => {
    const filter = buildTraceListFilter({
      route: "evaluate-sample",
      webSearch: "on",
    });
    expect(filter).toContain("evaluate-sample");
    expect(filter).toContain("on");
    expect(filter?.startsWith("and(")).toBe(true);
  });

  it("sanitizes run without inputs or outputs", () => {
    const run = {
      id: "run-1",
      trace_id: "trace-1",
      session_id: "proj-1",
      name: "evaluate-sample:single",
      run_type: "chain",
      start_time: "2026-07-22T10:00:00.000Z",
      end_time: "2026-07-22T10:00:01.000Z",
      inputs: { prompt: "secret prompt" },
      outputs: { text: "secret output" },
      extra: {
        metadata: {
          [DRPE_METADATA_KEYS.route]: "evaluate-sample",
          [DRPE_METADATA_KEYS.mode]: "single",
          user_prompt: "should-not-leak",
        },
      },
    } as Run;

    const summary = sanitizeRunForApi(run);
    expect(summary.id).toBe("run-1");
    expect(summary.route).toBe("evaluate-sample");
    expect(summary.mode).toBe("single");
    expect(summary.langsmithUrl).toContain("projects/p/proj-1");
    expect(summary.langsmithUrl).toContain("peek=run-1");
    expect(summary.langsmithUrl).toContain("peeked_trace=trace-1");
    expect(summary).not.toHaveProperty("inputs");
    expect(summary).not.toHaveProperty("outputs");
    expect(JSON.stringify(summary)).not.toContain("secret");
    expect(JSON.stringify(summary)).not.toContain("should-not-leak");
  });
});
