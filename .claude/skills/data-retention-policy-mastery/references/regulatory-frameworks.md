# Regulatory Frameworks for Data Retention

Reference for jurisdiction-specific data retention requirements. Read this file when the
user asks about a specific regulation, needs a compliance gap analysis, or is designing
retention policies for a multi-jurisdiction environment.

---

## Table of Contents

1. [GDPR (EU)](#gdpr-eu)
2. [PDPD (Vietnam)](#pdpd-vietnam)
3. [PDPA (Singapore)](#pdpa-singapore)
4. [HIPAA (United States — Healthcare)](#hipaa)
5. [SOX (United States — Financial)](#sox)
6. [PCI-DSS (Payment Card Industry)](#pci-dss)
7. [Cross-Border Data Transfer Rules](#cross-border)
8. [Jurisdiction Selection Logic](#jurisdiction-selection)

---

## GDPR (EU) {#gdpr-eu}

### Core Retention Principles

**Article 5(1)(e) — Storage Limitation:**
Personal data must be kept in a form that permits identification of data subjects for no
longer than is necessary for the purposes for which the personal data are processed.
Exception: archiving in the public interest, scientific/historical research, or statistical
purposes (with appropriate safeguards).

**Article 5(1)(b) — Purpose Limitation:**
Data collected for one purpose cannot be further processed for a different, incompatible
purpose. When the original purpose is fulfilled, retention must be justified by a new
lawful basis or the data must be erased/anonymized.

**Article 5(1)(c) — Data Minimisation:**
Only the data that is necessary for the stated purpose should be retained. Periodic reviews
should prune unnecessary data fields even within the retention period.

### Data Subject Rights Affecting Retention

**Article 17 — Right to Erasure (Right to Be Forgotten):**
Data subjects can request erasure when:
- Data is no longer necessary for the original purpose
- Consent is withdrawn (and no other legal basis applies)
- Data subject objects to processing (Art. 21) and no overriding legitimate grounds exist
- Data was unlawfully processed
- Legal obligation requires erasure
- Data was collected in relation to information society services offered to a child

**Exceptions to Right to Erasure (Art. 17(3)):**
Erasure is NOT required when processing is necessary for:
- Exercising the right of freedom of expression and information
- Compliance with a legal obligation (tax, audit, employment law)
- Public interest in the area of public health
- Archiving purposes in the public interest, scientific/historical research, statistical purposes
- Establishment, exercise, or defence of legal claims

**Article 15 — Right of Access:**
Data subjects can request a copy of all personal data being processed about them.
Response deadline: 30 days, extendable once by 60 days for complex requests.

**Article 20 — Right to Data Portability:**
Data subjects can receive their data in a structured, commonly used, machine-readable format.
Applies only to data provided by the data subject and processed by automated means based on
consent or contract.

### Retention Period Guidance by Data Type

| Data Type | Recommended Period | Legal Basis |
|---|---|---|
| Customer account data | Duration of service + 3 years | Contract performance + legitimate interest |
| Marketing consent records | Until withdrawal + 30 days | Consent (Art. 6(1)(a)) |
| Transaction records | 7 years (most EU member states) | Legal obligation (tax/accounting) |
| Employee records | Employment + 5-10 years (varies by member state) | Legal obligation |
| Website cookies/tracking | 13 months max (ePrivacy) | Consent |
| CCTV footage | 30 days typical (varies by member state) | Legitimate interest |
| Recruitment data (unsuccessful) | 6 months typical | Legitimate interest |
| Audit/compliance logs | 10 years minimum | Legitimate interest + legal obligation |

### Key Implementation Notes

- GDPR does not prescribe specific retention periods for most data types — it requires
  organizations to define and justify their own periods based on purpose and lawful basis.
- Member state laws may impose specific retention periods (e.g., German tax law: 10 years
  for financial records, French labor law: 5 years for payroll records).
- The Data Protection Authority (DPA) of each member state may issue guidance on
  acceptable retention periods for specific sectors.
- Data Protection Impact Assessments (DPIAs) must consider retention periods.

---

## PDPD (Vietnam) {#pdpd-vietnam}

### Nghị định 13/2023/NĐ-CP (Decree on Personal Data Protection)

Vietnam's PDPD, effective July 1, 2023, is the first comprehensive personal data protection
law in Vietnam.

### Core Principles

**Article 3 — Personal Data Processing Principles:**
- Lawfulness, fairness, and transparency
- Purpose limitation: data processed only for stated, legitimate purposes
- Data minimization: collect only what is necessary
- Accuracy: keep data accurate and up-to-date
- Storage limitation: retain only as long as necessary for the purpose
- Integrity and confidentiality

**Article 9 — Data Subject Rights:**
- Right to be informed
- Right to consent
- Right to access
- Right to withdraw consent
- Right to erasure (right to be forgotten)
- Right to restrict processing
- Right to data portability
- Right to object to automated processing
- Right to lodge complaints

### Retention-Specific Requirements

**Article 17 — Data Storage:**
- Personal data must be stored for the minimum period necessary
- When the processing purpose has been fulfilled, personal data must be deleted or destroyed
  unless otherwise required by law
- Organizations must establish and document retention periods

**Cross-Border Transfer (Article 25-26):**
- Personal data of Vietnamese citizens and residents can be transferred abroad
- Must notify the Ministry of Public Security before transfer
- The data controller remains responsible regardless of where data is stored
- Impact assessment required for cross-border transfers

### Vietnam-Specific Retention Periods

| Data Type | Period | Legal Basis |
|---|---|---|
| Tax/accounting records | 10 years | Law on Tax Administration |
| Employment records | Duration + 5 years | Labor Code |
| Banking/financial records | 10 years | Law on Credit Institutions |
| Insurance records | Contract + 5 years | Insurance Business Law |
| E-commerce transaction records | 10 years | E-Commerce Law |
| Telecommunications metadata | 2 years | Telecommunications Law |

---

## PDPA (Singapore) {#pdpa-singapore}

### Personal Data Protection Act 2012 (amended 2020)

**Section 25 — Retention Limitation Obligation:**
An organisation shall cease to retain, or remove the means by which the personal data can
be associated with particular individuals, as soon as it is reasonable to assume that:
(a) the purpose for which that personal data was collected is no longer being served by
    retention of the personal data; and
(b) retention is no longer necessary for legal or business purposes.

### Key Differences from GDPR

- No specific "right to be forgotten" — but the Access and Correction obligations
  (Sections 21-22) enable similar outcomes
- Mandatory Data Protection Officer (DPO) appointment for all organizations
- Breach notification within 3 calendar days to the PDPC
- Financial penalties up to SGD 1 million or 10% of annual turnover

### Recommended Retention Periods

| Data Type | Period | Notes |
|---|---|---|
| Customer data | Purpose fulfillment + 5 years | Limitation Act |
| Financial records | 5-7 years | Companies Act, IRAS requirements |
| Employment records | Employment + 2 years | Employment Act |
| Medical records | 6 years (MRA) or 7 years (SMC) | Varies by regulation |
| Marketing consent | Until withdrawal + reasonable period | PDPA Section 14 |

---

## HIPAA (United States — Healthcare) {#hipaa}

### Health Insurance Portability and Accountability Act

**Retention Rule:**
HIPAA itself requires covered entities to retain documentation of policies, procedures,
and compliance activities for **6 years from the date of creation or the date when it last
was in effect, whichever is later**.

**State Laws Override:**
Many US states require longer retention for medical records:
- California: 7 years (adults), age 18 + 7 years (minors)
- New York: 6 years
- Texas: 7 years

**Protected Health Information (PHI):**
- De-identified data (per Safe Harbor or Expert Determination) is not subject to HIPAA
  retention rules
- Business Associate Agreements (BAAs) must specify retention and destruction obligations
- Patients have the right to access their records for as long as the covered entity
  maintains them

---

## SOX (United States — Financial) {#sox}

### Sarbanes-Oxley Act Section 802

**Core Requirement:**
Public companies and their auditors must retain audit work papers and related records for
**7 years** after the audit or review of the financial statements.

**Section 802 Penalties:**
Knowingly destroying, altering, or concealing records with intent to obstruct a federal
investigation: up to 20 years imprisonment and fines.

**Covered Records:**
- Audit work papers
- Financial statements and supporting documentation
- Communications between auditors and management
- Internal control documentation
- Board meeting minutes related to financial reporting

---

## PCI-DSS (Payment Card Industry) {#pci-dss}

### Payment Card Industry Data Security Standard v4.0

**Requirement 3 — Protect Stored Account Data:**
- Store cardholder data only if necessary for business purposes
- Limit storage amount and retention time to the minimum required
- Define retention periods and dispose of data that exceeds the defined period
- Quarterly process to identify and securely delete stored data that exceeds retention

**Requirement 10 — Log and Monitor:**
- Audit trail history must be retained for at least **1 year**
- At least **3 months of audit trail** must be immediately available for analysis

**Key Restrictions:**
- Never store sensitive authentication data (SAD) after authorization
- Mask PAN when displayed (first 6 / last 4 digits max)
- Render stored PAN unreadable (encryption, hashing, truncation, tokenization)

---

## Cross-Border Data Transfer Rules {#cross-border}

### Decision Matrix

When data flows across borders, determine the most restrictive applicable regime:

| From → To | Key Requirements |
|---|---|
| EU → Non-EU | Adequacy decision, SCCs, BCRs, or derogation (Art. 49) |
| Vietnam → Abroad | Notify MPS, conduct impact assessment, maintain responsibility |
| Singapore → Abroad | Comparable protection standard, contractual binding, consent |
| Any → US | No federal adequacy; rely on SCCs, DPF (for EU), or contract |

### Practical Guidance

1. **Map all cross-border flows** before designing retention policies
2. **Apply the most restrictive rule** when policies overlap
3. **Document the transfer mechanism** (SCCs, adequacy, etc.) in the policy
4. **Include data localization requirements** — some jurisdictions require local copies
5. **Backup and DR sites count** — if backups replicate to another jurisdiction, those
   transfers need a legal basis too

---

## Jurisdiction Selection Logic {#jurisdiction-selection}

When evaluating a record, determine the applicable jurisdiction:

```
1. Check data subject's location → primary jurisdiction
2. Check data controller's registration → secondary jurisdiction
3. Check data processing location → tertiary jurisdiction
4. If multiple jurisdictions apply → use the MOST RESTRICTIVE
5. If jurisdiction is ambiguous → flag for manual review
```

In the DRPE policy DSL, jurisdiction is set per policy. When a record is evaluated:
- Policies matching the record's jurisdiction are applied
- Policies with `jurisdiction: GLOBAL` always apply
- If no jurisdiction-specific policy exists, GLOBAL policies are the fallback

### Multi-Jurisdiction Policy Design Pattern

Create separate policies per jurisdiction, plus a GLOBAL baseline:

```yaml
# GLOBAL baseline — applies everywhere
policy:
  id: pol_global_baseline
  jurisdiction: GLOBAL
  rules:
    - id: rule_legal_hold
      priority: 1
      condition:
        any:
          - field: "legal_hold"
            operator: "eq"
            value: true
      action: retain

# EU-specific — stricter, GDPR-compliant
policy:
  id: pol_eu_customer
  jurisdiction: EU_GDPR
  rules:
    - id: rule_inactive_delete
      priority: 100
      condition:
        all:
          - field: "status"
            operator: "eq"
            value: "inactive"
          - field: "last_activity_at"
            operator: "older_than"
            value: "730d"
      action: delete
      grace_period: "30d"

# Vietnam-specific — PDPD-compliant
policy:
  id: pol_vn_customer
  jurisdiction: VN_PDPD
  rules:
    - id: rule_inactive_delete
      priority: 100
      condition:
        all:
          - field: "status"
            operator: "eq"
            value: "inactive"
          - field: "last_activity_at"
            operator: "older_than"
            value: "1095d"
      action: delete
      grace_period: "30d"
```
