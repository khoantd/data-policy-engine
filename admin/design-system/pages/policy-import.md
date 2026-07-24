# Policy Import Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-22
> **Page Type:** Policy YAML import / AI-assisted compose

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Grid:** `xl` breakpoint uses `1fr / 1.4fr` — AI assist panel left, YAML draft right; stack on smaller viewports
- **Sections:** Page header → Assist + YAML panels → Validate / Import footer
- **One job:** Compose or paste a policy draft, validate, then import — AI never auto-imports
- **Entry labels:** Policies list CTA, sidebar nav, page title, and breadcrumb use **Create Policy**; the in-page submit action remains **Import** / **Importing…** (YAML → API)

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Description body uses Master sans (`Fira Sans`)
- YAML editor uses Master mono (`Fira Code` via `--font-mono`)

### Color Overrides

- Inherit Master palette (primary blue / accent amber) — do **not** use purple/pink “AI” gradients
- Import CTA remains primary (amber-leaning Master primary path); AI mode buttons use `secondary`
- AI-draft badge uses muted surface + primary text, not accent glow

### Component Overrides

- **Assist panel:** Labeled description textarea; optional **jurisdiction** chips (`EU_GDPR`, `VN_PDPD`, `SG_PDPA`, `GLOBAL`) and **industry** chips (SaaS, E-commerce, Finance, Healthcare, HR) — secondary buttons with `aria-pressed`, append starter text to description without wiping user input; hints sent to BFF as `jurisdiction` / `industry`; **Use web research** toggle (`aria-pressed`, default on when `TAVILY_API_KEY` set); collapsible **References** panel with numbered `[n]` badges, external links (`rel="noopener noreferrer"`), mono domain + snippet; **Privacy masking** badge (`AiPrivacyBadge`) + footnote (`AiPrivacyFootnote`) when LiteLLM configured — see `design-system/pages/privacy-masking.md`; Generate / Polish / Enhance / Expand mode buttons; Regenerate; Undo previous YAML; retention-mastery disclaimer (legal hold, grace, counsel review)
- **YAML panel:** Monaco `YamlCodeEditor` (same chrome as policy details) — not a plain textarea; **Enriched with N references** badge when Tavily sources returned
- **Streaming:** NDJSON protocol — status phases (`Searching references…` → `Generating draft…` → `Draft ready — review references and YAML`); fill draft buffer token-by-token; `aria-live="polite"` status
- **Import:** Hidden `reference_sources` JSON field posts Tavily citations with YAML; FastAPI persists them as policy provenance (not in YAML DSL)
- **Empty YAML:** Guide user to Generate from description (or paste YAML)
- **Missing LiteLLM env:** Disable AI actions with inline setup message; paste/import still works
- **Missing Tavily env:** Muted inline note in References area; AI still works with static mastery only
- **No search results:** “No web references found — using built-in retention guidance”
- **Motion:** `motion-safe:` / 150–200ms transitions; respect `prefers-reduced-motion`

### Interaction / a11y

- Every control has a visible `<label>` (no placeholder-only fields)
- Mode buttons use `aria-pressed` when active / last-used
- Lucide icons only — no emoji icons
- Focus rings remain visible; clickable controls use `cursor-pointer`
- Clearly label AI-generated content (“AI-generated draft”)

---

## Page-Specific Components

- `PolicyImportAssist` — compose workspace (`admin/components/policy-import-assist.tsx`)
- `AiSourceReferences` — collapsible citation list (`admin/components/ai-source-references.tsx`)
- `POST /api/ai/policy-suggest` — LiteLLM + optional Tavily NDJSON streaming BFF
- Server page shell: `admin/app/(console)/policies/import/page.tsx`

---

## Recommendations

- Keep validate/import as server actions against FastAPI — AI route only drafts YAML
- Cap description/YAML payload sizes in the BFF; never log full drafts or PII descriptions
- Prefer streaming text over long spinners
