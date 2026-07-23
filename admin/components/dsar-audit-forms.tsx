"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createDsarAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { ErrorAlert, PageToolbar } from "@/components/ui/layout";
import type { PolicyListItem } from "@/lib/types";

function PolicyIdSelect({
  policies,
  id,
}: {
  policies: PolicyListItem[];
  id: string;
}) {
  if (policies.length === 0) {
    return (
      <p className="text-sm text-muted-fg">
        No active retention policies loaded.{" "}
        <Link
          href="/policies/import"
          className="text-secondary underline-offset-2 hover:underline cursor-pointer"
        >
          Import a policy
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    <Select label="Policy" name="policy_id" id={id} required defaultValue="">
      <option value="" disabled>
        Select a policy…
      </option>
      {policies.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} ({p.id}) — {p.jurisdiction}
        </option>
      ))}
    </Select>
  );
}

export function CreateDsarForm({
  policies,
}: {
  policies: PolicyListItem[];
}) {
  const accessBound = createDsarAction.bind(null, "access");
  const erasureBound = createDsarAction.bind(null, "erasure");
  const [accessState, accessAction, accessPending] = useActionState(
    accessBound,
    null,
  );
  const [erasureState, erasureAction, erasurePending] = useActionState(
    erasureBound,
    null,
  );
  const canSubmit = policies.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={accessAction} className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Access request</h3>
        <Input label="Subject ID" name="subject_id" required />
        <PolicyIdSelect policies={policies} id="dsar-access-policy" />
        {accessState?.error && <ErrorAlert message={accessState.error} />}
        <Button type="submit" disabled={accessPending || !canSubmit}>
          {accessPending ? "Submitting…" : "Submit access"}
        </Button>
      </form>
      <form action={erasureAction} className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Erasure request</h3>
        <Input label="Subject ID" name="subject_id" required />
        <PolicyIdSelect policies={policies} id="dsar-erasure-policy" />
        {erasureState?.error && <ErrorAlert message={erasureState.error} />}
        <Button
          type="submit"
          variant="danger"
          disabled={erasurePending || !canSubmit}
        >
          {erasurePending ? "Submitting…" : "Submit erasure"}
        </Button>
      </form>
    </div>
  );
}

export function AuditFilters({
  initial,
}: {
  initial: {
    event_type?: string;
    policy_id?: string;
    record_id?: string;
    job_id?: string;
    requester?: string;
  };
}) {
  return (
    <PageToolbar>
      <form
        method="get"
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
      >
      <Select
        label="Event type"
        name="event_type"
        defaultValue={initial.event_type || ""}
      >
        <option value="">All</option>
        <option value="evaluation">evaluation</option>
        <option value="action">action</option>
        <option value="notify">notify</option>
        <option value="pending_grace">pending_grace</option>
        <option value="flag">flag</option>
        <option value="dsar_access">dsar_access</option>
        <option value="dsar_erasure">dsar_erasure</option>
      </Select>
      <Input
        label="Policy ID"
        name="policy_id"
        defaultValue={initial.policy_id || ""}
      />
      <Input
        label="Record ID"
        name="record_id"
        defaultValue={initial.record_id || ""}
      />
      <Input label="Job ID" name="job_id" defaultValue={initial.job_id || ""} />
      <Input
        label="Requester"
        name="requester"
        defaultValue={initial.requester || ""}
      />
      <div className="flex items-end">
        <Button type="submit" variant="secondary" className="w-full">
          Filter
        </Button>
      </div>
      </form>
    </PageToolbar>
  );
}
