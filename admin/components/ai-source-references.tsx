"use client";

import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useId, useState } from "react";
import type { WebSearchSource } from "@/lib/ai/tavily";
import { cn } from "@/lib/utils";

type AiSourceReferencesProps = {
  sources: WebSearchSource[];
  webSearchConfigured: boolean;
  webSearchEnabled: boolean;
  searching: boolean;
  className?: string;
};

export function AiSourceReferences({
  sources,
  webSearchConfigured,
  webSearchEnabled,
  searching,
  className,
}: AiSourceReferencesProps) {
  const panelId = useId();
  const [open, setOpen] = useState(true);

  if (!webSearchConfigured) {
    return (
      <p
        className={cn(
          "rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-fg",
          className,
        )}
        role="status"
      >
        Web research is off. Set{" "}
        <code className="font-mono text-[0.7rem]">TAVILY_API_KEY</code> in{" "}
        <code className="font-mono text-[0.7rem]">.env.local</code> to enrich
        drafts with current regulatory references.
      </p>
    );
  }

  if (!webSearchEnabled) {
    return null;
  }

  if (searching && sources.length === 0) {
    return (
      <p
        className={cn("text-xs text-muted-fg", className)}
        role="status"
        aria-live="polite"
      >
        Searching references…
      </p>
    );
  }

  if (!searching && sources.length === 0) {
    return (
      <p
        className={cn(
          "rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-fg",
          className,
        )}
        role="status"
      >
        No web references found — using built-in retention guidance.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-muted/30 motion-safe:transition-shadow",
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <ChevronDown className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        )}
        References ({sources.length})
      </button>
      {open && (
        <ul
          id={panelId}
          className="flex flex-col gap-2 border-t border-border px-3 py-2"
          aria-label="Web research references"
        >
          {sources.map((source) => (
            <li key={source.id} className="flex flex-col gap-0.5 text-xs">
              <div className="flex items-start gap-2">
                <span
                  className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] font-medium text-primary"
                  aria-hidden
                >
                  [{source.id}]
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate">{source.title}</span>
                    <ExternalLink className="size-3 shrink-0" aria-hidden />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                  <p className="font-mono text-[0.65rem] text-muted-fg">
                    {source.domain}
                  </p>
                  {source.snippet && (
                    <p className="mt-0.5 line-clamp-2 text-muted-fg">
                      {source.snippet}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
