# Policy Structure Graph Overrides

> **PROJECT:** ROS Policy
> **Generated:** 2026-07-24
> **Page Type:** Policy structure network graph (fleet + detail)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Scope

- **Fleet:** `/policies/graph` — policies linked to jurisdictions, scope data types/sources, systems, processes
- **Detail:** Structure panel on `/policies/[id]` — one policy → rules, entities, tags, references, scope, systems, processes
- **Not Insights:** Runtime audit relations stay on ReactFlow at `/insights` — do not migrate

### Layout Overrides

- **Shell:** LangSmith-style app chrome via `ConsoleShell`
- **Fleet sections:** Breadcrumbs → Page header → Filters (`PoliciesFilter`: q / policy_kind / status) → **Kind filter** (interactive node kinds) → Graph + adjacency table + detail panel
- **Detail:** Structure panel full-width above Definition / Applies to / Provenance / Versions; YAML remains the primary edit job
- **Split:** Graph (desktop `lg+`) left; detail panel right (280px); adjacency table always below graph
- **Mobile:** Hide WebGL canvas; show keyboard-selectable node list + adjacency table

### Color Overrides

- Inherit Master LangSmith-neutral palette
- **Policy nodes:** `#1E40AF` (`--primary`)
- **Rule / entity:** `#3B82F6` (`--secondary`)
- **Data type / source:** `#64748B`
- **System:** `#B45309`
- **Process:** `#0F766E`
- **Tag:** `#0F766E`
- **Reference:** `#475569` (no purple)
- **Jurisdiction:** `#0369A1`
- **Selection / path highlight:** `#D97706` (`--accent`) / amber-50 row tint
- **Edges:** `#90A4AE` at ~60% opacity
- **applies_to:** Governance catalog links (systems/processes) — not evaluate `scope.sources`
### Component Overrides

- **Library:** `reagraph` `GraphCanvas` (WebGL), dynamic import with `ssr: false`
- **Layouts:** Fleet `forceDirected2d`; detail `hierarchicalTd`
- **A11y (mandatory):** Adjacency list table (Source → Relation → Target) is the accessible primary; graph has `role="img"` + descriptive `aria-label`
- **Motion:** `animated={!prefersReducedMotion}`; 2D only
- **Deep link:** `?focus=` node id bookmarkable

### Interaction Overrides

- `cursor-pointer` on nodes, adjacency rows, and deep links
- Focus rings via global `:focus-visible`
- Node/row selection updates detail panel (`aria-live="polite"`)
- Policy node detail includes Open policy; detail mode links to fleet graph
- **Kind filter:** Toggle chips for node kinds present in the graph (Policy, Rule, Entity, Data type, Source, **System**, **Process**, Tag, Reference, Jurisdiction). `aria-pressed`; pressed = ring + full opacity, unpressed = muted. Hiding a kind removes its nodes and edges (including `applies_to`) from canvas, adjacency, and mobile list; clears `?focus=` if the selected node’s kind was hidden. Default: all present kinds on. Does **not** change `PoliciesFilter` Kind (retention / classification).
- **Zoom toolbar** (desktop canvas): Zoom in / Zoom out / Fit to view via `GraphCanvasRef`; `cameraMode="pan"`; scroll-wheel zoom still available from reagraph camera controls
- **Labels:** Node names only (no kind `subLabel`); no edge relation text on canvas — relation in adjacency table; `labelType="auto"` so dense/zoomed-out views cull labels
- **Detail layout spacing:** `hierarchicalTd` with higher `nodeSeparation` / `nodeSize` to reduce name collisions
- Toolbar buttons: Lucide icons, `aria-label` + `title`, `cursor-pointer`

### Anti-Patterns Forbidden

- Replacing Insights ReactFlow with reagraph
- Graph as the only representation of structure
- Animated force when `prefers-reduced-motion: reduce`
- Purple/glow AI styling; emoji icons

---

## Page-Specific Components

- `PolicyStructureGraph` — `admin/components/policy-structure-graph.tsx`
- `PolicyStructureCanvas` — `admin/components/policy-structure-canvas.tsx` (reagraph + zoom toolbar)
- Builder — `admin/lib/policy-structure-graph.ts`
- Fleet page — `admin/app/(console)/policies/graph/page.tsx`
