"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { ErrorAlert } from "@/components/ui/layout";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Connection failed");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error while connecting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="API key"
        name="apiKey"
        type="password"
        autoComplete="current-password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Leave empty if API auth is disabled"
      />
      {error && <ErrorAlert message={error} />}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Connecting…" : "Connect"}
      </Button>
    </form>
  );
}
