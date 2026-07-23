import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BreadcrumbSegment } from "@/lib/breadcrumbs";

export function Breadcrumbs({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-fg">
      <ol className="flex flex-wrap items-center gap-1.5">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={`${segment.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-muted-fg/60" aria-hidden>
                  /
                </span>
              )}
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="hover:text-foreground hover:underline cursor-pointer"
                >
                  {segment.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "font-medium text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {segment.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbSegment[];
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs segments={breadcrumbs} />
        )}
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <div className="mt-1 text-sm text-muted-fg">{description}</div>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function PageToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 rounded-md border border-border bg-surface px-3 py-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ContentCard({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-border bg-surface",
        className,
      )}
    >
      {title && (
        <h2 className="border-b border-border px-4 py-2.5 text-sm font-medium text-foreground">
          {title}
        </h2>
      )}
      <div className={cn(!title && "p-0")}>{children}</div>
    </section>
  );
}

export function Panel({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-border bg-surface p-4 md:p-5",
        className,
      )}
    >
      {title && (
        <h2 className="mb-3 text-sm font-medium text-foreground">{title}</h2>
      )}
      {children}
    </section>
  );
}

const KPI_TONE_CLASS = {
  neutral: "border-border bg-surface",
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  error: "border-destructive/40 bg-destructive/10",
} as const;

const KPI_VALUE_TONE_CLASS = {
  neutral: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
} as const;

export function Kpi({
  label,
  value,
  hint,
  compact,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  compact?: boolean;
  tone?: keyof typeof KPI_TONE_CLASS;
}) {
  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
          KPI_TONE_CLASS[tone],
        )}
      >
        <span className="text-muted-fg">{label}</span>
        <span
          className={cn(
            "font-mono font-medium",
            KPI_VALUE_TONE_CLASS[tone],
          )}
        >
          {value}
        </span>
        {hint && (
          <span className="text-xs text-muted-fg">({hint})</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3",
        KPI_TONE_CLASS[tone],
      )}
    >
      <p className="text-xs font-medium text-muted-fg">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-xl font-semibold",
          KPI_VALUE_TONE_CLASS[tone],
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-fg">{hint}</p>}
    </div>
  );
}

export function KpiStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">{children}</div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted-fg">{message}</p>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </div>
  );
}

export const tableHeaderClass =
  "border-b border-border bg-muted/40 text-xs font-medium text-muted-fg normal-case";

export const tableRowClass =
  "border-b border-border/70 hover:bg-muted/30 motion-safe:transition-colors duration-150";

export const tableCellClass = "px-3 py-1.5";

export function TableWrap({
  children,
  stickyHeader,
}: {
  children: React.ReactNode;
  stickyHeader?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-md border border-border bg-surface",
        stickyHeader && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10",
      )}
    >
      {children}
    </div>
  );
}
