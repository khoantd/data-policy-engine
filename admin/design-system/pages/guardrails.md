# Guardrails Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-27
> **Page Type:** AI safety / agent policy evaluate-scan playground

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** `ConsoleShell` with breadcrumbs in content (no wrapping `ContentCard` around the whole page — match Evaluate/Scan)
- **Grid:** `lg` breakpoint uses equal `1fr / 1fr` — Scan input left, Verdict inspector right; stack on smaller viewports
- **Sections:** Status strip → Request / Verdict panels → collapsible Scratch OGR documents
- **One job:** Scan a GuardEvent against an active **agent** policy (or scratch OGR doc)

### Typography Overrides

- Policy IDs, GuardEvent JSON, verdict metadata, evidence use Master mono

### Color Overrides

- Inherit Master palette — do **not** introduce alternate playground themes
- Verdict badges: `allow` / `pass` → success; `block` / `deny` → destructive; `require_approval` / `review` → accent/warning

### Component Overrides

- `GuardrailsConsole` — client scan playground + secondary scratch editor
- Status via `StatusBadge` + plain-language availability copy
- Target policy `<Select>` with optgroups: **Agent policies** then **Scratch OGR documents**
- Quick-sample ghost buttons with `aria-pressed` (pipe-to-shell, rm -rf, sudo, benign)
- Lucide icons only — no emoji

### Interaction / a11y

- Every field has a visible label
- Verdict result uses `aria-live="polite"`
- Focus rings remain visible; list selection and sample chips use `cursor-pointer`
- Deep link `?policy=<id>` preselects agent or scratch target
- Empty state links to `/policies/import` when no targets exist

### Agent policy note

- Lifecycle agent policies are managed under **Policies → Kind: Agent** (YAML root `agent_policy:`)
- This page is the Evaluate/Scan peer for agent kind — primary path is active agent policies
- Scratch OGR docs remain optional under a collapsed `<details>` section

---

## Page-Specific Components

- Server page: `admin/app/(console)/guardrails/page.tsx`
- Client: `admin/components/guardrails-console.tsx`
- Helpers: `admin/lib/guardrails-playground.ts`
- API: `/api/v1/guardrails/*` (evaluate resolves agent `ogr_policy` by `policy_id`)
- Policy detail deep link: `guardrailsPlaygroundHref` on agent policies
