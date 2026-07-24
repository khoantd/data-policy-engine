import { z } from "zod";
import {
  catalogProcessSnapshotSchema,
  catalogSystemSnapshotSchema,
} from "@/lib/ai/catalog-sample-context";
import { entriesToRecordObject } from "@/lib/ai/evaluate-sample-schema";

export const CLASSIFY_SAMPLE_SCENARIOS = [
  "auto",
  "pii",
  "spii",
  "mixed",
  "clean",
] as const;

export type ClassifySampleScenario = (typeof CLASSIFY_SAMPLE_SCENARIOS)[number];

const metadataValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const metadataEntrySchema = z.object({
  key: z.string().min(1),
  value: metadataValueSchema,
});

/**
 * Record shape for OpenAI structured output.
 * Uses key/value entries so the JSON Schema stays strict-mode compatible.
 */
export const classifySampleRecordAiSchema = z.object({
  data_type: z.string().min(1),
  record_id: z.string().min(1),
  metadata: z.array(metadataEntrySchema).min(1),
  source: z.string().nullable(),
  jurisdiction: z.string().nullable(),
});

export type ClassifySampleRecordAi = z.infer<typeof classifySampleRecordAiSchema>;

export type ClassifySampleRecord = {
  data_type: string;
  record_id: string;
  metadata: Record<string, unknown>;
  source?: string | null;
  jurisdiction?: string | null;
};

export function normalizeClassifySampleRecord(
  ai: ClassifySampleRecordAi,
): ClassifySampleRecord {
  return {
    data_type: ai.data_type,
    record_id: ai.record_id,
    metadata: entriesToRecordObject(ai.metadata),
    source: ai.source,
    jurisdiction: ai.jurisdiction,
  };
}

const entityDetectionSnapshotSchema = z.object({
  field_names: z.array(z.string()).optional(),
  regex: z.string().nullable().optional(),
  ner_types: z.array(z.string()).optional(),
});

const entitySnapshotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  classification: z.string().min(1),
  sensitivity: z.string().min(1),
  detection: entityDetectionSnapshotSchema.nullable().optional(),
});

export const classifySamplePolicySnapshotSchema = z.object({
  id: z.string().min(1),
  jurisdiction: z.string().min(1),
  scope: z
    .object({
      data_types: z.array(z.string()).optional(),
      sources: z.array(z.string()).optional(),
    })
    .optional(),
  text_fields: z.array(z.string()).optional(),
  entities: z.array(entitySnapshotSchema).min(1),
});

export type ClassifySamplePolicySnapshot = z.infer<
  typeof classifySamplePolicySnapshotSchema
>;

export const classifySampleBodySchema = z.object({
  scenario: z.enum(CLASSIFY_SAMPLE_SCENARIOS).default("auto"),
  policy: classifySamplePolicySnapshotSchema,
  system: catalogSystemSnapshotSchema.optional().nullable(),
  process: catalogProcessSnapshotSchema.optional().nullable(),
});

export type ClassifySampleBody = z.infer<typeof classifySampleBodySchema>;

export const classifySampleOutputSchema = z.object({
  record: classifySampleRecordAiSchema,
});
