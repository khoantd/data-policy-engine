import { z } from "zod";

/** Optional catalog system snapshot for AI sample generation (Admin UX). */
export const catalogSystemSnapshotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source_key: z.string().nullable().optional(),
});

export type CatalogSystemSnapshot = z.infer<typeof catalogSystemSnapshotSchema>;

/** Optional catalog process snapshot for AI sample generation (Admin UX). */
export const catalogProcessSnapshotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type CatalogProcessSnapshot = z.infer<
  typeof catalogProcessSnapshotSchema
>;

export function trimSystemForSample(system: {
  id: string;
  name: string;
  source_key?: string | null;
}): CatalogSystemSnapshot {
  const key = system.source_key?.trim() ?? "";
  return {
    id: system.id,
    name: system.name,
    source_key: key.length > 0 ? key : null,
  };
}

export function trimProcessForSample(process: {
  id: string;
  name: string;
}): CatalogProcessSnapshot {
  return { id: process.id, name: process.name };
}

/**
 * Prompt lines describing selected catalog system/process for sample generation.
 * System source_key should drive record.source; process is governance context only.
 */
export function formatCatalogContextForPrompt(input: {
  system?: CatalogSystemSnapshot | null;
  process?: CatalogProcessSnapshot | null;
}): string[] {
  const { system, process } = input;
  if (!system && !process) return [];

  const lines = ["Catalog context (Admin playground — does not change engine matching):"];

  if (system) {
    const key = system.source_key?.trim() || null;
    lines.push(
      `System: ${system.name} (${system.id})`,
      key
        ? `System source_key: ${key} — set record.source to this exact value.`
        : "System has no source_key — choose source from policy scope.sources when restricted, otherwise null.",
    );
  }

  if (process) {
    lines.push(
      `Process: ${process.name} (${process.id})`,
      "Process is governance context only (no source_key). Do not invent a source from the process. You may set context entries such as process_id / process_name when useful.",
    );
  }

  return lines;
}

/** Prefer catalog system source_key over model-chosen source when present. */
export function applyCatalogSourceToRecord<T extends { source?: string | null }>(
  record: T,
  system?: CatalogSystemSnapshot | null,
): T {
  const key = system?.source_key?.trim();
  if (!key) return record;
  return { ...record, source: key };
}
