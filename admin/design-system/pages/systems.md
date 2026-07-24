# Systems Catalog Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-24
> **Page Type:** Systems list / detail (governance catalog)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here.

---

## Page-Specific Rules

### Layout Overrides

- **List:** Create form above table (Webhooks pattern); one job — inventory IT systems
- **Detail:** Edit fields first; **Try evaluate / Try scan** playground deep-links; **Linked policies** section second (replace-set IDs)
- Inherit Master palette; amber only for CTAs and missing-`source_key` footnotes

### Component Overrides

- Status `active` / `retired` via StatusBadge / StatusDot
- Links are governance-only copy (do not imply evaluate matching)
- Lucide `Server` in nav; FlaskConical / ScanSearch for playground CTAs; no emoji icons
- Playground CTAs: `/evaluate?system=<id>` and `/classify?system=<id>`

### Interaction / a11y

- Row name links to detail; delete confirms
- Focus rings on forms; `cursor-pointer` on controls
- Browse catalog `<details>` for policy ID helpers
- Missing source key: amber footnote next to Try evaluate / Try scan
