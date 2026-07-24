import { z } from "zod";
import {
  catalogProcessSnapshotSchema,
  catalogSystemSnapshotSchema,
} from "@/lib/ai/catalog-sample-context";

export const EVALUATE_SAMPLE_SCENARIOS = [
  "auto",
  "delete",
  "retain",
  "archive",
  "legal_hold",
] as const;

export type EvaluateSampleScenario = (typeof EVALUATE_SAMPLE_SCENARIOS)[number];

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
 * Record shape sent to OpenAI structured output.
 * Uses key/value entries instead of free-form objects so the JSON Schema
 * stays strict-mode compatible (no propertyNames, all keys required).
 */
export const evaluateSampleRecordAiSchema = z.object({
  data_type: z.string().min(1),
  record_id: z.string().min(1),
  metadata: z.array(metadataEntrySchema).min(1),
  source: z.string().nullable(),
  jurisdiction: z.string().nullable(),
  context: z.array(metadataEntrySchema).nullable(),
});

export type EvaluateSampleRecordAi = z.infer<typeof evaluateSampleRecordAiSchema>;

export type EvaluateSampleRecord = {
  data_type: string;
  record_id: string;
  metadata: Record<string, unknown>;
  source?: string | null;
  jurisdiction?: string | null;
  context?: Record<string, unknown> | null;
};

export function entriesToRecordObject(
  entries: Array<{ key: string; value: unknown }>,
): Record<string, unknown> {
  return Object.fromEntries(entries.map(({ key, value }) => [key, value]));
}

export function normalizeEvaluateSampleRecord(
  ai: EvaluateSampleRecordAi,
): EvaluateSampleRecord {
  return {
    data_type: ai.data_type,
    record_id: ai.record_id,
    metadata: entriesToRecordObject(ai.metadata),
    source: ai.source,
    jurisdiction: ai.jurisdiction,
    context: ai.context ? entriesToRecordObject(ai.context) : null,
  };
}

const policyRuleSnapshotSchema = z.object({
  id: z.string().min(1),
  description: z.string().nullable().optional(),
  priority: z.number(),
  action: z.string().min(1),
  condition: z.unknown(),
});

export const evaluateSamplePolicySnapshotSchema = z.object({
  id: z.string().min(1),
  jurisdiction: z.string().min(1),
  scope: z
    .object({
      data_types: z.array(z.string()).optional(),
      sources: z.array(z.string()).optional(),
    })
    .optional(),
  rules: z.array(policyRuleSnapshotSchema).min(1),
});

export type EvaluateSamplePolicySnapshot = z.infer<
  typeof evaluateSamplePolicySnapshotSchema
>;

export const evaluateSampleBodySchema = z.object({
  mode: z.enum(["single", "batch"]),
  scenario: z.enum(EVALUATE_SAMPLE_SCENARIOS).default("auto"),
  policy: evaluateSamplePolicySnapshotSchema,
  system: catalogSystemSnapshotSchema.optional().nullable(),
  process: catalogProcessSnapshotSchema.optional().nullable(),
});

export type EvaluateSampleBody = z.infer<typeof evaluateSampleBodySchema>;

export const evaluateSampleSingleOutputSchema = z.object({
  record: evaluateSampleRecordAiSchema,
});

export const evaluateSampleBatchOutputSchema = z.object({
  records: z.array(evaluateSampleRecordAiSchema).min(2).max(5),
});
