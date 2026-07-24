import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PaginationState } from "@/lib/pagination";
import { buildPageHref } from "@/lib/pagination";

type SearchParamRecord = Record<string, string | string[] | undefined>;

export function PaginationBar({
  pathname,
  searchParams,
  state,
  className,
}: {
  pathname: string;
  searchParams: SearchParamRecord;
  state: Pick<
    PaginationState<unknown>,
    "page" | "hasPrev" | "hasNext" | "from" | "to" | "total" | "totalPages"
  >;
  className?: string;
}) {
  const { page, hasPrev, hasNext, from, to, total, totalPages } = state;
  if (from === 0 && !hasPrev && !hasNext) return null;

  const summary =
    total != null
      ? `Showing ${from}–${to} of ${total}`
      : `Showing ${from}–${to}`;
  const pageLabel =
    totalPages != null && totalPages > 0
      ? `Page ${page} of ${totalPages}`
      : `Page ${page}`;

  const prevHref = hasPrev
    ? buildPageHref(pathname, searchParams, page - 1)
    : null;
  const nextHref = hasNext
    ? buildPageHref(pathname, searchParams, page + 1)
    : null;

  const linkClass =
    "inline-flex items-center justify-center rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer";
  const disabledClass =
    "inline-flex items-center justify-center rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-sm font-medium text-muted-fg opacity-60 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-muted-fg">
        {summary}
        <span className="mx-1.5 text-muted-fg/50" aria-hidden>
          ·
        </span>
        {pageLabel}
      </p>
      <div className="flex items-center gap-2">
        {prevHref ? (
          <Link href={prevHref} scroll={false} className={linkClass}>
            Previous
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Previous
          </span>
        )}
        {nextHref ? (
          <Link href={nextHref} scroll={false} className={linkClass}>
            Next
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}

/** Client-side Previous/Next when the list lives in component state. */
export function PaginationControls({
  page,
  hasPrev,
  hasNext,
  from,
  to,
  total,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  from: number;
  to: number;
  total?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (from === 0 && !hasPrev && !hasNext) return null;

  const summary =
    total != null
      ? `Showing ${from}–${to} of ${total}`
      : `Showing ${from}–${to}`;
  const pageLabel =
    totalPages != null && totalPages > 0
      ? `Page ${page} of ${totalPages}`
      : `Page ${page}`;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-muted-fg">
        {summary}
        <span className="mx-1.5 text-muted-fg/50" aria-hidden>
          ·
        </span>
        {pageLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
