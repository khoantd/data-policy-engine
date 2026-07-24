# Scan / Classify Playground Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-22
> **Page Type:** Interactive classification scan playground / ops console

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Grid:** `xl` breakpoint uses `1fr / 1.2fr` — Scan input left, Detection results right; stack on smaller viewports
- **Sections:** Page header → Scan input / Detection results panels
- **One job:** Build a single classification scan request and inspect detections; no batch mode in v1

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Metadata JSON uses Master mono (`Fira Code` via `--font-mono`)
- Field labels remain body (`Fira Sans`)

### Color Overrides

- Inherit Master palette (primary blue / accent amber)
- Sensitivity chips: critical → destructive; high → accent; medium → secondary; other → muted
- Out-of-scope warnings use amber border/background (same pattern as Evaluate target mismatch)

### Component Overrides

- **Request:** Classification policy `<Select>`; optional **System** `<Select>` (catalog `source_key` → request `source`); optional **Process** `<Select>` (governance-linked policies only); AI sample row (`Generate sample data` + scenario chips: Auto/PII/SPII/Mixed/Clean); **Privacy masking** badge + footnote when LiteLLM configured — see `design-system/pages/privacy-masking.md`; offline quick-sample chips; scope chips for data types/sources; labeled inputs + mono metadata textarea
- **System context:** Amber callout when selected system has no `source_key`; governance-linked policy chips (highlight when chip matches selected classification policy); Lucide `Server`; deep link `?system=<id>`
- **Process context:** Governance-linked policy chips only (no `source_key`); Lucide `Workflow`; deep link `?process=<id>`
- **Result:** Outcome summary card; action/status chips; detections table; empty/out-of-scope copy when no entities
- **Feedback:** Pending/generating disables submit and AI; `aria-live` for AI status and system source sync; `ErrorAlert` for parse/API failures
- **Motion:** Prefer `motion-safe:` / short 150–200ms transitions; respect `prefers-reduced-motion`

### Interaction / a11y

- Scenario and preset controls use `aria-pressed` / group labels
- AI generate button uses `aria-busy` while loading
- Clearly label AI-generated samples in status copy
- Focus rings remain visible; clickable chips use `cursor-pointer`

---

## Page-Specific Components

- `ClassifyPlayground` — client form + result inspector (`admin/components/classify-form.tsx`)
- `SystemRequestContext` — optional catalog system picker (`admin/components/system-request-context.tsx`)
- `ProcessRequestContext` — optional catalog process picker (`admin/components/process-request-context.tsx`)
- Server page loads active classification policies + active systems/processes + AI config flags (`admin/app/(console)/classify/page.tsx`)
- AI sample endpoint: `POST /api/ai/classify-sample` (`admin/app/api/ai/classify-sample/route.ts`)
- Catalog linked policies BFF: `GET /api/systems/[id]/policies`, `GET /api/processes/[id]/policies`

---

## Recommendations

- Keep quick samples aligned with seeded classification policies so first-run works offline
- Catalog system selection seeds `source` from `source_key` only; process selection shows linked policies as governance context; neither filters the engine
- AI sample generation requires LiteLLM env vars; offline users can still use quick samples and manual JSON
- AI sample requests include optional system/process snapshots; prompts prefer system `source_key` for `source`, and may add process_id context; response overrides `source` when `source_key` is set
- Never auto-run scan after AI generation — operators must review metadata first
