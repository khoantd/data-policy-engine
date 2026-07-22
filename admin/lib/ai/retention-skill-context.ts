/**
 * Curated excerpt of data-retention-policy-mastery for LiteLLM prompts.
 * Full skill lives in .cursor/skills/data-retention-policy-mastery/.
 */

export const RETENTION_JURISDICTIONS = [
  "EU_GDPR",
  "VN_PDPD",
  "SG_PDPA",
  "GLOBAL",
] as const;

export type RetentionJurisdiction = (typeof RETENTION_JURISDICTIONS)[number];

export const RETENTION_INDUSTRIES = [
  "saas",
  "ecommerce",
  "finance",
  "healthcare",
  "hr",
] as const;

export type RetentionIndustry = (typeof RETENTION_INDUSTRIES)[number];

export const RETENTION_MASTERY_MARKER = "DATA_RETENTION_POLICY_MASTERY";

const CORE_PRINCIPLES = `## Data retention policy mastery (DRPE)

Apply these principles when authoring YAML policies. Do not invent legal requirements; use approximations only where noted and prefer conservative retention.

1. Storage limitation by default — shortest legally permissible retention.
2. Legal hold is sacred — priority 1 retain rule when legal_hold/litigation applies; overrides all delete rules.
3. Anonymization ≠ pseudonymization — anonymized data may be retained indefinitely; pseudonymized remains personal data under GDPR.
4. Cross-border: apply most restrictive requirement unless policy is jurisdiction-segmented.
5. Backups count — deletion must cover replicas and DR copies in scope notes.
6. Audit logs retention ≥ 10 years (3650d) to prove disposal compliance.
7. Purpose limitation — when original purpose ends, retention clock starts.
8. Grace periods before irreversible delete: default 30d grace, 7d notify_before.
9. Policy versioning — new drafts use status: draft; never overwrite history.
10. Every policy should include DSAR (access/erasure) and audit blocks when generating or enhancing.

Authoring rules:
- Legal hold rules: priority 1, action retain, condition on legal_hold eq true or litigation tag.
- Time conditions: older_than/newer_than with Nd/Nh/Nm (e.g. "730d" = 2 years inactive).
- Delete/archive/anonymize rules: include grace_period and notify_before unless user says immediate.
- Include dsar.response_deadline "30d" for GDPR-aligned jurisdictions.
- Include audit.retention_of_audit_logs "3650d" when audit block is present.`;

const JURISDICTION_QUICK_TABLE = `## Jurisdiction quick reference (approximations — verify with counsel)

| Data Type | EU_GDPR | VN_PDPD | SG_PDPA | SOX/HIPAA notes |
|---|---|---|---|---|
| Customer profiles | Purpose + max ~3y inactive | Purpose + org-defined | Cease when purpose exhausted | N/A |
| Financial transactions | ~7y (tax) | ~10y (tax) | Per sector | SOX 7y |
| Employee records | Employment + 5–10y | Employment + 5y | Reasonable period | SOX 7y |
| Medical records | N/A | N/A | N/A | HIPAA 6y |
| System logs | ~90d typical | ~90d typical | Reasonable | 7y if audit-relevant |
| Marketing consent | Until withdrawn + 30d | Until withdrawn | Consent-based | N/A |
| Audit logs | 10+ years | 10+ years | Reasonable | 7y SOX / 6y HIPAA |`;

const JURISDICTION_SLICES: Record<RetentionJurisdiction, string> = {
  EU_GDPR: `### EU_GDPR focus
- Art. 5(1)(e) storage limitation; Art. 17 erasure; Art. 25 data protection by design.
- DSAR deadline 30d (extendable once by 60d). Erasure exceptions: legal obligation, public interest, legal claims.
- Default erasure_exceptions: legal_obligation, public_interest, legal_claims.
- Prefer jurisdiction: EU_GDPR on policy root.`,

  VN_PDPD: `### VN_PDPD focus (Nghị định 13/2023)
- Retention limited to stated purpose; cease when purpose fulfilled unless law requires longer.
- Financial/tax records often ~10 years. Consent withdrawal triggers erasure review.
- Prefer jurisdiction: VN_PDPD on policy root.`,

  SG_PDPA: `### SG_PDPA focus
- Obligation to cease retention when purpose no longer served or retention no longer necessary.
- Reasonable security and accuracy; erasure on valid request subject to exceptions.
- Prefer jurisdiction: SG_PDPA on policy root.`,

  GLOBAL: `### GLOBAL focus
- Segment rules by data_classification and scope.data_types when multi-jurisdiction.
- Apply strictest applicable retention when jurisdiction is unclear.
- Use tags for gdpr, pdpd, pdpa as needed; prefer jurisdiction: GLOBAL only when truly cross-cutting.`,
};

