# Processes Catalog Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-24
> **Page Type:** Processes list / detail (governance catalog)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here.

---

## Page-Specific Rules

### Layout Overrides

- Mirror Systems pages: create + table list; detail edit + linked policies
- **Detail:** Edit fields first; **Try evaluate / Try scan** playground deep-links; **Linked policies** section second
- One job per surface — business process inventory, not workflow automation

### Component Overrides

- Lucide `Workflow` in nav; FlaskConical / ScanSearch for playground CTAs; no emoji icons
- Same link UX as Systems (replace-set policy IDs)
- Playground CTAs: `/evaluate?process=<id>` and `/classify?process=<id>`
- Processes have no `source_key` — CTAs open playground with governance context only

### Interaction / a11y

- Same a11y checklist as `systems.md`
- Focus rings on forms; `cursor-pointer` on controls
