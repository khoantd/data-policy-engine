import { describe, expect, it } from "vitest";
import { AUDIT_EVENT_TYPE_OPTIONS } from "./audit-event-types";

const API_ENUM = [
  "evaluation",
  "action",
  "notify",
  "pending_grace",
  "flag",
  "dsar_access",
  "dsar_erasure",
] as const;

describe("AUDIT_EVENT_TYPE_OPTIONS", () => {
  it("covers every OpenAPI AuditEventType value exactly once", () => {
    const values = AUDIT_EVENT_TYPE_OPTIONS.map((o) => o.value);
    expect(values).toEqual([...API_ENUM]);
  });

  it("has non-empty human labels distinct from raw API strings", () => {
    for (const opt of AUDIT_EVENT_TYPE_OPTIONS) {
      expect(opt.label.trim().length).toBeGreaterThan(0);
      expect(opt.label).not.toBe(opt.value);
      expect(opt.hint.trim().length).toBeGreaterThan(0);
    }
  });
});