const INDUSTRY_SLICES: Record<RetentionIndustry, string> = {
  saas: `### Industry: SaaS (starter schedule)
- User accounts (closed): PII, closure + 2y → delete, grace 30d.
- Subscription/billing: financial, end of service + 7y → archive then delete.
- Usage analytics (identified): PII, 2y rolling → anonymize.
- API/system logs: operational, 90d–1y → delete.
- Audit/compliance logs: operational, 10y → archive.
- Scope examples: user_profile, billing_record, support_ticket, api_access_log.`,

  ecommerce: `### Industry: E-commerce (starter schedule)
- Customer profiles: PII, last activity + 3y → delete, grace 30d, notify 7d.
- Order history: financial, 7y → archive.
- Guest checkout: PII, transaction + 90d → delete.
- Payment tokens: SPII, last transaction + 90d → delete.
- Return/refund records: financial, 7y → archive.`,

  finance: `### Industry: Financial / Fintech (starter schedule)
- KYC/AML: SPII, account closure + 5–7y → archive then delete.
- Transaction records: financial, 7–10y → archive.
- Trading records: financial, 7y → archive (SEC 17a-4 style).
- Audit logs: operational, 10y → archive.
- Strong legal hold and requires_approval on delete for active accounts.`,

  healthcare: `### Industry: Healthcare (starter schedule)
- Patient medical records (adult): SPII, last encounter + 7y → archive.
- Lab/prescription: SPII, 7y → archive.
- HIPAA compliance logs: operational, 6y → archive.
- data_classification: SPII predominant; erasure subject to treatment/legal exceptions.`,

  hr: `### Industry: HR (cross-industry starter schedule)
- Job applications (not hired): PII, decision + 6–12mo → delete.
- Employment contracts / payroll: financial, termination + 7y → archive.
- Performance reviews: PII, employment + 3y → delete.
- I-9 / work authorization: SPII, termination + 3y or hire + 1y → delete.`,
};

export type RetentionSkillHints = {
  jurisdiction?: RetentionJurisdiction;
  industry?: RetentionIndustry;
};

/** Curated mastery appendix appended to the system prompt (~2–3k tokens max with hints). */
export function buildRetentionSkillAppendix(
  hints: RetentionSkillHints = {},
): string {
  const parts: string[] = [
    RETENTION_MASTERY_MARKER,
    CORE_PRINCIPLES,
    JURISDICTION_QUICK_TABLE,
  ];

  if (hints.jurisdiction) {
    parts.push(JURISDICTION_SLICES[hints.jurisdiction]);
  }
  if (hints.industry) {
    parts.push(INDUSTRY_SLICES[hints.industry]);
  }

  return parts.join("\n\n");
}

export const INDUSTRY_STARTER_SENTENCES: Record<RetentionIndustry, string> = {
  saas: "SaaS retention: inactive user accounts, billing records, support tickets, and API logs.",
  ecommerce:
    "E-commerce retention: customer profiles, order history, guest checkout, and payment tokens.",
  finance:
    "Financial services retention: KYC/AML, transactions, trading records, and compliance audit logs.",
  healthcare:
    "Healthcare retention: patient records, lab results, prescriptions, and HIPAA compliance logs.",
  hr: "HR retention: applications, payroll, performance reviews, and employment contracts.",
};

export const JURISDICTION_STARTER_SENTENCES: Record<
  RetentionJurisdiction,
  string
> = {
  EU_GDPR:
    "Jurisdiction EU_GDPR: storage limitation, DSAR erasure, 30-day response deadline.",
  VN_PDPD:
    "Jurisdiction VN_PDPD: purpose-limited retention per Nghị định 13/2023.",
  SG_PDPA:
    "Jurisdiction SG_PDPA: cease retention when purpose is no longer served.",
  GLOBAL:
    "Global cross-jurisdiction policy: apply strictest applicable retention per data type.",
};
