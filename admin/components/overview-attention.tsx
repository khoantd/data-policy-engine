import Link from "next/link";
import { AlertTriangle, CircleAlert } from "lucide-react";
import type { AttentionItem } from "@/lib/overview-metrics";
import { ContentCard } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

export function OverviewAttention({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) return null;

  return (
    <ContentCard title="Needs attention" className="mb-4">
      <ul className="flex flex-col gap-2 p-4" aria-live="polite">
        {items.map((item) => {
          const Icon = item.severity === "error" ? CircleAlert : AlertTriangle;
          return (
            <li key={`${item.href}-${item.message}`}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer motion-safe:transition-colors duration-150",
                  item.severity === "error"
                    ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15"
                    : "border-warning/30 bg-warning/10 text-warning hover:bg-warning/15",
                )}
              >
                <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{item.message}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </ContentCard>
  );
}
