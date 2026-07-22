# Policy Details Page Overrides

> **PROJECT:** DRPE Admin
> **Generated:** 2026-07-22
> **Page Type:** Policy definition editor / ops console

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Grid:** Stacked by default; `xl` breakpoint uses `1.6fr / 1fr` so Definition (YAML editor) is primary and Version history is secondary
- **Sections:** Page header + meta row, Definition panel, Version history panel

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- Editor body uses Master mono (`Fira Code` via `--font-mono`)

### Color Overrides

- Monaco theme `drpe-light` maps to Master tokens (surface white, primary blue, accent amber cursor) — do **not** use dark/violet editor themes on this page

### Component Overrides

- **Definition panel:** Monaco YAML editor (dynamically loaded), not a plain textarea
- **Editor chrome:** Compact toolbar with `YAML` badge, line/col cursor, line count, Unsaved pill when dirty
- **Focus:** `focus-within` ring on editor shell; never remove focus outlines
- **Actions:** Validate & save / Validate only; ⌘/Ctrl+S submits save
- **Lifecycle bar:** Below page header — guided actions (Publish, Deprecate, Archive, Reactivate, Restore to draft) with confirm dialog; success/error feedback on the left, action buttons on the right
- **Lifecycle vs versions:** Lifecycle changes policy status; version **Restore snapshot** rolls back definition content — keep labels distinct

---

## Page-Specific Components

- `YamlCodeEditor` — Monaco wrapper (`admin/components/yaml-code-editor.tsx`)
- `YamlCodeEditorSkeleton` — pulse placeholder while Monaco chunks load
- `PolicyYamlEditor` — form + hidden `yaml` field + dirty/save wiring
- `PolicyStatusActions` — lifecycle transitions with confirm dialog
- `ConfirmDialog` — accessible confirmation for destructive/adjacent actions

---

## Recommendations

- Keep server-side validate/save as source of truth (no client schema diagnostics in Monaco yet)
- Prefer dynamic import (`ssr: false`) so Monaco stays off the critical path
- Preserve existing success/error alerts under the editor
