"use client";

import { useActionState, useEffect } from "react";
import {
  cancelGraceHoldAction,
  forceGraceHoldAction,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/layout";

type Props = {
  holdId: string;
  compact?: boolean;
};

export function GraceHoldActions({ holdId, compact = false }: Props) {
  const [forceState, forceAction, forcePending] = useActionState(
    forceGraceHoldAction,
    null,
  );
  const [cancelState, cancelAction, cancelPending] = useActionState(
    cancelGraceHoldAction,
    null,
  );
  const pending = forcePending || cancelPending;
  const error = forceState?.error || cancelState?.error;

  useEffect(() => {
    if (forceState?.ok || cancelState?.ok) {
      // Server revalidates; soft refresh for client navigations
      window.location.reload();
    }
  }, [forceState?.ok, cancelState?.ok]);

  return (
    <div className="flex flex-col gap-1">
      {error && <ErrorAlert message={error} />}
      <div className={`flex flex-wrap gap-2 ${compact ? "" : ""}`}>
        <form
          action={forceAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Force dispatch now? This skips the remaining grace period and applies the destructive action immediately.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="hold_id" value={holdId} />
          <Button
            type="submit"
            variant="danger"
            size="sm"
            disabled={pending}
          >
            {forcePending ? "Forcing…" : "Force"}
          </Button>
        </form>
        <form
          action={cancelAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Cancel this grace cycle? The record will not be deleted while it still matches; rematch after it leaves scope starts a fresh grace.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="hold_id" value={holdId} />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={pending}
          >
            {cancelPending ? "Cancelling…" : "Cancel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
