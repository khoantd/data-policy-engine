# Dashboard Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-22 12:32:05
> **Page Type:** Dashboard / Data View

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** LangSmith-style grouped sidebar + breadcrumb content chrome (see Master App Shell)
- **Layout:** Breadcrumbs → Page header → KPI strip → Attention (conditional) → Charts → Recent audit table
- **Sections:** Overview KPIs → Needs attention → Activity / Event mix / Job outcomes → Recent audit

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Table headers sentence-case via shared `tableHeaderClass`

### Color Overrides

- Status dots in audit table; neutral canvas from Master
- KPI tones: `success` / `warning` / `error` via `Kpi` `tone` prop (failed jobs, job errors, open DSAR, actions)
- Charts: primary `#1E40AF` (evaluations dashed), accent `#D97706` (actions), secondary `#3B82F6` (event bars); job status uses success/destructive/warning/muted fills
- Attention links: destructive/warning bordered rows with Lucide icons (no emoji)

### Component Overrides

- **KPI strip:** Compact chips via `KpiStrip` + `Kpi compact` (+ optional `tone`)
- **Attention:** `OverviewAttention` — actionable list; empty when healthy
- **Charts:** `OverviewCharts` (Recharts) — line (activity), horizontal bar (event mix), vertical bar (job outcomes); each chart has a data-table a11y fallback; `prefers-reduced-motion` disables chart animation
- **Sample window label:** Always show “last 7 days ≤1000 audit / last 50 jobs”
- **Audit table:** `StatusDot` for event type; sticky header; “View all audit” link
- **Audit page filters** (`/audit`): Event type uses `AUDIT_EVENT_TYPE_OPTIONS` (human labels; API values unchanged). Combine with Policy / Record / Job / Requester. Same enum as Insights — see `design-system/pages/insights.md` for recipes

### Interaction Overrides

- Attention rows and “View all audit” use `cursor-pointer`
- Chart hover tooltips; no auto-play animations when reduced motion

### Anti-Patterns Forbidden

- Dark OLED ops theme (keep Master light LangSmith canvas)
- Pie charts for event mix (use labeled horizontal bars)
- Charts without table fallbacks

---

## Page-Specific Components

- Overview page: `admin/app/(console)/page.tsx`
- Metrics: `admin/lib/overview-metrics.ts`
- Charts: `admin/components/overview-charts.tsx`
- Attention: `admin/components/overview-attention.tsx`

---

## Recommendations

- Data Entry: Allow multi-select and bulk edit (future)
- CTA Placement: Primary actions in page header actions slot
- Future: backend `/audit/summary` for accurate long-window totals
