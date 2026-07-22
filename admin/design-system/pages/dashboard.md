# Dashboard Page Overrides

> **PROJECT:** DRPE Admin
> **Generated:** 2026-07-22 12:32:05
> **Page Type:** Dashboard / Data View

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** LangSmith-style grouped sidebar + breadcrumb content chrome (see Master App Shell)
- **Layout:** Breadcrumbs → Page header → compact KPI strip → `ContentCard` data table
- **Sections:** Overview KPIs → Recent audit table

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Table headers sentence-case via shared `tableHeaderClass`

### Color Overrides

- Status dots in audit table; neutral canvas from Master

### Component Overrides

- **KPI strip:** Compact chips via `KpiStrip` + `Kpi compact`
- **Audit table:** `StatusDot` for event type; sticky header

---

## Page-Specific Components

- Overview page: `admin/app/(console)/page.tsx`

---

## Recommendations

- Data Entry: Allow multi-select and bulk edit (future)
- CTA Placement: Primary actions in page header actions slot
