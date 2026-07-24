"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PageToolbar } from "@/components/ui/layout";

export function PoliciesFilter({
  initialQ,
  initialStatus,
  initialKind,
  basePath = "/policies",
}: {
  initialQ: string;
  initialStatus: string;
  initialKind: string;
  /** Target path for filter query params (e.g. `/policies/graph`). */
  basePath?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);
  const [kind, setKind] = useState(initialKind);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (kind) params.set("kind", kind);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <PageToolbar>
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="min-w-[200px] flex-1">
          <Input
            label="Search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by id, name, jurisdiction"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            label="Kind"
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">All kinds</option>
            <option value="retention">Retention</option>
            <option value="classification">Classification</option>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="deprecated">Deprecated</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          Apply
        </Button>
      </form>
    </PageToolbar>
  );
}
