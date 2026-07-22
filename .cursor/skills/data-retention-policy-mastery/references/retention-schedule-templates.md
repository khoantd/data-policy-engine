# Retention Schedule Templates

Industry-specific retention schedule templates with recommended periods.
Read this file when the user needs a starting-point retention schedule for their industry.

**Important:** These are starting templates, not legal advice. Actual retention periods
depend on the specific jurisdiction, data processing activities, and contractual obligations.
Always recommend the user validate with legal counsel.

---

## Table of Contents

1. [SaaS / Software Company](#saas)
2. [E-Commerce / Retail](#ecommerce)
3. [Financial Services / Fintech](#finance)
4. [Healthcare](#healthcare)
5. [Human Resources (Cross-Industry)](#hr)
6. [Template Customization Guide](#customization)

---

## SaaS / Software Company {#saas}

| Data Type | Classification | Retention Period | Action After | Notes |
|---|---|---|---|---|
| User accounts (active) | PII | Duration of service | N/A | Retain while active |
| User accounts (closed) | PII | Closure + 2 years | Delete | Grace period: 30 days |
| User accounts (trial, never converted) | PII | Trial end + 90 days | Delete | Short retention |
| Subscription/billing records | Financial | End of service + 7 years | Archive then delete | Tax/audit requirement |
| Payment method tokens | SPII | End of service + 90 days | Delete | PCI-DSS compliance |
| Usage analytics (identified) | PII | 2 years rolling | Anonymize | Keep trends, remove identity |
| Usage analytics (anonymous) | Public | Indefinite | N/A | No PII, no restriction |
| Support tickets | PII | Resolution + 3 years | Anonymize | Useful for training data |
| API access logs | Operational | 1 year | Delete | Security & debugging |
| System/application logs | Operational | 90 days | Delete | Rotated automatically |
| Error/crash reports | Operational | 1 year | Delete | May contain PII in stack traces |
| Marketing consent records | PII | Until withdrawal + 30 days | Delete | Must track consent history |
| Email campaign data | PII | 3 years | Anonymize | Aggregate stats useful |
| Feature flag/experiment data | Operational | 1 year | Delete | Tied to specific releases |
| Audit/compliance logs | Operational | 10 years | Archive | Compliance requirement |

---

## E-Commerce / Retail {#ecommerce}

| Data Type | Classification | Retention Period | Action After | Notes |
|---|---|---|---|---|
| Customer profiles | PII | Last activity + 3 years | Delete | Grace: 30d, notify: 7d |
| Guest checkout data | PII | Transaction + 90 days | Delete | Minimal retention |
| Order history | Financial | 7 years | Archive | Tax/returns/disputes |
| Shipping addresses | PII | Last order + 2 years | Delete | Not needed after delivery window |
| Payment card tokens | SPII | Last transaction + 90 days | Delete | PCI-DSS requirement |
| Product reviews | Public | Indefinite (anonymized) | Anonymize author | Valuable content |
| Wishlist/cart data | PII | Last activity + 1 year | Delete | Low retention value |
| Return/refund records | Financial | 7 years | Archive | Legal/tax requirement |
| Customer service chats | PII | Resolution + 2 years | Anonymize | Training value |
| Loyalty program data | PII | Account closure + 1 year | Delete | Points expire |
| Website cookies/tracking | PII | 13 months | Delete | ePrivacy regulation |
| Supplier/vendor records | Operational | Contract end + 7 years | Archive | Legal requirement |
| Inventory/product data | Operational | Discontinuation + 5 years | Archive | Warranty/recall support |

---

## Financial Services / Fintech {#finance}

| Data Type | Classification | Retention Period | Action After | Notes |
|---|---|---|---|---|
| KYC/AML records | SPII | Account closure + 5-7 years | Archive then delete | AML regulations |
| Transaction records | Financial | 7-10 years | Archive then delete | SOX/tax requirements |
| Account statements | Financial | 7 years | Archive | Customer access required |
| Loan/credit applications | SPII | Decision + 5 years | Delete | Regulatory requirement |
| Credit scoring data | SPII | Decision + 2 years | Delete | Fair lending compliance |
| Wire transfer records | Financial | 5 years | Archive | BSA/AML requirement |
| Customer communications | PII | 7 years | Archive | SEC/regulatory |
| Trading records | Financial | 7 years | Archive | SEC Rule 17a-4 |
| Complaints | PII | Resolution + 5 years | Archive | Regulatory |
| Board/committee minutes | Operational | Permanent | Archive | Corporate governance |
| Employee trading records | Financial | Employment + 3 years | Delete | Compliance |
| Risk assessment reports | Operational | 7 years | Archive | Regulatory |
| Audit logs | Operational | 10 years | Archive | Compliance |

---

## Healthcare {#healthcare}

| Data Type | Classification | Retention Period | Action After | Notes |
|---|---|---|---|---|
| Patient medical records (adult) | SPII | Last encounter + 7 years | Archive | State laws may extend |
| Patient medical records (minor) | SPII | Age 18 + 7 years | Archive | Longest retention |
| Lab results | SPII | 7 years | Archive | CLIA requirement |
| Imaging/radiology | SPII | 7 years (adult), age 18+7 (minor) | Archive | State varies |
| Prescription records | SPII | 7 years | Archive | DEA/state pharmacy |
| Insurance claims | Financial | 7 years | Archive | Tax/audit |
| Consent forms | SPII | Duration of treatment + 7 years | Archive | Must prove consent |
| Clinical trial data | SPII | Completion + 15 years | Archive | FDA requirement |
| Employee health records | SPII | Employment + 30 years | Archive | OSHA requirement |
| HIPAA compliance logs | Operational | 6 years | Archive | HIPAA requirement |
| Business associate agreements | Operational | Term + 6 years | Archive | HIPAA requirement |

---

## Human Resources (Cross-Industry) {#hr}

| Data Type | Classification | Retention Period | Action After | Notes |
|---|---|---|---|---|
| Job applications (hired) | PII | Employment + 3 years | Delete | Discrimination claims |
| Job applications (not hired) | PII | Decision + 6-12 months | Delete | Varies by jurisdiction |
| Employment contracts | PII | Termination + 7 years | Archive | Legal requirement |
| Payroll records | Financial | 7 years | Archive then delete | Tax requirement |
| Tax withholding (W-4/equivalent) | SPII | Employment + 4 years | Delete | Tax requirement |
| Performance reviews | PII | Employment + 3 years | Delete | Dispute resolution |
| Disciplinary records | PII | Employment + 7 years | Delete | Legal protection |
| Training records | Operational | Employment + 3 years | Delete | Compliance evidence |
| I-9/work authorization | SPII | Termination + 3 years or hire + 1 year | Delete | Immigration law |
| Benefits enrollment | PII | Employment + 7 years | Delete | ERISA/tax |
| Workers' comp claims | SPII | Closure + 7 years | Archive | Insurance/legal |
| Exit interviews | PII | 3 years | Anonymize | Useful for trends |
| Background checks | SPII | Hire decision + 1 year | Delete | FCRA requirement |

---

## Template Customization Guide {#customization}

When adapting these templates to a specific organization:

### Step 1: Identify your data types
Map your actual data stores to the template categories. Add any data types the template
doesn't cover. Remove data types you don't collect.

### Step 2: Check your jurisdictions
Cross-reference each row against the applicable regulations from `regulatory-frameworks.md`.
Adjust periods where your jurisdiction requires longer or allows shorter retention.

### Step 3: Align with business needs
Some data has business value beyond the legal minimum. For example, customer support tickets
may be valuable for AI training — but this requires a separate lawful basis and must be
documented.

### Step 4: Set classification levels
Verify the classification matches your organization's definitions. SPII in one org may be
PII in another depending on context.

### Step 5: Define actions
For each row, decide: delete, archive, or anonymize? The choice depends on:
- Whether the data has residual analytical value (→ anonymize)
- Whether you may need to retrieve it for legal purposes (→ archive)
- Whether there's no further use (→ delete)

### Step 6: Add legal holds
Every schedule needs a legal hold override. Add a priority-1 retain rule that triggers
when `legal_hold: true` or when the record is tagged with `litigation`.

### Step 7: Document and approve
The retention schedule must be:
- Documented as a formal policy
- Approved by legal counsel and the DPO
- Communicated to all data owners
- Reviewed annually (minimum)
- Updated when regulations change
