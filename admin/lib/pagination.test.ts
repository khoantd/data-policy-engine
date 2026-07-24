import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_SIZE,
  buildPageHref,
  clampPage,
  paginateItems,
  parsePage,
  resolveOffsetPage,
  toListQuery,
} from "./pagination";

describe("parsePage", () => {
  it("defaults to 1 for missing or invalid values", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("abc")).toBe(1);
  });

  it("parses positive integers", () => {
    expect(parsePage("1")).toBe(1);
    expect(parsePage("12")).toBe(12);
  });
});

describe("clampPage", () => {
  it("clamps to available pages when total is known", () => {
    expect(clampPage(1, 0)).toBe(1);
    expect(clampPage(5, 3)).toBe(3);
    expect(clampPage(0, 3)).toBe(1);
  });
});

describe("paginateItems", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("slices the current page and reports totals", () => {
    const result = paginateItems(items, 2, 2);
    expect(result.items).toEqual(["c", "d"]);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(2);
    expect(result.total).toEqual(5);
    expect(result.totalPages).toBe(3);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(true);
    expect(result.from).toBe(3);
    expect(result.to).toBe(4);
  });

  it("clamps past-the-end pages to the last page", () => {
    const result = paginateItems(items, 99, 2);
    expect(result.page).toBe(3);
    expect(result.items).toEqual(["e"]);
    expect(result.hasNext).toBe(false);
  });

  it("uses DEFAULT_PAGE_SIZE when pageSize omitted", () => {
    const many = Array.from({ length: DEFAULT_PAGE_SIZE + 5 }, (_, i) => i);
    const result = paginateItems(many, 1);
    expect(result.items).toHaveLength(DEFAULT_PAGE_SIZE);
    expect(result.hasNext).toBe(true);
  });

  it("handles empty lists", () => {
    const result = paginateItems([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.from).toBe(0);
    expect(result.to).toBe(0);
    expect(result.hasPrev).toBe(false);
    expect(result.hasNext).toBe(false);
  });
});

describe("resolveOffsetPage", () => {
  it("detects a following page via over-fetch", () => {
    const fetched = [1, 2, 3, 4];
    const result = resolveOffsetPage(fetched, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
    expect(result.from).toBe(1);
    expect(result.to).toBe(3);
    expect(result.total).toBeUndefined();
  });

  it("marks the last page when fewer than pageSize+1 returned", () => {
    const result = resolveOffsetPage([1, 2], 2, 3);
    expect(result.items).toEqual([1, 2]);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
    expect(result.from).toBe(4);
    expect(result.to).toBe(5);
  });
});

describe("toListQuery", () => {
  it("builds limit/offset from page and over-fetches by one", () => {
    expect(toListQuery(1, 25)).toEqual({ limit: 26, offset: 0 });
    expect(toListQuery(3, 25)).toEqual({ limit: 26, offset: 50 });
  });
});

describe("buildPageHref", () => {
  it("merges page into existing query params and drops page=1", () => {
    expect(
      buildPageHref("/audit", { event_type: "action", page: "2" }, 3),
    ).toBe("/audit?event_type=action&page=3");
    expect(buildPageHref("/policies", { q: "gdpr", page: "4" }, 1)).toBe(
      "/policies?q=gdpr",
    );
  });

  it("omits empty filter values", () => {
    expect(
      buildPageHref("/audit", { event_type: "", policy_id: "p1" }, 2),
    ).toBe("/audit?policy_id=p1&page=2");
  });
});
