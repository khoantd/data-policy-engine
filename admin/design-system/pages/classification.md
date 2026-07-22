# Classification / Scan Page Overrides

> **PROJECT:** DRPE Admin
> **Page Type:** PII / sensitive data scan playground

> Rules here override `design-system/MASTER.md` for the Scan (`/classify`) page.

---

## Layout

- Two-column grid on `xl`: scan input left, detection results right
- Preset chips for common scan scenarios (email profile, VN CMND, mixed SPII ticket)

## Components

- Sensitivity badges: critical → destructive token, high → accent, medium → secondary — always include text label
- Results table: entity label, field path, classification, sensitivity, detector method
- `aria-live="polite"` on results panel

## Color

- Classification kind badge on policies list uses amber outline (`accent`), not purple AI gradients
- Retention kind badge uses blue (`secondary`)

## Motion

- `motion-safe:animate-spin` on scan pending state
- 150–200ms transitions on chip selection
