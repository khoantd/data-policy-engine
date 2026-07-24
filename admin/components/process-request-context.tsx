"use client";

import Link from "next/link";
import { Workflow } from "lucide-react";
import type { ProcessResponse } from "@/lib/types";
import { findProcessById } from "@/lib/system-request-context";
import { useLazyProcessPolicies } from "@/lib/use-lazy-process-policies";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type ProcessRequestContextProps = {
  processes: ProcessResponse[];
  processId: string;
  onProcessIdChange: (processId: string) => void;
  /** Currently selected policy id (target / classification) for chip highlight. */
  selectedPolicyId?: string;
  disabled?: boolean;
  selectId?: string;
};

/**
 * Optional catalog Process picker for Evaluate / Scan playgrounds.
 * Shows governance-linked policy chips only (processes have no source_key).
 */
export function ProcessRequestContext({
  processes,
  processId,
  onProcessIdChange,
  selectedPolicyId = "",
  disabled,
  selectId,
}: ProcessRequestContextProps) {
  const selected = findProcessById(processes, processId || null);
  const {
    policyIds: linkedPolicyIds,
    loading: linksLoading,
    error: linksError,
  } = useLazyProcessPolicies(processId || null);

  if (processes.length === 0) {
    return (
      <p className="text-xs text-muted-fg" role="status">
        No active processes in the catalog.{" "}
        <Link
          href="/processes"
          className="text-secondary underline-offset-2 hover:underline cursor-pointer"
        >
          Add a process
        </Link>{" "}
        to show governance-linked policies here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Process (optional)"
        id={selectId}
        value={processId}
        disabled={disabled}
        onChange={(e) => onProcessIdChange(e.target.value)}
      >
        <option value="">None</option>
        {processes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      {selected && (
        <div
          className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-fg motion-safe:transition-colors motion-safe:duration-200"
          aria-live="polite"
        >
          <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <Workflow className="size-3.5 shrink-0" aria-hidden />
            {selected.name}
          </p>
          <p className="mt-1">
            Governance context only — process links do not change engine
            matching or request{" "}
            <code className="font-mono text-xs">source</code>.{" "}
            <Link
              href={`/processes/${encodeURIComponent(selected.id)}`}
              className="text-secondary underline-offset-2 hover:underline cursor-pointer"
            >
              View process
            </Link>
          </p>

          <div className="mt-2">
            <p className="font-medium text-foreground">
              Applies to (governance)
            </p>
            {linksLoading && (
              <p className="mt-1 text-muted-fg">Loading linked policies…</p>
            )}
            {linksError && (
              <p className="mt-1 text-destructive" role="alert">
                {linksError}
              </p>
            )}
            {!linksLoading && !linksError && linkedPolicyIds.length === 0 && (
              <p className="mt-1">No policies linked to this process.</p>
            )}
            {!linksLoading && linkedPolicyIds.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {linkedPolicyIds.map((id) => {
                  const isSelectedPolicy = id === selectedPolicyId;
                  return (
                    <Link
                      key={id}
                      href={`/policies/${encodeURIComponent(id)}`}
                      className={cn(
                        "cursor-pointer rounded-md border px-2 py-0.5 font-mono text-[11px] motion-safe:transition-colors motion-safe:duration-150",
                        isSelectedPolicy
                          ? "border-success/50 bg-success/10 text-success"
                          : "border-border text-foreground hover:border-secondary",
                      )}
                    >
                      {id}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
