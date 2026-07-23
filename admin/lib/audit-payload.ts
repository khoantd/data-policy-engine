/** Safely read schedule fields from an audit entry payload. */

export type AuditScheduleFields = {
  gracePeriodEnds: string | null;
  notifyAt: string | null;
};

function readOptionalString(
  payload: Record<string, unknown> | null | undefined,
  key: string,
): string | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** Extract grace_period_ends / notify_at from audit payload (pending_grace, notify, …). */
export function auditScheduleFields(
  payload: Record<string, unknown> | null | undefined,
): AuditScheduleFields {
  return {
    gracePeriodEnds: readOptionalString(payload, "grace_period_ends"),
    notifyAt: readOptionalString(payload, "notify_at"),
  };
}

/** Extract hold_id from pending_grace payload when present. */
export function auditHoldId(
  payload: Record<string, unknown> | null | undefined,
): string | null {
  return readOptionalString(payload, "hold_id");
}
