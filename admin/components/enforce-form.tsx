"use client";

import { useActionState } from "react";
import { triggerEnforceAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { ErrorAlert } from "@/components/ui/layout";

export function TriggerEnforceForm() {
  const [state, action, pending] = useActionState(triggerEnforceAction, null);
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Policy ID (optional)"
          name="policy_id"
          placeholder="Leave empty for all policies"
        />
      </div>
      <div className="flex flex-col gap-2">
        {state?.error && <ErrorAlert message={state.error} />}
        <Button type="submit" disabled={pending}>
          {pending ? "Queuing…" : "Trigger enforce"}
        </Button>
      </div>
    </form>
  );
}
