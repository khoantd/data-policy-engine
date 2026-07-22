"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createWebhookAction,
  deleteWebhookAction,
  toggleWebhookAction,
} from "@/lib/actions";
import { WebhookResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { ErrorAlert, EmptyState, TableWrap } from "@/components/ui/layout";
import { StatusBadge } from "@/components/status-badge";

export function WebhooksManager({
  webhooks,
}: {
  webhooks: WebhookResponse[];
}) {
  const [createState, createAction, creating] = useActionState(
    createWebhookAction,
    null,
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <form action={createAction} className="grid gap-3 md:grid-cols-2">
        <Input
          label="URL"
          name="url"
          type="url"
          required
          placeholder="https://example.com/hooks/drpe"
        />
        <Input
          label="Events"
          name="events"
          required
          placeholder="enforcement.delete, * "
        />
        <Input
          label="Description"
          name="description"
          placeholder="Optional"
        />
        <Input
          label="Secret (optional)"
          name="secret"
          type="password"
          minLength={8}
          placeholder="Min 8 characters"
        />
        <div className="md:col-span-2 flex flex-col gap-2">
          {createState?.error && <ErrorAlert message={createState.error} />}
          {createState?.secret && (
            <p className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-warning" role="status">
              Store this secret now — it will not be shown again:{" "}
              <span className="font-mono text-xs break-all">
                {createState.secret}
              </span>
            </p>
          )}
          <Button type="submit" disabled={creating} className="w-fit">
            {creating ? "Creating…" : "Register webhook"}
          </Button>
        </div>
      </form>

      {error && <ErrorAlert message={error} />}

      {webhooks.length === 0 ? (
        <EmptyState message="No webhooks registered." />
      ) : (
        <TableWrap>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
              <tr>
                <th className="px-3 py-2 font-medium">URL</th>
                <th className="px-3 py-2 font-medium">Events</th>
                <th className="px-3 py-2 font-medium">Active</th>
                <th className="px-3 py-2 font-medium">Secret</th>
                <th className="px-3 py-2 font-medium">Updated</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-border/70 hover:bg-muted/40 transition-colors duration-150"
                >
                  <td className="px-3 py-2 font-mono text-xs max-w-[240px] truncate">
                    {w.url}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {w.events.join(", ")}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={w.active ? "active" : "inactive"} />
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {w.secret_set ? "set" : "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                    {formatDate(w.updated_at)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            const res = await toggleWebhookAction(
                              w.id,
                              !w.active,
                            );
                            if (res.error) setError(res.error);
                            else window.location.reload();
                          })
                        }
                      >
                        {w.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm("Delete this webhook?")) return;
                          startTransition(async () => {
                            const res = await deleteWebhookAction(w.id);
                            if (res.error) setError(res.error);
                            else window.location.reload();
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
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
