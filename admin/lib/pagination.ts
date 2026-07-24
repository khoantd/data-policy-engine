/** Shared list pagination helpers for Admin console listing pages. */

export const DEFAULT_PAGE_SIZE = 25;

export type PaginationState<T> = {
  items: T[];
  page: number;
  pageSize: number;
  /** Present when the full collection size is known (client-side slice). */
  total?: number;
  totalPages?: number;
  hasPrev: boolean;
  hasNext: boolean;
  /** 1-based index of first item on this page, or 0 when empty. */
  from: number;
  /** 1-based index of last item on this page, or 0 when empty. */
  to: number;
};

export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(1, page), totalPages);
}

/** Client-side pagination when the full list is already loaded. */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): PaginationState<T> {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const safePage = clampPage(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const slice = items.slice(offset, offset + pageSize);
  const from = slice.length === 0 ? 0 : offset + 1;
  const to = slice.length === 0 ? 0 : offset + slice.length;

  return {
    items: slice,
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: totalPages > 0 && safePage < totalPages,
    from,
    to,
  };
}

/**
 * Server-side offset pagination. Callers should fetch `pageSize + 1` rows
 * so `hasNext` can be inferred without a total count.
 */
export function resolveOffsetPage<T>(
  fetched: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): PaginationState<T> {
  const safePage = Math.max(1, page);
  const hasNext = fetched.length > pageSize;
  const items = hasNext ? fetched.slice(0, pageSize) : fetched;
  const offset = (safePage - 1) * pageSize;
  const from = items.length === 0 ? 0 : offset + 1;
  const to = items.length === 0 ? 0 : offset + items.length;

  return {
    items,
    page: safePage,
    pageSize,
    hasPrev: safePage > 1,
    hasNext,
    from,
    to,
  };
}

/** Query params for APIs that accept limit/offset (over-fetch by one). */
export function toListQuery(
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): { limit: number; offset: number } {
  const safePage = Math.max(1, page);
  return {
    limit: pageSize + 1,
    offset: (safePage - 1) * pageSize,
  };
}

type SearchParamValue = string | string[] | undefined;

/**
 * Build a pathname+query href for another page, preserving filters.
 * Page 1 omits the `page` query param for cleaner URLs.
 */
export function buildPageHref(
  pathname: string,
  current: Record<string, SearchParamValue>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(current)) {
    if (key === "page") continue;
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value == null || value === "") continue;
    params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
