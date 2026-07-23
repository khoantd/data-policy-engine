import { describe, expect, it } from "vitest";
import { auditHoldId, auditScheduleFields } from "./audit-payload";

describe("auditScheduleFields", () => {
  it("reads grace_period_ends and notify_at strings", () => {
    expect(
      auditScheduleFields({
        grace_period_ends: "2026-08-21T00:00:00Z",
        notify_at: "2026-08-14T00:00:00Z",
      }),
    ).toEqual({
      gracePeriodEnds: "2026-08-21T00:00:00Z",
      notifyAt: "2026-08-14T00:00:00Z",
    });
  });

  it("returns nulls for missing payload", () => {
    expect(auditScheduleFields(undefined)).toEqual({
      gracePeriodEnds: null,
      notifyAt: null,
    });
    expect(auditScheduleFields(null)).toEqual({
      gracePeriodEnds: null,
      notifyAt: null,
    });
  });

  it("ignores empty strings and wrong types", () => {
    expect(
      auditScheduleFields({
        grace_period_ends: "",
        notify_at: 123,
        other: "x",
      }),
    ).toEqual({
      gracePeriodEnds: null,
      notifyAt: null,
    });
  });

  it("reads only present string fields", () => {
    expect(
      auditScheduleFields({
        grace_period_ends: "2026-08-21T00:00:00Z",
      }),
    ).toEqual({
      gracePeriodEnds: "2026-08-21T00:00:00Z",
      notifyAt: null,
    });
  });
});

describe("auditHoldId", () => {
  it("reads hold_id", () => {
    expect(auditHoldId({ hold_id: "gh_abc" })).toBe("gh_abc");
    expect(auditHoldId({})).toBeNull();
    expect(auditHoldId(null)).toBeNull();
  });
});
