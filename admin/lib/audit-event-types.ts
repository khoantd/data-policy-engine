import type { AuditEventType } from "@/lib/types";

/** Human-facing options for Event type filters (Audit + Insights). Values match API enum. */
export const AUDIT_EVENT_TYPE_OPTIONS: ReadonlyArray<{
  value: AuditEventType;
  label: string;
  /** Short hint: when written / why filter */
  hint: string;
}> = [
  {
    value: "evaluation",
    label: "Evaluation",
    hint: "Policy evaluated for a record — decision trail before actions",
  },
  {
    value: "action",
    label: "Action",
    hint: "Retention action applied (delete/anonymize/etc.)",
  },
  {
    value: "notify",
    label: "Notify",
    hint: "Notification step fired (e.g. pre-deletion notice)",
  },
  {
    value: "pending_grace",
    label: "Pending grace",
    hint: "Record entered grace period — action deferred",
  },
  {
    value: "flag",
    label: "Flag",
    hint: "Rule matched with flag (review-only, not hard action)",
  },
  {
    value: "dsar_access",
    label: "DSAR access",
    hint: "Subject-access DSAR completed",
  },
  {
    value: "dsar_erasure",
    label: "DSAR erasure",
    hint: "Erasure DSAR completed",
  },
];
