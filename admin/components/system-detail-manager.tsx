"use client";

import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, ScanSearch } from "lucide-react";
import {
  deleteSystemAction,
  setSystemPoliciesAction,
  updateSystemAction,
} from "@/lib/actions";
import { systemPlaygroundHref } from "@/lib/system-request-context";
import { SystemResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { ErrorAlert, EmptyState, TableWrap } from "@/components/ui/layout";

export function SystemDetailManager({
  system,
  linkedPolicyIds,
  allPolicyOptions,
}: {
  system: SystemResponse;
  linkedPolicyIds: string[];
  allPolicyOptions: { id: string; name: string }[];
}) {
  const updateBound = updateSystemAction.bind(null, system.id);
  const linksBound = setSystemPoliciesAction.bind(null, system.id);
  const [updateState, updateAction, updating] = useActionState(updateBound, null);
  const [linksState, linksAction, linking] = useActionState(linksBound, null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const hasSourceKey = Boolean(system.source_key?.trim());

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-foreground">Try in playground</p>
        <p className="text-xs text-muted-fg">
          Open Evaluate or Scan with this system preselected. Request{" "}
          <code className="font-mono text-[11px]">source</code> is seeded from{" "}
          <code className="font-mono text-[11px]">source_key</code> when set.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={systemPlaygroundHref("/evaluate", system.id)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground motion-safe:transition-colors motion-safe:duration-150 hover:bg-muted"
          >
            <FlaskConical className="size-3.5" aria-hidden />
            Try evaluate
          </Link>
          <Link
            href={systemPlaygroundHref("/classify", system.id)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground motion-safe:transition-colors motion-safe:duration-150 hover:bg-muted"
          >
            <ScanSearch className="size-3.5" aria-hidden />
            Try scan
          </Link>
        </div>
        {!hasSourceKey && (
          <p className="text-xs text-accent" role="status">
            Set a source key below to map this system into evaluate/scan scope.
          </p>
        )}
      </div>

      <form action={updateAction} className="grid gap-3 md:grid-cols-2">
        <Input label="Name" name="name" required defaultValue={system.name} />
        <Input
          label="Source key"
          name="source_key"
          defaultValue={system.source_key ?? ""}
          placeholder="crm_system"
        />
        <Input
          label="Owner"
          name="owner"
          defaultValue={system.owner ?? ""}
        />
        <Select label="Status" name="status" defaultValue={system.status}>
          <option value="active">active</option>
          <option value="retired">retired</option>
        </Select>
        <Textarea
          label="Description"
          name="description"
          defaultValue={system.description ?? ""}
          className="md:col-span-2 min-h-[5rem]"
        />
        <Input
          label="Tags"
          name="tags"
          defaultValue={(system.tags || []).join(", ")}
          className="md:col-span-2"
        />
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          {updateState?.error && <ErrorAlert message={updateState.error} />}
          {updateState?.ok && updateState.message && (
            <p className="text-sm text-muted-fg" role="status">
              {updateState.message}
            </p>
          )}
          <Button type="submit" disabled={updating} className="cursor-pointer">
            {updating ? "Saving…" : "Save system"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            className="cursor-pointer text-destructive"
            onClick={() => {
              if (
                !window.confirm(
                  `Delete system ${system.name}? This cannot be undone.`,
                )
              ) {
                return;
              }
              startTransition(async () => {
                await deleteSystemAction(system.id);
                router.refresh();
              });
            }}
          >
            Delete
          </Button>
        </div>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
          Linked policies
        </h2>
        <p className="text-sm text-muted-fg">
          Governance links only — they do not change evaluate matching.
        </p>
        <form action={linksAction} className="flex flex-col gap-3">
          <Textarea
            label="Policy IDs"
            name="policy_ids"
            defaultValue={linkedPolicyIds.join("\n")}
            placeholder="pol_gdpr_customer&#10;pol_other"
            className="min-h-[6rem]"
          />
          {allPolicyOptions.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-primary">
                Browse policy catalog ({allPolicyOptions.length})
              </summary>
              <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-border bg-muted/40 p-2 font-mono text-xs">
                {allPolicyOptions.map((p) => (
                  <li key={p.id}>
                    <span className="text-foreground">{p.id}</span>
                    <span className="text-muted-fg"> — {p.name}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {linksState?.error && <ErrorAlert message={linksState.error} />}
          {linksState?.ok && linksState.message && (
            <p className="text-sm text-muted-fg" role="status">
              {linksState.message}
            </p>
          )}
          <Button type="submit" disabled={linking} className="w-fit cursor-pointer">
            {linking ? "Updating…" : "Update linked policies"}
          </Button>
        </form>

        {linkedPolicyIds.length === 0 ? (
          <EmptyState message="No policies linked to this system." />
        ) : (
          <TableWrap>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
                <tr>
                  <th className="px-3 py-2 font-medium">Policy</th>
                </tr>
              </thead>
              <tbody>
                {linkedPolicyIds.map((id) => {
                  const meta = allPolicyOptions.find((p) => p.id === id);
                  return (
                    <tr
                      key={id}
                      className="border-b border-border/70 hover:bg-muted/40"
                    >
                      <td className="px-3 py-2">
                        <Link
                          href={`/policies/${encodeURIComponent(id)}`}
                          className="font-mono text-xs text-primary hover:underline cursor-pointer"
                        >
                          {id}
                        </Link>
                        {meta && (
                          <div className="text-muted-fg">{meta.name}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </section>
    </div>
  );
}
