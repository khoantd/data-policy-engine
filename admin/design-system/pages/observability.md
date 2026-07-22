# Observability Page Overrides

> **PROJECT:** DRPE Admin
> **Generated:** 2026-07-22
> **Page Type:** AI trace observability / ops console

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** LangSmith-style app chrome via `ConsoleShell` (grouped sidebar, breadcrumbs in content)
- **Sections:** Breadcrumbs → Page header → Sub-tabs (Tracing | Setup | Integrations) → Tab content
- **Tracing tab:** Compact KPI strip → inline `PageToolbar` (filters + search + refresh) → full-bleed trace table
- **One job:** Inspect AI integration health and browse recent LangSmith traces with safe metadata only

### Spacing Overrides

- Dense table rows (`py-1.5`); toolbar filters inline on one row at `lg+`

### Typography Overrides

- Run IDs, timestamps, latency use Master mono (`Fira Code` via `--font-mono`)
- Table headers sentence-case (not uppercase)

### Color Overrides

- Inherit Master LangSmith-neutral palette — status dots for trace rows
- Integration KPI: configured → success tone; off → muted

### Component Overrides

- **Sub-tabs:** `SegmentedControl` — Tracing (default), Setup, Integrations
- **KPI strip:** Compact `Kpi` chips for LiteLLM, Tavily, LangSmith, Privalyse, model
- **Toolbar:** Route, status, web search, time window, client search, Refresh with `aria-busy`
- **Trace table:** Status dot, name, route, mode, web search, latency, start time, external LangSmith link
- **Setup tab:** Copy-ready `.env.local` snippet; expanded by default when LangSmith off
- **Integrations tab:** Service status + external LangSmith project link
- **Feedback:** `aria-live="polite"` on fetch status; `ErrorAlert` for API failures; empty states for unconfigured / no traces
- **Motion:** `motion-safe:` / 150–200ms transitions; respect `prefers-reduced-motion`

### Interaction / a11y

- Every filter has a visible `<label>`
- External links open in new tab with accessible label (“Open trace in LangSmith”)
- Lucide icons only — no emoji icons
- Focus rings remain visible; clickable controls use `cursor-pointer`

---

## Page-Specific Components

- `ObservabilityDashboard` — client trace browser (`admin/components/observability-dashboard.tsx`)
- `GET /api/observability/traces` — LangSmith run listing BFF
- Server page: `admin/app/(console)/observability/page.tsx`

---

## Recommendations

- Never expose API keys or prompt/YAML content in the UI or trace list API
- Link to LangSmith UI for deep inspection; do not iframe embed
- Cross-link from Policy Import and Evaluate AI panels when tracing is enabled
