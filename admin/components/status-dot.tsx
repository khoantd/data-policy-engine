import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "error" | "neutral";

function resolveTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (
    s === "active" ||
    s === "succeeded" ||
    s === "completed" ||
    s === "ready" ||
    s === "ok" ||
    s === "success" ||
    s === "retain" ||
    s === "definitive" ||
    s === "on"
  ) {
    return "success";
  }
  if (
    s === "failed" ||
    s === "denied" ||
    s === "deprecated" ||
    s === "cancelled" ||
    s === "delete" ||
    s === "anonymize" ||
    s === "error"
  ) {
    return "error";
  }
  if (
    s === "running" ||
    s === "in_progress" ||
    s === "queued" ||
    s === "partial" ||
    s === "draft" ||
    s === "pending" ||
    s === "skipped" ||
    s === "off"
  ) {
    return "warning";
  }
  return "neutral";
}

const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  neutral: "bg-muted-fg",
};

export function StatusDot({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const tone = resolveTone(status);
  const display = label ?? status.replace(/_/g, " ");

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span
        className={cn("size-2 shrink-0 rounded-full", TONE_CLASS[tone])}
        aria-hidden
      />
      <span className="capitalize">{display}</span>
    </span>
  );
}
