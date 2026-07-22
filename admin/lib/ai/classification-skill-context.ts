/**
 * Curated classification / PII detection guidance for LiteLLM prompts.
 */

import {
  RETENTION_JURISDICTIONS,
  type RetentionJurisdiction,
} from "@/lib/ai/retention-skill-context";

export const CLASSIFICATION_JURISDICTIONS = RETENTION_JURISDICTIONS;
export type ClassificationJurisdiction = RetentionJurisdiction;

export const CLASSIFICATION_ENTITY_CATEGORIES = [
  "email",
  "phone",
  "national_id",
  "health",
  "financial",
  "biometric",
] as const;

export type ClassificationEntityCategory =
  (typeof CLASSIFICATION_ENTITY_CATEGORIES)[number];

export const CLASSIFICATION_MASTERY_MARKER = "DATA_CLASSIFICATION_POLICY_MASTERY";

const CORE_PRINCIPLES = `## PII / sensitive data classification policy mastery (ROS Policy)

Apply these principles when authoring classification_policy YAML. Do not invent legal definitions; use conservative sensitivity defaults.

1. Classify before retain — detection policies identify PII/SPII in metadata and free text.
2. SPII defaults to critical sensitivity — national IDs, health, biometrics, payment cards.
3. PII defaults to medium — email, phone, name, address unless jurisdiction elevates.
4. Hybrid detection — combine field_names, regex, and ner_types when appropriate.
5. Regulatory refs — cite GDPR Art. 4/9, PDPA, PDPD articles in entity regulatory_refs.
6. Rules use synthetic fields after detection: _max_classification, _max_sensitivity, _has_pii, _has_spii, _entity_count.
7. Actions: flag | mask | block | review | allow — SPII often flag or block with handling notes.
8. Prefer status: draft for new policies.
9. Scope data_types must match records you intend to scan (customer_profile, support_ticket, etc.).
10. text_fields lists metadata paths scanned with NER when privalyse is available.`;

const JURISDICTION_SLICES: Record<ClassificationJurisdiction, string> = {
  EU_GDPR: `### EU_GDPR classification focus
- Personal data (Art. 4(1)): any information relating to an identified/identifiable natural person.
- Special categories (Art. 9): health, biometric, racial/ethnic origin, political opinions, etc. → SPII.
- Include entities: email, phone, national_id, health_data with regulatory_refs.`,
  VN_PDPD: `### VN_PDPD classification focus
- Personal data per Nghị định 13/2023 — include CMND/CCCD as SPII.
- Sensitive personal data requires heightened protection — flag or block exports.`,
  SG_PDPA: `### SG_PDPA classification focus
- Personal data broadly defined; NRIC/FIN as sensitive identifiers.
- Cease processing when purpose ends — detection supports purpose review.`,
  GLOBAL: `### GLOBAL classification focus
- Apply strictest sensitivity when jurisdiction unclear.
- Segment entities by data_classification and include cross-border handling notes.`,
};

const ENTITY_CATEGORY_SLICES: Record<ClassificationEntityCategory, string> = {
  email: `### Entity: Email
- classification: PII, sensitivity: medium
- detection.field_names: [email, contact_email, e_mail]
- detection.regex: email pattern; ner_types: [EMAIL]`,
  phone: `### Entity: Phone
- classification: PII, sensitivity: medium
- detection.field_names: [phone, mobile, telephone, sdt]
- ner_types: [PHONE]`,
  national_id: `### Entity: National ID
- classification: SPII, sensitivity: critical
- field_names: [ssn, national_id, cmnd, cccd, nric, fin]`,
  health: `### Entity: Health data
- classification: SPII, sensitivity: critical
- field_names: [diagnosis, medical_record, health_status, prescription]`,
  financial: `### Entity: Financial
- classification: financial or SPII for payment cards
- field_names: [iban, account_number, card_number, tax_id]
- ner_types: [CREDIT_CARD] where applicable`,
  biometric: `### Entity: Biometric
- classification: SPII, sensitivity: critical
- field_names: [fingerprint, face_id, biometric_template]`,
};

export type ClassificationSkillHints = {
  jurisdiction?: ClassificationJurisdiction;
  entityCategory?: ClassificationEntityCategory;
};

export function buildClassificationSkillAppendix(
  hints: ClassificationSkillHints = {},
): string {
  const parts: string[] = [CLASSIFICATION_MASTERY_MARKER, CORE_PRINCIPLES];
  if (hints.jurisdiction) {
    parts.push(JURISDICTION_SLICES[hints.jurisdiction]);
  }
  if (hints.entityCategory) {
    parts.push(ENTITY_CATEGORY_SLICES[hints.entityCategory]);
  }
  return parts.join("\n\n");
}

export const ENTITY_CATEGORY_STARTER_SENTENCES: Record<
  ClassificationEntityCategory,
  string
> = {
  email: "Detect email addresses in customer profiles and support tickets.",
  phone: "Detect phone numbers including mobile and landline fields.",
  national_id:
    "Detect national identifiers: SSN, CMND/CCCD, NRIC/FIN with SPII handling.",
  health: "Detect health and medical record fields as SPII.",
  financial: "Detect financial account numbers, IBAN, and payment card data.",
  biometric: "Detect biometric identifiers and templates as critical SPII.",
};

export const CLASSIFICATION_JURISDICTION_STARTER_SENTENCES: Record<
  ClassificationJurisdiction,
  string
> = {
  EU_GDPR:
    "Jurisdiction EU_GDPR: GDPR personal data and Art. 9 special categories.",
  VN_PDPD: "Jurisdiction VN_PDPD: Vietnam personal and sensitive personal data.",
  SG_PDPA: "Jurisdiction SG_PDPA: Singapore personal data including NRIC.",
  GLOBAL: "Global cross-jurisdiction: apply strictest PII/SPII sensitivity.",
};
