import { describe, expect, it } from "vitest";
import {
  getAvailablePolicyActions,
  statusChangeMessage,
} from "@/lib/policy-status";
import { PolicyStatus } from "@/lib/types";

const ALL_STATUSES: PolicyStatus[] = [
  "draft",
  "active",
  "deprecated",
  "archived",
];

describe("getAvailablePolicyActions", () => {
  it("returns publish for draft", () => {
    const actions = getAvailablePolicyActions("draft");
    expect(actions.map((a) => a.label)).toEqual([
      "Publish",
      "Deprecate",
      "Archive",
    ]);
    expect(actions[0]?.targetStatus).toBe("active");
  });

  it("returns restore, deprecate, archive for active", () => {
    const actions = getAvailablePolicyActions("active");
    expect(actions.map((a) => a.label)).toEqual([
      "Restore to draft",
      "Deprecate",
      "Archive",
    ]);
  });

  it("returns reactivate for deprecated and archived", () => {
    expect(
      getAvailablePolicyActions("deprecated").some((a) => a.label === "Reactivate"),
    ).toBe(true);
    expect(
      getAvailablePolicyActions("archived").some((a) => a.label === "Reactivate"),
    ).toBe(true);
  });

  it("requires confirm on every action", () => {
    for (const status of ALL_STATUSES) {
      for (const action of getAvailablePolicyActions(status)) {
        expect(action.requiresConfirm).toBe(true);
        expect(action.confirmTitle.length).toBeGreaterThan(0);
        expect(action.confirmBody.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("statusChangeMessage", () => {
  it("formats success copy", () => {
    expect(statusChangeMessage("Publish", "active")).toBe(
      "Publish complete — policy is now active.",
    );
  });
});
