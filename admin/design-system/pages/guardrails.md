# Guardrails Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-27
> **Page Type:** AI safety / OpenGuardrails policy console

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** `ConsoleShell` with breadcrumbs in content
- **Sections:** Status strip → policy list + JSON editor → evaluate playground
- **One job:** Manage OGR policy documents and dry-run GuardEvent → Verdict

### Typography Overrides

- Policy IDs, JSON editors, and verdict metadata use Master mono

### Component Overrides

- `GuardrailsConsole` — client policy editor + playground
- Status via `StatusBadge` + plain-language availability copy
- Lucide icons only — no emoji

### Interaction / a11y

- Every field has a visible label
- Evaluate result uses `aria-live="polite"`
- Focus rings remain visible; list selection uses `cursor-pointer`

### Agent policy note

- Lifecycle agent policies are managed under **Policies → Kind: Agent** (YAML root `agent_policy:`)
- This page remains for raw OGR scratch policies and the evaluate playground

---

## Page-Specific Components

- Server page: `admin/app/(console)/guardrails/page.tsx`
- Client: `admin/components/guardrails-console.tsx`
- API: `/api/v1/guardrails/*`
