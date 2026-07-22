"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changePolicyStatusAction } from "@/lib/actions";
import {
  getAvailablePolicyActions,
  PolicyLifecycleAction,
  statusChangeMessage,
} from "@/lib/policy-status";
import { PolicyStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorAlert } from "@/components/ui/layout";

import { cn } from "@/lib/utils";

export function PolicyStatusActions({
  policyId,
  currentStatus,
  className,
}: {
  policyId: string;
  currentStatus: PolicyStatus;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<PolicyLifecycleAction | null>(null);

  const actions = getAvailablePolicyActions(currentStatus);

  function openAction(action: PolicyLifecycleAction) {
    setError(null);
    setSuccess(null);
    setSelected(action);
  }

  function closeDialog() {
    if (!pending) setSelected(null);
  }

  function confirmAction() {
    if (!selected) return;
    const action = selected;
    startTransition(async () => {
      const res = await changePolicyStatusAction(policyId, action.targetStatus);
      if (res.error) {
        setError(res.error);
        setSelected(null);
        return;
      }
      setSuccess(statusChangeMessage(action.label, action.targetStatus));
      setSelected(null);
      router.refresh();
    });
  }

  if (actions.length === 0) return null;

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-h-5 flex-1">
        {error && <ErrorAlert message={error} />}
        {!error && success && (
          <p className="text-sm text-success" role="status">
            {success}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            size="sm"
            variant={action.variant}
            disabled={pending}
            title={action.description}
            onClick={() => openAction(action)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <ConfirmDialog
        open={selected !== null}
        title={selected?.confirmTitle ?? ""}
        description={selected?.confirmBody ?? ""}
        confirmLabel={selected?.label}
        confirmVariant={selected?.variant ?? "primary"}
        pending={pending}
        onConfirm={confirmAction}
        onCancel={closeDialog}
      />
    </div>
  );
}
