# Evaluate Playground Page Overrides

> **PROJECT:** DRPE Admin
> **Generated:** 2026-07-22
> **Page Type:** Interactive evaluate playground / ops console

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Grid:** `lg` breakpoint uses equal `1fr / 1fr` — Request builder left, Result inspector right; stack on smaller viewports
- **Sections:** Page header → Request / Result panels (policy context consolidated into Request panel)
- **One job:** Build and inspect a single evaluation (or batch); no secondary marketing chrome

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Metadata / context / batch / raw JSON use Master mono (`Fira Code` via `--font-mono`)
- Field labels remain body (`Fira Sans`)

### Color Overrides

- Inherit Master palette (primary blue / accent amber) — do **not** introduce alternate playground themes
- Action badges: `retain` / `definitive` → success; `delete` / `anonymize` → destructive; `archive` / `notify` / `partial` / `none` → accent
- Target match badge: matched → success; different policy → warning/accent; not matched → muted

### Component Overrides

- **Request:** Target policy `<Select>` at top; mode toggle; AI sample row (`Generate sample data` + scenario chips for single mode); **Privacy masking** badge + footnote when LiteLLM configured — see `design-system/pages/privacy-masking.md`; quick-sample ghost buttons; labeled inputs + mono textareas; dry-run checkbox default **on** for single mode
- **Result:** Target match badge when a policy is selected; status badges for action + confidence; definition list for match metadata; batch summary for target matches; conflicts table when present; collapsible raw JSON
- **Feedback:** Pending/generating disables submit and AI; `aria-live` for AI status; `ErrorAlert` for parse/API failures
- **Motion:** Prefer `motion-safe:` / short 150–200ms transitions; respect `prefers-reduced-motion`

### Interaction / a11y

- Every input has a visible `<label>` (no placeholder-only fields)
- Mode, scenario, and preset controls use `aria-pressed` / group labels
- AI generate button uses `aria-busy` while loading
- Focus rings remain visible; clickable chips/links use `cursor-pointer`

---

## Page-Specific Components

- `EvaluatePlayground` — client form + result inspector (`admin/components/evaluate-form.tsx`)
- Server page loads active policies + AI config flag (`admin/app/(console)/evaluate/page.tsx`)
- AI sample endpoint: `POST /api/ai/evaluate-sample` (`admin/app/api/ai/evaluate-sample/route.ts`)

---

## Recommendations

- Default dry-run for single evaluate; document that batch has no dry-run twin
- Keep quick samples aligned with `tests/test_api.py` / `config/gdpr_customer.yaml` so first-run works against seeded policies
- Target policy selection is **UI targeting only** — evaluate still considers all active policies; API-level policy scoping is future work
- AI sample generation requires LiteLLM env vars; offline users can still use quick samples and manual JSON
