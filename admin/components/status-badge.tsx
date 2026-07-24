import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const s = status.toLowerCase();
  const tone =
    s === "active" ||
    s === "succeeded" ||
    s === "completed" ||
    s === "ready" ||
    s === "ok" ||
    s === "retain" ||
    s === "definitive"
      ? "bg-success/10 text-success border-success/30"
      : s === "failed" ||
          s === "denied" ||
          s === "deprecated" ||
          s === "cancelled" ||
          s === "delete" ||
          s === "anonymize"
        ? "bg-destructive/10 text-destructive border-destructive/30"
        : s === "archived" || s === "retired"
          ? "bg-muted text-muted-fg border-border"
          : s === "running" ||
            s === "in_progress" ||
            s === "queued" ||
            s === "partial" ||
            s === "draft" ||
            s === "archive" ||
            s === "notify" ||
            s === "flag" ||
            s === "pseudonymize" ||
            s === "none"
          ? "bg-accent/10 text-warning border-accent/30"
          : "bg-muted text-muted-fg border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border capitalize",
        tone,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
