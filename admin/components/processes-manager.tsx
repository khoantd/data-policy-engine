"use client";

import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProcessAction,
  deleteProcessAction,
} from "@/lib/actions";
import { ProcessResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { ErrorAlert, EmptyState, TableWrap } from "@/components/ui/layout";
import { StatusBadge } from "@/components/status-badge";

export function ProcessesManager({
  processes,
}: {
  processes: ProcessResponse[];
}) {
  const [createState, createAction, creating] = useActionState(
    createProcessAction,
    null,
  );
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <form action={createAction} className="grid gap-3 md:grid-cols-2">
        <Input label="Name" name="name" required placeholder="Onboarding" />
        <Input label="Owner" name="owner" placeholder="Optional" />
        <Select label="Status" name="status" defaultValue="active">
          <option value="active">active</option>
          <option value="retired">retired</option>
        </Select>
        <Input label="Tags" name="tags" placeholder="gdpr, ops" />
        <Input
          label="Description"
          name="description"
          placeholder="Optional"
          className="md:col-span-2"
        />
        <div className="md:col-span-2 flex flex-col gap-2">
          {createState?.error && <ErrorAlert message={createState.error} />}
          <Button type="submit" disabled={creating} className="w-fit">
            {creating ? "Creating…" : "Add process"}
          </Button>
        </div>
      </form>

      {processes.length === 0 ? (
        <EmptyState message="No processes registered." />
      ) : (
        <TableWrap>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Owner</th>
                <th className="px-3 py-2 font-medium">Updated</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border/70 hover:bg-muted/40 transition-colors duration-150"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/processes/${encodeURIComponent(p.id)}`}
                      className="font-medium text-primary hover:underline cursor-pointer"
                    >
                      {p.name}
                    </Link>
                    <div className="font-mono text-xs text-muted-fg">{p.id}</div>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-3 py-2 text-muted-fg">{p.owner || "—"}</td>
                  <td className="px-3 py-2 text-muted-fg whitespace-nowrap">
                    {formatDate(p.updated_at)}
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      className="cursor-pointer text-destructive"
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Delete process ${p.name}? Links to policies will be removed.`,
                          )
                        ) {
                          return;
                        }
                        startTransition(async () => {
                          await deleteProcessAction(p.id);
                          router.refresh();
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
}
