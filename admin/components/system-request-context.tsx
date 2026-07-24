"use client";

import Link from "next/link";
import { Server } from "lucide-react";
import type { SystemResponse } from "@/lib/types";
import {
  applySystemToRequestFields,
  findSystemById,
  resolveSystemSource,
} from "@/lib/system-request-context";
import { useLazySystemPolicies } from "@/lib/use-lazy-system-policies";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type SystemRequestContextProps = {
  systems: SystemResponse[];
  systemId: string;
  onSystemIdChange: (systemId: string) => void;
  onSourceFromSystem: (source: string) => void;
  /** Currently selected policy id (target / classification) for chip highlight. */
  selectedPolicyId?: string;
  disabled?: boolean;
  selectId?: string;
};

/**
 * Optional catalog System picker for Evaluate / Scan playgrounds.
 * Syncs source_key → request source; shows governance-linked policy chips.
 */
export function SystemRequestContext({
  systems,
  systemId,
  onSystemIdChange,
  onSourceFromSystem,
  selectedPolicyId = "",
  disabled,
  selectId,
}: SystemRequestContextProps) {
  const selected = findSystemById(systems, systemId || null);
  const resolution = selected ? resolveSystemSource(selected) : null;
  const {
    policyIds: linkedPolicyIds,
    loading: linksLoading,
    error: linksError,
  } = useLazySystemPolicies(systemId || null);

  function handleChange(nextId: string) {
    onSystemIdChange(nextId);
    if (!nextId) return;
    const system = findSystemById(systems, nextId);
    if (!system) return;
    const fields = applySystemToRequestFields(system);
    onSourceFromSystem(fields.source);
  }

  if (systems.length === 0) {
    return (
      <p className="text-xs text-muted-fg" role="status">
        No active systems in the catalog.{" "}
        <Link
          href="/systems"
          className="text-secondary underline-offset-2 hover:underline cursor-pointer"
        >
          Add a system
        </Link>{" "}
        to seed request source from{" "}
        <code className="font-mono text-xs">source_key</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="System (optional)"
        id={selectId}
        value={systemId}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">None — enter source manually</option>
        {systems.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
            {s.source_key ? ` · ${s.source_key}` : " · no source key"}
          </option>
        ))}
      </Select>

      {selected && (
        <div
          className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-fg motion-safe:transition-colors motion-safe:duration-200"
          aria-live="polite"
        >
          <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <Server className="size-3.5 shrink-0" aria-hidden />
            {selected.name}
          </p>
          <p className="mt-1">
            Maps to request{" "}
            <code className="font-mono text-xs">source</code>
            {resolution?.source ? (
              <>
                {" "}
                via{" "}
                <code className="font-mono text-xs">{resolution.source}</code>
              </>
            ) : (
              " when a source key is set"
            )}
            . Governance links do not change engine matching.{" "}
            <Link
              href={`/systems/${encodeURIComponent(selected.id)}`}
              className="text-secondary underline-offset-2 hover:underline cursor-pointer"
            >
              View system
            </Link>
          </p>

          {resolution?.warning && (
            <p
              className="mt-2 rounded-md border border-accent/40 bg-accent/10 px-2 py-1.5 text-accent"
              role="status"
            >
              {resolution.warning}
            </p>
          )}

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
              <p className="mt-1">No policies linked to this system.</p>
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
