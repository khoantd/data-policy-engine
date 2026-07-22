# Policy DSL Specification

Reference for authoring YAML-based data retention policies. Read this file when the user
wants to write, validate, or debug policy definitions.

---

## Table of Contents

1. [Policy Structure](#structure)
2. [Condition Operators](#operators)
3. [Condition Groups (Boolean Logic)](#condition-groups)
4. [Actions](#actions)
5. [Duration Format](#duration)
6. [Scope & Filtering](#scope)
7. [DSAR Configuration](#dsar)
8. [Audit Configuration](#audit)
9. [Evaluation Logic](#evaluation)
10. [Conflict Resolution](#conflicts)
11. [Worked Examples](#examples)

---

## Policy Structure {#structure}

Every policy is a YAML document under a `policy:` root key:

```yaml
policy:
  # ── Identity ──
  id: pol_<unique_slug>              # Required. Unique identifier.
  name: "Human-readable name"        # Required. Descriptive title.
  version: 1                         # Auto-incremented on update.
  status: active                     # draft | active | deprecated | archived

  # ── Classification ──
  jurisdiction: EU_GDPR              # EU_GDPR | VN_PDPD | SG_PDPA | GLOBAL | CUSTOM
  data_classification: PII           # PII | SPII | financial | operational | public
  owner: "dpo@company.com"           # Accountable person/role
  effective_from: "2025-01-01"       # ISO 8601. Policy active from this date.
  expires_at: null                   # null = no expiry. Set for time-bound policies.
  tags: ["gdpr", "customer"]         # Arbitrary tags for filtering/search.

  # ── Scope ──
  scope:
    data_types: [...]                # Required. Which data types this policy covers.
    sources: [...]                   # Optional. Which source systems.
    exclude:                         # Optional. Exceptions.
      data_types: [...]
      sources: [...]

  # ── Rules ──
  rules:                             # Required. At least one rule.
    - id: rule_<slug>
      description: "..."
      priority: 100                  # 1-10000. Lower = higher priority.
      condition: { ... }             # ConditionGroup (see below)
      action: delete                 # Action type (see below)
      grace_period: "30d"            # Optional. Wait before executing action.
      notify_before: "7d"            # Optional. Notification before grace period ends.
      requires_approval: false       # Optional. Manual approval before execution.
      archive_target: "cold_storage" # Optional. For archive action.
      retain_until: "event_name"     # Optional. For retain action.
      anonymize_fields: [...]        # Optional. For anonymize action.

  # ── DSAR ──
  dsar:
    right_to_access: true
    right_to_erasure: true
    erasure_exceptions: ["legal_obligation"]
    response_deadline: "30d"

  # ── Audit ──
  audit:
    log_evaluations: true
    log_actions: true
    retention_of_audit_logs: "3650d"
```

---

## Condition Operators {#operators}

| Operator | Description | Value Type | Example |
|---|---|---|---|
| `eq` | Equals | any | `value: "inactive"` |
| `neq` | Not equals | any | `value: "deleted"` |
| `gt` | Greater than | number/date | `value: 100` |
| `gte` | Greater than or equal | number/date | `value: 18` |
| `lt` | Less than | number/date | `value: 0` |
| `lte` | Less than or equal | number/date | `value: 99` |
| `in` | Value in list | list | `value: ["a", "b", "c"]` |
| `not_in` | Value not in list | list | `value: ["internal", "test"]` |
| `contains` | List/string contains value | any | `value: "litigation"` |
| `older_than` | Datetime field older than duration | duration | `value: "730d"` |
| `newer_than` | Datetime field newer than duration | duration | `value: "30d"` |
| `is_null` | Field is null/not null | boolean | `value: true` |
| `regex` | Matches regex pattern | string | `value: "^temp_.*"` |

**`older_than` / `newer_than` behavior:**
These operators compare a datetime field against a duration relative to the evaluation
timestamp (usually "now"). `older_than: "730d"` means "the field value is more than 730 days
before the evaluation time." This is the primary mechanism for time-based retention rules.

---

## Condition Groups (Boolean Logic) {#condition-groups}

Conditions are grouped using `all` (AND), `any` (OR), or `none` (NOT):

```yaml
# AND: all conditions must be true
condition:
  all:
    - field: "status"
      operator: "eq"
      value: "inactive"
    - field: "last_activity_at"
      operator: "older_than"
      value: "730d"

# OR: at least one condition must be true
condition:
  any:
    - field: "legal_hold"
      operator: "eq"
      value: true
    - field: "tags"
      operator: "contains"
      value: "litigation"

# NOT: none of the conditions may be true
condition:
  none:
    - field: "status"
      operator: "eq"
      value: "active"
```

**Nesting is supported** — you can nest groups within groups:

```yaml
condition:
  all:
    - field: "status"
      operator: "eq"
      value: "inactive"
    - any:
        - field: "region"
          operator: "eq"
          value: "EU"
        - field: "region"
          operator: "eq"
          value: "UK"
```

This reads as: status is inactive AND (region is EU OR region is UK).

---

## Actions {#actions}

| Action | Description | Reversible? | GDPR Status |
|---|---|---|---|
| `retain` | Keep data as-is. Overrides other rules. | N/A | Still personal data |
| `archive` | Move to cold/archive storage | Yes | Still personal data |
| `anonymize` | Remove all identifying fields | No | No longer personal data |
| `pseudonymize` | Replace identifiers with tokens | Yes (with key) | Still personal data |
| `delete` | Permanently remove after grace period | No | Data destroyed |
| `notify` | Alert data owner, no data action | N/A | No change to data |
| `flag` | Mark for manual review | N/A | No change to data |

**Action selection guidance:**

- Use `retain` for legal holds and records actively needed
- Use `archive` when data is no longer active but may be needed for audit/legal
- Use `anonymize` when you need the data for analytics but not identification
- Use `pseudonymize` when you may need to re-identify (e.g., for DSAR response)
- Use `delete` when no further purpose or legal basis exists
- Use `notify` as a pre-action (notify before a future delete/archive)
- Use `flag` when the decision requires human judgment

---

## Duration Format {#duration}

Duration strings use a number followed by a unit suffix:

| Suffix | Unit | Example | Equivalent |
|---|---|---|---|
| `m` | Minutes | `90m` | 90 minutes |
| `h` | Hours | `24h` | 1 day |
| `d` | Days | `730d` | ~2 years |
| `w` | Weeks | `52w` | ~1 year |
| `y` | Years | `7y` | 7 × 365 days |

Used in: `older_than`, `newer_than`, `grace_period`, `notify_before`, `response_deadline`,
`retention_of_audit_logs`.

---

## Scope & Filtering {#scope}

The `scope` section determines which data records a policy applies to:

```yaml
scope:
  data_types:
    - customer_profile      # This policy covers these data types
    - customer_contact
  sources:
    - crm_system            # Only from these source systems (optional)
    - marketing_platform
  exclude:
    data_types:
      - anonymized_analytics  # Explicitly excluded data types
    sources:
      - test_environment      # Excluded sources
```

**Matching logic:**
1. Record's `data_type` must be in `scope.data_types`
2. If `scope.sources` is set, record's `source` must be in the list
3. If `scope.exclude.data_types` is set, record's `data_type` must NOT be in the list
4. If `scope.exclude.sources` is set, record's `source` must NOT be in the list

---

## DSAR Configuration {#dsar}

Each policy defines how Data Subject Access Requests are handled for its data types:

```yaml
dsar:
  right_to_access: true           # Allow data subjects to request their data
  right_to_erasure: true          # Allow data subjects to request deletion
  erasure_exceptions:             # Grounds for refusing erasure
    - "legal_obligation"          # Tax/audit retention requirements
    - "public_interest"           # Public health, research
    - "legal_claims"              # Active/anticipated litigation
    - "freedom_of_expression"     # Journalism, art
  response_deadline: "30d"        # Max time to respond to a DSAR
```

---

## Audit Configuration {#audit}

```yaml
audit:
  log_evaluations: true           # Log every policy evaluation
  log_actions: true               # Log every enforcement action
  retention_of_audit_logs: "3650d"  # How long to keep audit logs (10 years)
```

**Best practice:** Set `retention_of_audit_logs` to be LONGER than the longest data retention
period in the policy. You need audit records to prove you complied with deletion obligations
even after the data is gone.

---

## Evaluation Logic {#evaluation}

When a record is evaluated against all policies:

```
1. Filter policies by:
   a. Status = active
   b. effective_from <= now (or null)
   c. expires_at > now (or null)
   d. Scope matches record's data_type and source
   e. Jurisdiction matches record's jurisdiction (or GLOBAL)

2. For each applicable policy:
   a. Sort rules by priority (ascending — lowest number first)
   b. Evaluate rules top-to-bottom
   c. First matching rule = that policy's verdict

3. Collect all policy verdicts

4. Resolve conflicts:
   a. Sort all matches by priority (ascending)
   b. Lowest priority number wins
   c. If multiple matches with same priority → flag as ambiguous

5. Return result:
   - action, matched_policy, matched_rule, confidence, grace_period, audit_ref
```

**Confidence levels:**
- `definitive` — Single clear match, no conflicts
- `resolved` — Multiple matches, resolved by priority
- `ambiguous` — Multiple matches at same priority, needs manual review
- `no_match` — No applicable policy. Default action: `retain`

---

## Conflict Resolution {#conflicts}

When multiple policies match the same record:

**Rule 1: Priority wins.** The match with the lowest priority number takes effect.

**Rule 2: Legal hold is absolute.** A `retain` action from a legal hold rule (priority 1)
always overrides delete/archive/anonymize from other policies.

**Rule 3: Same-priority ties are flagged.** If two matches have identical priority numbers
but different actions, the result confidence is `ambiguous` and requires manual review.

**Design guidance to avoid conflicts:**
- Reserve priority 1-10 for legal holds and regulatory overrides
- Use priority 50-200 for standard retention rules
- Use priority 500+ for default/fallback rules
- Avoid overlapping scopes between policies in the same jurisdiction

---

## Worked Examples {#examples}

### Example 1: E-commerce customer data (GDPR)

```yaml
policy:
  id: pol_ecom_customer_gdpr
  name: "E-commerce Customer Data — GDPR"
  status: active
  jurisdiction: EU_GDPR
  data_classification: PII
  owner: "dpo@shop.eu"
  scope:
    data_types: [customer_profile, shipping_address, payment_method_token]
    sources: [ecommerce_platform]

  rules:
    - id: rule_legal_hold
      priority: 1
      condition:
        any:
          - field: "legal_hold"
            operator: "eq"
            value: true
      action: retain

    - id: rule_inactive_customer
      priority: 100
      description: "Delete inactive customers after 2 years"
      condition:
        all:
          - field: "status"
            operator: "eq"
            value: "inactive"
          - field: "last_order_at"
            operator: "older_than"
            value: "730d"
      action: delete
      grace_period: "30d"
      notify_before: "7d"

    - id: rule_old_active_anonymize
      priority: 200
      description: "Anonymize active customers with no orders in 5 years"
      condition:
        all:
          - field: "status"
            operator: "eq"
            value: "active"
          - field: "last_order_at"
            operator: "older_than"
            value: "1825d"
      action: anonymize
      anonymize_fields: [name, email, phone, shipping_address]

  dsar:
    right_to_access: true
    right_to_erasure: true
    erasure_exceptions: ["legal_obligation"]
    response_deadline: "30d"

  audit:
    log_evaluations: true
    log_actions: true
    retention_of_audit_logs: "3650d"
```

### Example 2: Financial transaction records (SOX + GDPR)

```yaml
policy:
  id: pol_financial_transactions
  name: "Financial Transaction Records"
  status: active
  jurisdiction: GLOBAL
  data_classification: financial
  owner: "cfo@company.com"
  scope:
    data_types: [invoice, payment, receipt, tax_document]
    sources: [erp_system, accounting_system]

  rules:
    - id: rule_legal_hold
      priority: 1
      condition:
        any:
          - field: "legal_hold"
            operator: "eq"
            value: true
          - field: "audit_flag"
            operator: "eq"
            value: true
      action: retain

    - id: rule_archive_after_3y
      priority: 100
      description: "Archive to cold storage after 3 years"
      condition:
        all:
          - field: "created_at"
            operator: "older_than"
            value: "1095d"
          - field: "created_at"
            operator: "newer_than"
            value: "2555d"
      action: archive
      archive_target: "s3_glacier"

    - id: rule_delete_after_7y
      priority: 200
      description: "Delete after 7-year SOX retention period"
      condition:
        all:
          - field: "created_at"
            operator: "older_than"
            value: "2555d"
      action: delete
      grace_period: "90d"
      requires_approval: true

  dsar:
    right_to_access: true
    right_to_erasure: false
    erasure_exceptions: ["legal_obligation"]
    response_deadline: "30d"

  audit:
    log_evaluations: true
    log_actions: true
    retention_of_audit_logs: "3650d"
```

### Example 3: HR employee records (Vietnam PDPD)

```yaml
policy:
  id: pol_hr_employee_vn
  name: "Employee Records — Vietnam PDPD"
  status: active
  jurisdiction: VN_PDPD
  data_classification: SPII
  owner: "hr_director@company.vn"
  scope:
    data_types: [employee_profile, payroll, tax_filing, insurance_record]
    sources: [hrm_system]

  rules:
    - id: rule_active_employee
      priority: 50
      description: "Retain all active employee records"
      condition:
        all:
          - field: "employment_status"
            operator: "eq"
            value: "active"
      action: retain

    - id: rule_terminated_archive
      priority: 100
      description: "Archive terminated employee records after 1 year"
      condition:
        all:
          - field: "employment_status"
            operator: "eq"
            value: "terminated"
          - field: "termination_date"
            operator: "older_than"
            value: "365d"
      action: archive
      archive_target: "hr_archive"

    - id: rule_terminated_delete
      priority: 200
      description: "Delete terminated employee records after 5 years"
      condition:
        all:
          - field: "employment_status"
            operator: "eq"
            value: "terminated"
          - field: "termination_date"
            operator: "older_than"
            value: "1825d"
      action: delete
      grace_period: "30d"
      requires_approval: true

  dsar:
    right_to_access: true
    right_to_erasure: true
    erasure_exceptions: ["legal_obligation"]
    response_deadline: "30d"

  audit:
    log_evaluations: true
    log_actions: true
    retention_of_audit_logs: "3650d"
```
