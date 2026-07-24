"use client";

import { useEffect, useRef, useState } from "react";

const linkedCache = new Map<string, string[]>();

/** Lazily fetch governance-linked policy IDs for a catalog process. */
export function useLazyProcessPolicies(processId: string | null | undefined): {
  policyIds: string[];
  loading: boolean;
  error: string | null;
} {
  const [policyIds, setPolicyIds] = useState<string[]>(() => {
    if (!processId) return [];
    return linkedCache.get(processId) ?? [];
  });
  const [loading, setLoading] = useState(() => {
    if (!processId) return false;
    return !linkedCache.has(processId);
  });
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!processId) {
      setPolicyIds([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = linkedCache.get(processId);
    if (cached !== undefined) {
      setPolicyIds(cached);
      setLoading(false);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    setPolicyIds([]);

    void (async () => {
      try {
        const res = await fetch(
          `/api/processes/${encodeURIComponent(processId)}/policies`,
        );
        if (!res.ok) {
          let message = `Failed to load linked policies (${res.status})`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body.error) message = body.error;
          } catch {
            /* ignore */
          }
          if (id === requestId.current) {
            setError(message);
            setPolicyIds([]);
            setLoading(false);
          }
          return;
        }
        const body = (await res.json()) as string[];
        linkedCache.set(processId, body);
        if (id === requestId.current) {
          setPolicyIds(body);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (id === requestId.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load linked policies",
          );
          setPolicyIds([]);
          setLoading(false);
        }
      }
    })();
  }, [processId]);

  return { policyIds, loading, error };
}
