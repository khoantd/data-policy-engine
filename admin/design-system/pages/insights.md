# Insights Page Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-23
> **Page Type:** Relations / network insights

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Shell:** LangSmith-style app chrome via `ConsoleShell`
- **Sections:** Breadcrumbs → Page header → Mode segmented control → Filters → Legend → Graph + adjacency table + detail panel
- **One job:** Explore how policies and requesters connect through audit hit logs
- **Split:** Graph (desktop `lg+`) left; detail panel right (280px); adjacency table always below graph
- **Mobile:** Hide force/canvas graph; show keyboard-selectable node list + adjacency table

### Color Overrides

- Inherit Master LangSmith-neutral palette
- **Policy nodes:** `--primary` (`#1E40AF`) border
- **Rule / Requester nodes:** `--secondary` (`#3B82F6`) border
- **Other / truncated:** `--muted-fg`
- **Selection / path highlight:** `--accent` (`#D97706`) / amber-50 row tint
- **Edges:** `#90A4AE` at ~60% opacity; stroke width scales with hit weight

### Component Overrides

- **Mode:** `SegmentedControl` — Policies | Requesters
- **Graph:** `@xyflow/react` ReactFlow — static layout (no animated force); respect `prefers-reduced-motion`
- **A11y (mandatory):** Adjacency list table (Source → Target → Hits → Top actions) is the accessible primary; graph has `role="img"` + descriptive `aria-label`
- **Detail panel:** Hits, connected edges, links to Audit (filtered) and Policy detail

### Interaction Overrides

- `cursor-pointer` on nodes, adjacency rows, and deep links
- Focus rings via global `:focus-visible`
- Node/row selection updates detail panel (`aria-live="polite"`)
- Do not auto-play or animate edges

### Anti-Patterns Forbidden

- Pink/romance palette or “vibrant block” marketing look
- Graph as the only representation of relations
- Animated force layout when `prefers-reduced-motion: reduce`
- Emoji icons (use Lucide)
