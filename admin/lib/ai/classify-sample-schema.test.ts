import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  classifySampleBodySchema,
  classifySampleOutputSchema,
  normalizeClassifySampleRecord,
} from "@/lib/ai/classify-sample-schema";

const samplePolicy = {
  id: "pol_gdpr_pii_detect",
  jurisdiction: "EU_GDPR",
  scope: { data_types: ["customer_profile"], sources: ["crm_system"] },
  text_fields: ["note"],
  entities: [
    {
      id: "ent_email",
      label: "Email address",
      classification: "PII",
      sensitivity: "medium",
      detection: { field_names: ["email"], regex: null, ner_types: ["EMAIL"] },
    },
  ],
};

const aiRecord = {
  data_type: "customer_profile",
  record_id: "cust_scan_ai_001",
  metadata: [
    { key: "email", value: "ada.lovelace@example.com" },
    { key: "name", value: "Ada Lovelace" },
  ],
  source: "crm_system",
  jurisdiction: "EU_GDPR",
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

describe("classifySampleBodySchema", () => {
  it("accepts valid body and defaults scenario to auto", () => {
    const result = classifySampleBodySchema.safeParse({
      policy: samplePolicy,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scenario).toBe("auto");
    }
  });

  it("rejects missing entities", () => {
    const result = classifySampleBodySchema.safeParse({
      policy: {
        id: "pol_x",
        jurisdiction: "EU_GDPR",
        entities: [],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid scenario", () => {
    const result = classifySampleBodySchema.safeParse({
      scenario: "unknown",
      policy: samplePolicy,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional system and process catalog snapshots", () => {
    const result = classifySampleBodySchema.safeParse({
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

describe("classifySample output schema", () => {
  it("serializes for OpenAI structured output (draft-7 input)", () => {
    assertOpenAiStructuredOutputCompatible(classifySampleOutputSchema);
  });

  it("accepts single record output", () => {
    const result = classifySampleOutputSchema.safeParse({
      record: aiRecord,
    });
    expect(result.success).toBe(true);
  });

  it("normalizes AI record entries into metadata objects", () => {
    expect(normalizeClassifySampleRecord(aiRecord)).toEqual({
      data_type: "customer_profile",
      record_id: "cust_scan_ai_001",
      metadata: {
        email: "ada.lovelace@example.com",
        name: "Ada Lovelace",
      },
      source: "crm_system",
      jurisdiction: "EU_GDPR",
    });
  });
});
