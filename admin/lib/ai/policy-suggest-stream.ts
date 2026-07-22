import type { WebSearchSource } from "@/lib/ai/tavily";

export type PolicySuggestStreamEvent =
  | { event: "status"; message: string }
  | { event: "privacy"; entityCount: number }
  | { event: "source"; id: number; title: string; url: string; snippet: string; domain: string }
  | { event: "text"; delta: string }
  | { event: "error"; message: string }
  | { event: "done" };

export function encodePolicySuggestEvent(
  event: PolicySuggestStreamEvent,
): string {
  return `${JSON.stringify(event)}\n`;
}

export function parsePolicySuggestLine(
  line: string,
): PolicySuggestStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as PolicySuggestStreamEvent;
    if (!parsed || typeof parsed !== "object" || !("event" in parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export type PolicySuggestStreamAccumulator = {
  text: string;
  sources: WebSearchSource[];
  error: string | null;
  done: boolean;
};

export function createStreamAccumulator(): PolicySuggestStreamAccumulator {
  return { text: "", sources: [], error: null, done: false };
}

export function applyPolicySuggestEvent(
  acc: PolicySuggestStreamAccumulator,
  event: PolicySuggestStreamEvent,
): PolicySuggestStreamAccumulator {
  switch (event.event) {
    case "text":
      return { ...acc, text: acc.text + event.delta };
    case "source":
      return {
        ...acc,
        sources: [
          ...acc.sources,
          {
            id: event.id,
            title: event.title,
            url: event.url,
            snippet: event.snippet,
            domain: event.domain,
          },
        ],
      };
    case "error":
      return { ...acc, error: event.message };
    case "done":
      return { ...acc, done: true };
    default:
      return acc;
  }
}

export function sourceToStreamEvent(
  source: WebSearchSource,
): PolicySuggestStreamEvent {
  return {
    event: "source",
    id: source.id,
    title: source.title,
    url: source.url,
    snippet: source.snippet,
    domain: source.domain,
  };
}

/**
 * Parse NDJSON buffer, returning parsed events and any remaining partial line.
 */
export function parsePolicySuggestBuffer(buffer: string): {
  events: PolicySuggestStreamEvent[];
  remainder: string;
} {
  const lines = buffer.split("\n");
  const remainder = lines.pop() ?? "";
  const events: PolicySuggestStreamEvent[] = [];
  for (const line of lines) {
    const event = parsePolicySuggestLine(line);
    if (event) events.push(event);
  }
  return { events, remainder };
}
