"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DayBucket,
  EventTypeCounts,
  JobSummary,
} from "@/lib/overview-metrics";
import {
  OVERVIEW_AUDIT_LIMIT,
  OVERVIEW_AUDIT_WINDOW_DAYS,
  OVERVIEW_JOBS_LIMIT,
  eventTypeChartRows,
  jobStatusChartRows,
} from "@/lib/overview-metrics";
import {
  ContentCard,
  EmptyState,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
  TableWrap,
} from "@/components/ui/layout";

const PRIMARY = "#1E40AF";
const SECONDARY = "#3B82F6";
const ACCENT = "#D97706";
const MUTED = "#90A4AE";
const DESTRUCTIVE = "#DC2626";

const JOB_COLORS: Record<string, string> = {
  succeeded: "#15803D",
  failed: DESTRUCTIVE,
  running: ACCENT,
  queued: SECONDARY,
  cancelled: MUTED,
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function formatDayLabel(day: string): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function OverviewCharts({
  dayBuckets,
  eventCounts,
  jobSummary,
  auditSampleSize,
}: {
  dayBuckets: DayBucket[];
  eventCounts: EventTypeCounts;
  jobSummary: JobSummary;
  auditSampleSize: number;
}) {
  const reducedMotion = useReducedMotion();
  const isEmpty = auditSampleSize === 0 && jobSummary.total === 0;
  const eventRows = eventTypeChartRows(eventCounts).filter((r) => r.count > 0);
  const jobRows = jobStatusChartRows(jobSummary.byStatus).filter(
    (r) => r.count > 0,
  );
  const activityData = dayBuckets.map((b) => ({
    ...b,
    label: formatDayLabel(b.day),
  }));

  if (isEmpty) {
    return (
      <ContentCard title="Activity" className="mb-4">
        <div className="p-4">
          <EmptyState message="No audit or enforce activity in the sample window yet." />
          <p className="mt-2 text-center text-xs text-muted-fg">
            Based on last {OVERVIEW_AUDIT_WINDOW_DAYS} days (≤
            {OVERVIEW_AUDIT_LIMIT.toLocaleString()} events) / last{" "}
            {OVERVIEW_JOBS_LIMIT} jobs
          </p>
        </div>
      </ContentCard>
    );
  }

  return (
    <div className="mb-4 flex flex-col gap-4">
      <p className="text-xs text-muted-fg">
        Based on last {OVERVIEW_AUDIT_WINDOW_DAYS} days (≤
        {OVERVIEW_AUDIT_LIMIT.toLocaleString()} audit events ·{" "}
        {auditSampleSize.toLocaleString()} loaded) / last {OVERVIEW_JOBS_LIMIT}{" "}
        jobs
      </p>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ContentCard title="Activity over time">
          <div className="p-4">
            {activityData.every(
              (d) => d.evaluations === 0 && d.actions === 0,
            ) ? (
              <EmptyState message="No evaluations or actions in this window." />
            ) : (
              <>
                <div
                  className="h-56 w-full"
                  role="img"
                  aria-label="Line chart of daily evaluations and actions"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activityData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        width={32}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="evaluations"
                        name="Evaluations"
                        stroke={PRIMARY}
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        dot={{ r: 3 }}
                        isAnimationActive={!reducedMotion}
                      />
                      <Line
                        type="monotone"
                        dataKey="actions"
                        name="Actions"
                        stroke={ACCENT}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        isAnimationActive={!reducedMotion}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  <TableWrap>
                    <table className="w-full text-left text-sm">
                      <caption className="sr-only">
                        Daily evaluations and actions
                      </caption>
                      <thead className={tableHeaderClass}>
                        <tr>
                          <th className={`${tableCellClass} font-medium`}>
                            Day
                          </th>
                          <th className={`${tableCellClass} font-medium`}>
                            Evaluations
                          </th>
                          <th className={`${tableCellClass} font-medium`}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.map((row) => (
                          <tr key={row.day} className={tableRowClass}>
                            <td
                              className={`${tableCellClass} font-mono text-xs`}
                            >
                              {row.day}
                            </td>
                            <td
                              className={`${tableCellClass} font-mono text-xs`}
                            >
                              {row.evaluations}
                            </td>
                            <td
                              className={`${tableCellClass} font-mono text-xs`}
                            >
                              {row.actions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </>
            )}
          </div>
        </ContentCard>

        <ContentCard title="Event mix">
          <div className="p-4">
            {eventRows.length === 0 ? (
              <EmptyState message="No audit events in this window." />
            ) : (
              <>
                <div
                  className="h-56 w-full"
                  role="img"
                  aria-label="Bar chart of audit event types"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={eventRows}
                      margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={110}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Count"
                        fill={SECONDARY}
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={!reducedMotion}
                        label={{
                          position: "right",
                          fontSize: 11,
                          fill: "#111827",
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  <TableWrap>
                    <table className="w-full text-left text-sm">
                      <caption className="sr-only">
                        Audit event type counts
                      </caption>
                      <thead className={tableHeaderClass}>
                        <tr>
                          <th className={`${tableCellClass} font-medium`}>
                            Event
                          </th>
                          <th className={`${tableCellClass} font-medium`}>
                            Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventRows.map((row) => (
                          <tr key={row.key} className={tableRowClass}>
                            <td className={tableCellClass}>{row.label}</td>
                            <td
                              className={`${tableCellClass} font-mono text-xs`}
                            >
                              {row.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </>
            )}
          </div>
        </ContentCard>

        <ContentCard title="Job outcomes" className="xl:col-span-2">
          <div className="p-4">
            {jobRows.length === 0 ? (
              <EmptyState message="No enforce jobs in the last 50." />
            ) : (
              <>
                <div
                  className="h-48 w-full max-w-xl"
                  role="img"
                  aria-label="Bar chart of enforce job statuses"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobRows}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        width={32}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Jobs"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={!reducedMotion}
                        label={{
                          position: "top",
                          fontSize: 11,
                          fill: "#111827",
                        }}
                      >
                        {jobRows.map((row) => (
                          <Cell
                            key={row.key}
                            fill={JOB_COLORS[row.key] ?? SECONDARY}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 max-w-xl">
                  <TableWrap>
                    <table className="w-full text-left text-sm">
                      <caption className="sr-only">
                        Enforce job status counts
                      </caption>
                      <thead className={tableHeaderClass}>
                        <tr>
                          <th className={`${tableCellClass} font-medium`}>
                            Status
                          </th>
                          <th className={`${tableCellClass} font-medium`}>
                            Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobRows.map((row) => (
                          <tr key={row.key} className={tableRowClass}>
                            <td className={tableCellClass}>{row.label}</td>
                            <td
                              className={`${tableCellClass} font-mono text-xs`}
                            >
                              {row.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </>
            )}
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
