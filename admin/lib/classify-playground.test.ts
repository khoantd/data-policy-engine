import { describe, expect, it } from "vitest";
import {
  applyClassificationPolicyDefaults,
  applyClassifySampleRecordToForm,
  buildMaskedMetadataSuggestion,
  checkPolicyScope,
  getResultViewState,
  trimClassificationPolicyForSample,
} from "./classify-playground";
import type {
  ClassificationPolicy,
  ClassificationResponse,
  PolicyListItem,
} from "./types";

const policy: PolicyListItem = {
  id: "pol_cls_001",
  name: "Vietnam Personal and Sensitive Data Policy",
  version: 2,
  status: "active",
  jurisdiction: "VN_PDPD",
  policy_kind: "classification",
  entity_count: 1,
  rule_count: 1,
  scope_data_types: ["customer_profile", "support_ticket"],
  scope_sources: ["database", "api"],
  excluded_data_types: ["logs"],
  excluded_sources: [],
  data_classification: null,
};

const fullPolicy: ClassificationPolicy = {
  id: "pol_gdpr_pii_detect",
  name: "GDPR Personal Data Detection",
  version: 1,
  status: "active",
  jurisdiction: "EU_GDPR",
  policy_kind: "classification",
  scope: {
    data_types: ["customer_profile", "support_ticket"],
    sources: ["crm_system"],
  },
  text_fields: ["note"],
  entities: [
    {
      id: "ent_email",
      label: "Email address",
      classification: "PII",
      sensitivity: "medium",
      detection: {
        field_names: ["email", "contact_email"],
        regex: "^.+@.+$",
        ner_types: ["EMAIL"],
      },
    },
  ],
  rules: [
    {
      id: "rule_pii_review",
      priority: 20,
      description: "Review detected PII",
      condition: { any: [] },
      action: "review",
    },
  ],
};

describe("checkPolicyScope", () => {
  it("flags out-of-scope data types", () => {
    expect(
      checkPolicyScope(policy, {
        dataType: "employee_record",
        jurisdiction: "VN_PDPD",
        source: "database",
      }),
    ).toEqual({
      inScope: false,
      reasons: ["data_type"],
    });
  });

  it("accepts in-scope cmnd request values", () => {
    expect(
      checkPolicyScope(policy, {
        dataType: "customer_profile",
        jurisdiction: "VN_PDPD",
        source: "database",
      }),
    ).toEqual({
      inScope: true,
      reasons: ["none"],
    });
  });

  it("works with full classification policies", () => {
    expect(
      checkPolicyScope(fullPolicy, {
        dataType: "customer_profile",
        jurisdiction: "EU_GDPR",
        source: "crm_system",
      }),
    ).toEqual({
      inScope: true,
      reasons: ["none"],
    });
  });
});

describe("classification sample helpers", () => {
  it("applies policy defaults from scope", () => {
    expect(applyClassificationPolicyDefaults(fullPolicy)).toEqual({
      jurisdiction: "EU_GDPR",
      dataType: "customer_profile",
      source: "crm_system",
    });
  });

  it("trims a classification policy for AI sample generation", () => {
    expect(trimClassificationPolicyForSample(fullPolicy)).toEqual({
      id: "pol_gdpr_pii_detect",
      jurisdiction: "EU_GDPR",
      scope: {
        data_types: ["customer_profile", "support_ticket"],
        sources: ["crm_system"],
      },
      text_fields: ["note"],
      entities: [
        {
          id: "ent_email",
          label: "Email address",
          classification: "PII",
          sensitivity: "medium",
          detection: {
            field_names: ["email", "contact_email"],
            regex: "^.+@.+$",
            ner_types: ["EMAIL"],
          },
        },
      ],
    });
  });

  it("applies generated sample records to form fields", () => {
    expect(
      applyClassifySampleRecordToForm({
        data_type: "support_ticket",
        record_id: "tkt_ai_001",
        source: "api",
        jurisdiction: "EU_GDPR",
        metadata: { email: "user@example.com" },
      }),
    ).toEqual({
      dataType: "support_ticket",
      recordId: "tkt_ai_001",
      source: "api",
      jurisdiction: "EU_GDPR",
      metadata: JSON.stringify({ email: "user@example.com" }, null, 2),
    });
  });
});

describe("getResultViewState", () => {
  it("surfaces backend out-of-scope diagnostics", () => {
    const response: ClassificationResponse = {
      record_id: "emp_1",
      classification_id: "cls_1",
      detected_entities: [],
      result: {
        action: "allow",
        handling: null,
        matched_policy: null,
        matched_rule: null,
        policy_version: null,
        max_classification: null,
        max_sensitivity: null,
      },
      diagnostics: {
        applicable_policy_count: 0,
        selected_policy_applied: false,
        out_of_scope_reason: "data_type",
        policy_scope_summary: {
          jurisdiction: "VN_PDPD",
          data_types: ["customer_profile", "support_ticket"],
          sources: ["database", "api"],
          excluded_data_types: ["logs"],
          excluded_sources: [],
        },
      },
      jurisdiction_applied: "VN_PDPD",
      classified_at: "2026-07-22T08:00:00Z",
      audit_ref: null,
    };

    expect(getResultViewState(response)).toMatchObject({
      kind: "out_of_scope",
      reason: "data_type",
    });
  });
});

describe("buildMaskedMetadataSuggestion", () => {
  it("masks detected leaf fields and preserves other metadata", () => {
    const suggestion = buildMaskedMetadataSuggestion(
      {
        email: "ada.lovelace@example.com",
        name: "Ada Lovelace",
        nested: {
          ssn: "123-45-6789",
        },
      },
      [
        {
          entity_id: "ent_email",
          label: "Email address",
          field: "email",
          classification: "PII",
          sensitivity: "medium",
          confidence: "definitive",
          snippet: "ad…om",
          detector: "field_name",
          regulatory_refs: [],
        },
        {
          entity_id: "ent_ssn",
          label: "National ID",
          field: "nested.ssn",
          classification: "SPII",
          sensitivity: "critical",
          confidence: "definitive",
          snippet: "12…89",
          detector: "regex",
          regulatory_refs: [],
        },
      ],
    );

    expect(suggestion).toEqual({
      metadata: {
        email: "a***********@example.com",
        name: "Ada Lovelace",
        nested: {
          ssn: "12*******89",
        },
      },
      maskedFields: [
        {
          field: "email",
          label: "Email address",
          classification: "PII",
          sensitivity: "medium",
          originalValue: "ada.lovelace@example.com",
          maskedValue: "a***********@example.com",
        },
        {
          field: "nested.ssn",
          label: "National ID",
          classification: "SPII",
          sensitivity: "critical",
          originalValue: "123-45-6789",
          maskedValue: "12*******89",
        },
      ],
    });
  });

  it("deduplicates repeated detections for the same field", () => {
    const suggestion = buildMaskedMetadataSuggestion(
      { email: "user@example.com" },
      [
        {
          entity_id: "ent_email",
          label: "Email address",
          field: "email",
          classification: "PII",
          sensitivity: "medium",
          confidence: "definitive",
          snippet: null,
          detector: "field_name",
          regulatory_refs: [],
        },
        {
          entity_id: "ent_email_regex",
          label: "Email address",
          field: "email",
          classification: "PII",
          sensitivity: "medium",
          confidence: "definitive",
          snippet: null,
          detector: "regex",
          regulatory_refs: [],
        },
      ],
    );

    expect(suggestion?.maskedFields).toHaveLength(1);
    expect(suggestion?.metadata).toEqual({
      email: "u***@example.com",
    });
  });
});
