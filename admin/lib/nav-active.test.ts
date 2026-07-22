import { describe, expect, it } from "vitest";
import { isNavActive, matchesNavHref } from "./nav-active";

const NAV_HREFS = [
  "/",
  "/policies",
  "/policies/import",
  "/dsar",
  "/audit",
  "/enforce",
  "/webhooks",
  "/evaluate",
  "/classify",
  "/observability",
];

describe("matchesNavHref", () => {
  it("treats / as exact-only", () => {
    expect(matchesNavHref("/", "/")).toBe(true);
    expect(matchesNavHref("/policies", "/")).toBe(false);
  });

  it("matches exact and nested paths", () => {
    expect(matchesNavHref("/policies", "/policies")).toBe(true);
    expect(matchesNavHref("/policies/abc", "/policies")).toBe(true);
    expect(matchesNavHref("/policies/import", "/policies")).toBe(true);
    expect(matchesNavHref("/policy", "/policies")).toBe(false);
  });
});

describe("isNavActive", () => {
  it("activates All policies on list and policy detail", () => {
    expect(isNavActive("/policies", "/policies", NAV_HREFS)).toBe(true);
    expect(isNavActive("/policies", "/policies/import", NAV_HREFS)).toBe(false);
    expect(isNavActive("/policies/gdpr-customer", "/policies", NAV_HREFS)).toBe(
      true,
    );
    expect(
      isNavActive("/policies/gdpr-customer", "/policies/import", NAV_HREFS),
    ).toBe(false);
  });

  it("activates only Import on /policies/import", () => {
    expect(isNavActive("/policies/import", "/policies", NAV_HREFS)).toBe(false);
    expect(isNavActive("/policies/import", "/policies/import", NAV_HREFS)).toBe(
      true,
    );
  });

  it("activates Overview only on /", () => {
    expect(isNavActive("/", "/", NAV_HREFS)).toBe(true);
    expect(isNavActive("/policies", "/", NAV_HREFS)).toBe(false);
  });
});
