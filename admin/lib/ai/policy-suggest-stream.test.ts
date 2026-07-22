import { describe, expect, it } from "vitest";
import {
  applyPolicySuggestEvent,
  createStreamAccumulator,
  encodePolicySuggestEvent,
  parsePolicySuggestBuffer,
  parsePolicySuggestLine,
  sourceToStreamEvent,
} from "@/lib/ai/policy-suggest-stream";

describe("policy-suggest-stream", () => {
  it("encodes and parses status events", () => {
    const line = encodePolicySuggestEvent({
      event: "status",
      message: "Searching references…",
    });
    const parsed = parsePolicySuggestLine(line);
    expect(parsed).toEqual({
      event: "status",
      message: "Searching references…",
    });
  });

  it("round-trips source events", () => {
    const source = {
      id: 1,
      title: "GDPR",
      url: "https://gdpr.eu",
      snippet: "Retention rules",
      domain: "gdpr.eu",
    };
    const line = encodePolicySuggestEvent(sourceToStreamEvent(source));
    const parsed = parsePolicySuggestLine(line);
    expect(parsed?.event).toBe("source");
    if (parsed?.event === "source") {
      expect(parsed.title).toBe("GDPR");
      expect(parsed.url).toBe("https://gdpr.eu");
    }
  });

  it("accumulates text and sources from events", () => {
    let acc = createStreamAccumulator();
    acc = applyPolicySuggestEvent(acc, {
      event: "source",
      id: 1,
      title: "A",
      url: "https://a.test",
      snippet: "s",
      domain: "a.test",
    });
    acc = applyPolicySuggestEvent(acc, { event: "text", delta: "policy:\n" });
    acc = applyPolicySuggestEvent(acc, { event: "text", delta: "  id: x" });
    acc = applyPolicySuggestEvent(acc, { event: "done" });
    expect(acc.sources).toHaveLength(1);
    expect(acc.text).toBe("policy:\n  id: x");
    expect(acc.done).toBe(true);
  });

  it("parses buffer with partial line remainder", () => {
    const chunk =
      encodePolicySuggestEvent({ event: "status", message: "a" }) +
      encodePolicySuggestEvent({ event: "text", delta: "y" }).slice(0, 5);
    const { events, remainder } = parsePolicySuggestBuffer(chunk);
    expect(events).toHaveLength(1);
    expect(events[0]?.event).toBe("status");
    expect(remainder.length).toBeGreaterThan(0);
  });
});
