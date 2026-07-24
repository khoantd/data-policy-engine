/** Catalog system → evaluate/classify request source bridging (Admin UX only). */

export const MISSING_SOURCE_KEY_WARNING =
  "This system has no source key. Set one on the system detail page to map it into evaluate/scan scope, or enter a source manually.";

export type SystemSourceInput = {
  id: string;
  name: string;
  source_key?: string | null;
};

export type SystemSourceResolution = {
  source: string | null;
  warning?: string;
};

export type SystemRequestFields = {
  source: string;
  sourceSynced: boolean;
  warning?: string;
};

function trimmedSourceKey(system: SystemSourceInput): string | null {
  const key = system.source_key?.trim() ?? "";
  return key.length > 0 ? key : null;
}

export function resolveSystemSource(
  system: SystemSourceInput,
): SystemSourceResolution {
  const source = trimmedSourceKey(system);
  if (source) return { source };
  return { source: null, warning: MISSING_SOURCE_KEY_WARNING };
}

export function applySystemToRequestFields(
  system: SystemSourceInput,
): SystemRequestFields {
  const resolved = resolveSystemSource(system);
  if (resolved.source) {
    return { source: resolved.source, sourceSynced: true };
  }
  return {
    source: "",
    sourceSynced: false,
    warning: resolved.warning,
  };
}

export function findCatalogById<T extends { id: string }>(
  items: T[],
  id: string | null | undefined,
): T | null {
  if (!id) return null;
  return items.find((item) => item.id === id) ?? null;
}

export function findSystemById<T extends { id: string }>(
  systems: T[],
  systemId: string | null | undefined,
): T | null {
  return findCatalogById(systems, systemId);
}

export const findProcessById = findCatalogById;

export function parseCatalogSearchParam(
  value: string | string[] | null | undefined,
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const parseSystemSearchParam = parseCatalogSearchParam;
export const parseProcessSearchParam = parseCatalogSearchParam;

export function systemPlaygroundHref(
  path: "/evaluate" | "/classify",
  systemId: string,
): string {
  return `${path}?system=${encodeURIComponent(systemId)}`;
}

export function processPlaygroundHref(
  path: "/evaluate" | "/classify",
  processId: string,
): string {
  return `${path}?process=${encodeURIComponent(processId)}`;
}

export function isGovernanceLinkedPolicy(
  linkedPolicyIds: string[],
  policyId: string,
): boolean {
  if (!policyId || linkedPolicyIds.length === 0) return false;
  return linkedPolicyIds.includes(policyId);
}
