import { cn } from "@/lib/utils";

export function YamlCodeEditorSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-surface",
        className,
      )}
      aria-hidden
    >
      <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/60 px-3">
        <div className="h-4 w-10 animate-pulse rounded bg-border" />
        <div className="ml-auto h-4 w-16 animate-pulse rounded bg-border" />
      </div>
      <div className="min-h-[22rem] space-y-2 p-4">
        <div className="h-3 w-[75%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[50%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[85%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[66%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[80%] animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
