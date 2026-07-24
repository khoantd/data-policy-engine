# Policy Detail Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-24
> **Page Type:** Policy detail / YAML editor / version history

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Grid:** `xl` uses `1.6fr / 1fr` — Definition (YAML) left; Provenance + Version history stacked right
- **Structure:** Full-width **Structure** panel above the Definition grid — reagraph network of rules/scope/entities/tags/references; YAML stays the primary edit job
- **One job:** Review and edit the stored policy definition; provenance and structure are secondary

### Component Overrides

- **Structure panel:** `PolicyStructureGraph` in `mode="detail"`; link to `/policies/graph` for fleet view
- **Provenance panel:** Only when `reference_sources` is non-empty; reuse `AiSourceReferences` in `mode="saved"` with title **AI research references (N)**; **default collapsed** so Definition stays primary
- **YAML dump:** Strip `reference_sources` from Monaco initial YAML — provenance is metadata, not DSL
- **Links:** External reference URLs use `rel="noopener noreferrer"` + sr-only “(opens in new tab)”
- **Chrome:** Inherit Master palette — no purple/glow AI styling

### Interaction / a11y

- Structure graph: adjacency table is accessible primary (see `policy-graph.md`); canvas hidden below `lg`
- Collapsible disclosure uses `aria-expanded` / `aria-controls`
- Focus rings remain visible; `cursor-pointer` on the disclosure control

---

## Page-Specific Components

- `PolicyStructureGraph` (`mode="detail"`) — `admin/components/policy-structure-graph.tsx`
- `AiSourceReferences` (`mode="saved"`) — `admin/components/ai-source-references.tsx`
- Server page: `admin/app/(console)/policies/[id]/page.tsx`
