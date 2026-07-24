import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-muted", className)} aria-hidden />
  );
}

/** Route-level skeleton: page header pulse + KPI strip + content card. */
export function PageSkeleton({
  className,
  kpiCount = 4,
  rows = 6,
}: {
  className?: string;
  kpiCount?: number;
  rows?: number;
}) {
  return (
    <div
      className={cn("space-y-5", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="mb-5 space-y-2">
        <Pulse className="h-3 w-40 bg-border" />
        <Pulse className="h-7 w-48" />
        <Pulse className="h-4 w-72 max-w-full" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: kpiCount }, (_, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
          >
            <Pulse className="h-4 w-16 bg-border" />
            <Pulse className="h-4 w-10" />
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-md border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <Pulse className="h-4 w-28 bg-border" />
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: rows }, (_, i) => (
            <Pulse
              key={i}
              className={
                i % 4 === 0
                  ? "h-3 w-3/4"
                  : i % 4 === 1
                    ? "h-3 w-1/2"
                    : i % 4 === 2
                      ? "h-3 w-5/6"
                      : "h-3 w-2/3"
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Compact fallback for Suspense holes under a static PageHeader. */
export function ContentSkeleton({
  className,
  kpiCount = 6,
  rows = 5,
}: {
  className?: string;
  kpiCount?: number;
  rows?: number;
}) {
  return (
    <div
      className={cn("space-y-4", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading content"
    >
      {kpiCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: kpiCount }, (_, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
            >
              <Pulse className="h-4 w-14 bg-border" />
              <Pulse className="h-4 w-8" />
            </div>
          ))}
        </div>
      )}
      <section className="overflow-hidden rounded-md border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <Pulse className="h-4 w-24 bg-border" />
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: rows }, (_, i) => (
            <Pulse key={i} className="h-3 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
