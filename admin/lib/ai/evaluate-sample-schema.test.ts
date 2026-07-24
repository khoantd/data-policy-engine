import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  evaluateSampleBodySchema,
  evaluateSampleBatchOutputSchema,
  evaluateSampleSingleOutputSchema,
  normalizeEvaluateSampleRecord,
} from "@/lib/ai/evaluate-sample-schema";

const samplePolicy = {
  id: "pol_gdpr_customer",
  jurisdiction: "EU_GDPR",
  scope: { data_types: ["customer_profile"], sources: ["crm_system"] },
  rules: [
    {
      id: "rule_inactive_delete",
      priority: 100,
      action: "delete",
      condition: {
        all: [
          { field: "status", operator: "eq", value: "inactive" },
          { field: "last_activity_at", operator: "older_than", value: "730d" },
        ],
      },
    },
  ],
};

const aiRecord = {
  data_type: "customer_profile",
  record_id: "cust_sample_001",
  metadata: [{ key: "status", value: "inactive" }],
  source: "crm_system",
  jurisdiction: "EU_GDPR",
  context: null,
};

function assertOpenAiStructuredOutputCompatible(schema: z.ZodType) {
  const jsonSchema = z.toJSONSchema(schema, {
    target: "draft-7",
    io: "input",
  });
  expect(JSON.stringify(jsonSchema)).not.toContain("propertyNames");

  function visit(node: unknown, path: string) {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    if (obj.type === "object" && obj.properties) {
      const keys = Object.keys(obj.properties as Record<string, unknown>);
      const required = (obj.required as string[] | undefined) ?? [];
      expect(required.sort(), `${path} required`).toEqual(keys.sort());
      for (const key of keys) {
        visit((obj.properties as Record<string, unknown>)[key], `${path}.${key}`);
      }
    }
    if (Array.isArray(obj.anyOf)) {
      obj.anyOf.forEach((child, index) => visit(child, `${path}.anyOf[${index}]`));
    }
    if (obj.items) visit(obj.items, `${path}.items`);
  }

  visit(jsonSchema, "root");
}

describe("evaluateSampleBodySchema", () => {
  it("accepts valid single-mode body", () => {
    const result = evaluateSampleBodySchema.safeParse({
      mode: "single",
      policy: samplePolicy,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scenario).toBe("auto");
    }
  });

  it("rejects missing policy rules", () => {
    const result = evaluateSampleBodySchema.safeParse({
      mode: "single",
      policy: { id: "pol_x", jurisdiction: "EU_GDPR", rules: [] },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid scenario", () => {
    const result = evaluateSampleBodySchema.safeParse({
      mode: "batch",
      scenario: "unknown",
      policy: samplePolicy,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional system and process catalog snapshots", () => {
    const result = evaluateSampleBodySchema.safeParse({
      mode: "single",
      policy: samplePolicy,
      system: {
        id: "sys_crm",
        name: "CRM",
        source_key: "crm_system",
      },
      process: { id: "proc_a", name: "Onboarding" },
    });
    expect(result.success).toBe(true);
  });
});

describe("evaluateSample output schemas", () => {
  it("serializes for OpenAI structured output (draft-7 input)", () => {
    assertOpenAiStructuredOutputCompatible(evaluateSampleSingleOutputSchema);
    assertOpenAiStructuredOutputCompatible(evaluateSampleBatchOutputSchema);
  });

  it("accepts single record output", () => {
    const result = evaluateSampleSingleOutputSchema.safeParse({
      record: aiRecord,
    });
    expect(result.success).toBe(true);
  });

  it("normalizes AI record entries into metadata objects", () => {
    expect(normalizeEvaluateSampleRecord(aiRecord)).toEqual({
      data_type: "customer_profile",
      record_id: "cust_sample_001",
      metadata: { status: "inactive" },
      source: "crm_system",
      jurisdiction: "EU_GDPR",
      context: null,
    });
  });

  it("accepts batch output with 2–5 records", () => {
    const result = evaluateSampleBatchOutputSchema.safeParse({
      records: [aiRecord, { ...aiRecord, record_id: "cust_sample_002" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects batch with fewer than 2 records", () => {
    const result = evaluateSampleBatchOutputSchema.safeParse({
      records: [aiRecord],
    });
    expect(result.success).toBe(false);
  });
});
