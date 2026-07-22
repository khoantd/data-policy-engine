import { Shield, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiPrivacyBadge({
  configured,
  entityCount,
  className,
}: {
  configured: boolean;
  entityCount?: number;
  className?: string;
}) {
  const Icon = configured ? Shield : ShieldOff;

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-2 text-xs text-foreground motion-safe:transition-colors",
        className,
      )}
      role="status"
    >
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          configured ? "text-primary" : "text-muted-fg",
        )}
        aria-hidden
      />
      <span>
        {configured ? "Privacy masking on" : "Masking unavailable"}
      </span>
      {configured && entityCount !== undefined && entityCount > 0 && (
        <span className="text-muted-fg">
          · {entityCount} field{entityCount === 1 ? "" : "s"} protected
        </span>
      )}
      {!configured && (
        <span className="text-muted-fg">
          · Install API extra:{" "}
          <code className="font-mono text-[11px]">pip install -e &quot;.[ai]&quot;</code>
        </span>
      )}
    </div>
  );
}
