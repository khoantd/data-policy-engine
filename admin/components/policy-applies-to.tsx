"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  setPolicyProcessesAction,
  setPolicySystemsAction,
} from "@/lib/actions";
import { ProcessResponse, SystemResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { ErrorAlert, EmptyState } from "@/components/ui/layout";

export function PolicyAppliesToPanel({
  policyId,
  linkedSystems,
  linkedProcesses,
  allSystems,
  allProcesses,
}: {
  policyId: string;
  linkedSystems: SystemResponse[];
  linkedProcesses: ProcessResponse[];
  allSystems: SystemResponse[];
  allProcesses: ProcessResponse[];
}) {
  const systemsBound = setPolicySystemsAction.bind(null, policyId);
  const processesBound = setPolicyProcessesAction.bind(null, policyId);
  const [sysState, sysAction, sysPending] = useActionState(systemsBound, null);
  const [procState, procAction, procPending] = useActionState(
    processesBound,
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-fg">
        Governance mapping only — does not change evaluate or classify matching.
      </p>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Systems</h3>
        {linkedSystems.length === 0 ? (
          <EmptyState message="No systems linked." />
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {linkedSystems.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/systems/${encodeURIComponent(s.id)}`}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {s.name}
                </Link>
                <span className="ml-2 font-mono text-xs text-muted-fg">
                  {s.id}
                  {s.source_key ? ` · ${s.source_key}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <form action={sysAction} className="flex flex-col gap-2">
          <Textarea
            label="System IDs"
            name="system_ids"
            defaultValue={linkedSystems.map((s) => s.id).join("\n")}
            placeholder="sys_…"
            className="min-h-[4.5rem]"
          />
          {allSystems.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-primary">
                Browse systems ({allSystems.length})
              </summary>
              <ul className="mt-2 max-h-36 overflow-auto rounded-md border border-border bg-muted/40 p-2 font-mono text-xs">
                {allSystems.map((s) => (
                  <li key={s.id}>
                    {s.id} — {s.name}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {sysState?.error && <ErrorAlert message={sysState.error} />}
          {sysState?.ok && sysState.message && (
            <p className="text-sm text-muted-fg" role="status">
              {sysState.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={sysPending}
            className="w-fit cursor-pointer"
          >
            {sysPending ? "Saving…" : "Update systems"}
          </Button>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Processes</h3>
        {linkedProcesses.length === 0 ? (
          <EmptyState message="No processes linked." />
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {linkedProcesses.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/processes/${encodeURIComponent(p.id)}`}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {p.name}
                </Link>
                <span className="ml-2 font-mono text-xs text-muted-fg">
                  {p.id}
                </span>
              </li>
            ))}
          </ul>
        )}
        <form action={procAction} className="flex flex-col gap-2">
          <Textarea
            label="Process IDs"
            name="process_ids"
            defaultValue={linkedProcesses.map((p) => p.id).join("\n")}
            placeholder="proc_…"
            className="min-h-[4.5rem]"
          />
          {allProcesses.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-primary">
                Browse processes ({allProcesses.length})
              </summary>
              <ul className="mt-2 max-h-36 overflow-auto rounded-md border border-border bg-muted/40 p-2 font-mono text-xs">
                {allProcesses.map((p) => (
                  <li key={p.id}>
                    {p.id} — {p.name}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {procState?.error && <ErrorAlert message={procState.error} />}
          {procState?.ok && procState.message && (
            <p className="text-sm text-muted-fg" role="status">
              {procState.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={procPending}
            className="w-fit cursor-pointer"
          >
            {procPending ? "Saving…" : "Update processes"}
          </Button>
        </form>
      </section>
    </div>
  );
}
