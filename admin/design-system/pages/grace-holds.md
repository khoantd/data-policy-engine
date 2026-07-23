# Grace holds

Ops surface for sticky deferred destructive actions (`pending_grace`).

## Layout

- Table of **active** holds: Hold ID, Status, Policy, Rule, Record, Action, Grace ends (+ Notify), Ops
- Ops: **Force** (danger, confirm) and **Cancel** (secondary, confirm)
- Cross-links to Enforce jobs and Audit `pending_grace`

## Related

- Audit table shows Force/Cancel on `pending_grace` rows when `payload.hold_id` is present
- Backend: `GET/POST /api/v1/grace-holds…`
