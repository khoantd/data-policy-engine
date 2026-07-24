import type { ReferenceSource } from "@/lib/types";

/** Parse and sanitize AI reference sources from a form JSON field. */
export function parseReferenceSources(
  raw: FormDataEntryValue | null | undefined,
): ReferenceSource[] {
  if (raw == null || raw === "") return [];
  try {
    const parsed = JSON.parse(String(raw)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          !!item && typeof item === "object",
      )
      .filter(
        (item) =>
          typeof item.id === "number" &&
          typeof item.title === "string" &&
          typeof item.url === "string" &&
          item.url.startsWith("https://"),
      )
      .map((item) => ({
        id: item.id as number,
        title: item.title as string,
        url: item.url as string,
        snippet: typeof item.snippet === "string" ? item.snippet : "",
        domain: typeof item.domain === "string" ? item.domain : "",
      }));
  } catch {
    return [];
  }
}

/** Strip provenance metadata so Monaco YAML stays DSL-only. */
export function policyForYamlDump<T extends { reference_sources?: unknown }>(
  policy: T,
): Omit<T, "reference_sources"> {
  const { reference_sources: _omit, ...rest } = policy;
  return rest;
}
