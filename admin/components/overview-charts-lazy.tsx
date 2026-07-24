"use client";

import dynamic from "next/dynamic";
import type {
  DayBucket,
  EventTypeCounts,
  JobSummary,
} from "@/lib/overview-metrics";

const Charts = dynamic(
  () =>
    import("@/components/overview-charts").then((m) => m.OverviewCharts),
  {
    ssr: false,
    loading: () => (
      <div
        className="mb-4 grid gap-4 lg:grid-cols-2"
        role="status"
        aria-busy="true"
        aria-label="Loading charts"
      >
        <div className="h-64 animate-pulse rounded-md border border-border bg-muted/40" />
        <div className="h-64 animate-pulse rounded-md border border-border bg-muted/40" />
      </div>
    ),
  },
);

export function OverviewChartsLazy(props: {
  dayBuckets: DayBucket[];
  eventCounts: EventTypeCounts;
  jobSummary: JobSummary;
  auditSampleSize: number;
}) {
  return <Charts {...props} />;
}
