"use client";

import { useState, useTransition } from "react";
import { activateVersionAction } from "@/lib/actions";
import { PolicyDiffChange, PolicyVersionInfo } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ErrorAlert, EmptyState, TableWrap } from "@/components/ui/layout";
import { StatusBadge } from "@/components/status-badge";

export function VersionsPanel({
  policyId,
  versions,
  currentVersion,
}: {
  policyId: string;
  versions: PolicyVersionInfo[];
  currentVersion: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [diff, setDiff] = useState<PolicyDiffChange[] | null>(null);
  const [diffLabel, setDiffLabel] = useState("");
  const [pending, startTransition] = useTransition();

  async function runDiff(from: number, to: number) {
    setError(null);
    setDiff(null);
    const res = await fetch(
      `/api/policies/${encodeURIComponent(policyId)}/diff`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_version: from, to_version: to }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Diff failed");
      return;
    }
    setDiffLabel(`v${from} → v${to}`);
    setDiff(data.changes || []);
  }

  function activate(ver: number) {
    if (
      !confirm(
        `Restore snapshot from version ${ver}? This creates a new head from that historical version — it does not publish or reactivate the policy lifecycle.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await activateVersionAction(policyId, ver);
      if (res.error) setError(res.error);
      else window.location.reload();
    });
  }

  if (versions.length === 0) {
    return <EmptyState message="No version history." />;
  }

  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="flex flex-col gap-4">
      {error && <ErrorAlert message={error} />}
      <TableWrap>
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
            <tr>
              <th className="px-3 py-2 font-medium">Version</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => (
              <tr
                key={v.version}
                className="border-b border-border/70 hover:bg-muted/40 transition-colors duration-150"
              >
                <td className="px-3 py-2 font-mono text-xs">
                  v{v.version}
                  {v.version === currentVersion && (
                    <span className="ml-2 text-success">(head)</span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {formatDate(v.created_at)}
                </td>
                <td className="px-3 py-2">
                  {v.status ? <StatusBadge status={v.status} /> : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {v.version !== currentVersion && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={pending}
                          onClick={() => runDiff(v.version, currentVersion)}
                        >
                          Diff vs head
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={pending}
                          onClick={() => activate(v.version)}
                        >
                          Restore snapshot
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {diff && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-fg">
            Diff {diffLabel} ({diff.length} changes)
          </h3>
          {diff.length === 0 ? (
            <EmptyState message="No structural changes." />
          ) : (
            <TableWrap>
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-fg">
                  <tr>
                    <th className="px-3 py-2 font-medium">Op</th>
                    <th className="px-3 py-2 font-medium">Path</th>
                    <th className="px-3 py-2 font-medium">Old</th>
                    <th className="px-3 py-2 font-medium">New</th>
                  </tr>
                </thead>
                <tbody>
                  {diff.map((c, i) => (
                    <tr
                      key={`${c.path}-${i}`}
                      className="border-b border-border/70 font-mono text-xs"
                    >
                      <td className="px-3 py-2">{c.op}</td>
                      <td className="px-3 py-2">{c.path}</td>
                      <td className="px-3 py-2 max-w-[200px] truncate">
                        {c.old === undefined ? "—" : JSON.stringify(c.old)}
                      </td>
                      <td className="px-3 py-2 max-w-[200px] truncate">
                        {c.new === undefined ? "—" : JSON.stringify(c.new)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </div>
      )}
    </div>
  );
}
