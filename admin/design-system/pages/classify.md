# Scan / Classify Playground Page Overrides

> **PROJECT:** DRPE Admin
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

- **Request:** Classification policy `<Select>`; AI sample row (`Generate sample data` + scenario chips: Auto/PII/SPII/Mixed/Clean); **Privacy masking** badge + footnote when LiteLLM configured — see `design-system/pages/privacy-masking.md`; offline quick-sample chips; scope chips for data types/sources; labeled inputs + mono metadata textarea
- **Result:** Outcome summary card; action/status chips; detections table; empty/out-of-scope copy when no entities
- **Feedback:** Pending/generating disables submit and AI; `aria-live` for AI status; `ErrorAlert` for parse/API failures
- **Motion:** Prefer `motion-safe:` / short 150–200ms transitions; respect `prefers-reduced-motion`

### Interaction / a11y

- Scenario and preset controls use `aria-pressed` / group labels
- AI generate button uses `aria-busy` while loading
- Clearly label AI-generated samples in status copy
- Focus rings remain visible; clickable chips use `cursor-pointer`

---

## Page-Specific Components

- `ClassifyPlayground` — client form + result inspector (`admin/components/classify-form.tsx`)
- Server page loads active classification policies + AI config flags (`admin/app/(console)/classify/page.tsx`)
- AI sample endpoint: `POST /api/ai/classify-sample` (`admin/app/api/ai/classify-sample/route.ts`)

---

## Recommendations

- Keep quick samples aligned with seeded classification policies so first-run works offline
- AI sample generation requires LiteLLM env vars; offline users can still use quick samples and manual JSON
- Never auto-run scan after AI generation — operators must review metadata first
