"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazily fetch a full policy by id via the Admin BFF.
 * Caches successful responses in-module so switching policies does not refetch.
 */
const policyCache = new Map<string, unknown>();

export function useLazyPolicy<T>(policyId: string | null | undefined): {
  policy: T | null;
  loading: boolean;
  error: string | null;
} {
  const [policy, setPolicy] = useState<T | null>(() => {
    if (!policyId) return null;
    return (policyCache.get(policyId) as T | undefined) ?? null;
  });
  const [loading, setLoading] = useState(() => {
    if (!policyId) return false;
    return !policyCache.has(policyId);
  });
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!policyId) {
      setPolicy(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = policyCache.get(policyId) as T | undefined;
    if (cached !== undefined) {
      setPolicy(cached);
      setLoading(false);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    setPolicy(null);

    void (async () => {
      try {
        const res = await fetch(
          `/api/policies/${encodeURIComponent(policyId)}`,
        );
        if (!res.ok) {
          let message = `Failed to load policy (${res.status})`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body.error) message = body.error;
          } catch {
            /* ignore */
          }
          if (id === requestId.current) {
            setError(message);
            setPolicy(null);
            setLoading(false);
          }
          return;
        }
        const body = (await res.json()) as T;
        policyCache.set(policyId, body);
        if (id === requestId.current) {
          setPolicy(body);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (id === requestId.current) {
          setError(
            err instanceof Error ? err.message : "Failed to load policy",
          );
          setPolicy(null);
          setLoading(false);
        }
      }
    })();
  }, [policyId]);

  return { policy, loading, error };
}

/** Test helper — clears the module cache between tests. */
export function clearLazyPolicyCache(): void {
  policyCache.clear();
}
