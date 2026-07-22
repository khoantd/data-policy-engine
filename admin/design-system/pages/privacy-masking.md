# Privacy Masking Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-22
> **Page Type:** Semantic PII masking indicators (privalyse-mask)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- Privacy indicators sit **inline** in AI assist panels (Policy Import, Evaluate, Scan) — no separate page in v1
- Observability Integrations tab lists Privalyse alongside LiteLLM / Tavily / LangSmith

### Color Overrides

- Inherit Master palette (primary blue / accent amber) — **do not** use purple/pink “AI privacy” gradients
- `AiPrivacyBadge`: muted surface (`bg-muted/60`), primary text, optional `ShieldCheck` icon in primary tone
- Unavailable state: muted foreground only — not destructive

### Component Overrides

- **`AiPrivacyBadge`:** Lucide `Shield` or `ShieldCheck`; labels “Privacy masking on” / “Masking unavailable”; `role="status"`
- **`AiPrivacyFootnote`:** One line + link to `/observability`; never show mapping tokens or masked preview
- **Entity count:** Informational only (e.g. “3 fields protected”) after mask — `text-xs text-muted-fg`
- **Motion:** `motion-safe:` / 150–200ms; respect `prefers-reduced-motion`

### Interaction / a11y

- Lucide icons only — no emoji icons
- Focus rings remain visible; clickable controls use `cursor-pointer`
- Do not expose placeholder mappings or raw PII in the UI

---

## Page-Specific Components

- `AiPrivacyBadge` — `admin/components/ai-privacy-badge.tsx`
- `AiPrivacyFootnote` — `admin/components/ai-privacy-footnote.tsx`
- FastAPI: `GET/POST /api/v1/privacy/*` (privalyse-mask optional extra)

---

## Recommendations

- Masking is server-side only; mappings never leave FastAPI memory
- Link operators to Observability for integration health, not for mapping inspection
