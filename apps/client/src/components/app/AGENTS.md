# App component guidance

## DATA TABLE

- Keep app composition in this directory.
- Treat `DataTable` as a compound component.
- Keep table state near the table owner.
- Pass explicit columns and data.
- Keep table toolbar concerns separate from row rendering.
- Keep pagination controls coordinated with table state.
- Keep sorting state controlled when query-backed.
- Keep filtering state controlled when query-backed.
- Do not duplicate table state in children.
- Do not fetch data inside presentational table cells.
- Do not encode domain rules in generic table primitives.
- Prefer column metadata for reusable table behavior.
- Keep row actions close to their consuming feature.
- Preserve stable row identifiers.
- Avoid unstable inline column definitions when state depends on them.

## SIDEBAR

- Sidebar owns application navigation structure.
- Sidebar owns active-route presentation.
- Sidebar owns collapsed and expanded navigation presentation.
- Keep sidebar links declarative.
- Keep route-specific content outside the sidebar.
- Do not put feature data fetching in the sidebar shell.
- Do not duplicate navigation entries across sidebar variants.
- Keep mobile sidebar behavior aligned with desktop navigation.

## SHARED UI

- Use shared UI primitives from the established UI import paths.
- Prefer existing buttons, inputs, menus, sheets, and tooltips.
- Do not recreate shared primitives locally.
- Preserve shared component variants and accessibility behavior.
- Compose shared UI primitives before adding custom markup.
- Keep styling consistent with existing app-level patterns.

## QUERY KEYS

- Query keys are cache contracts.
- Define query keys from stable, serializable inputs.
- Include every server-result-affecting parameter in the key.
- Keep key shape consistent between query, invalidate, and prefetch.
- Use hierarchical keys for scoped invalidation.
- Do not use display labels as query-key identifiers.
- Do not omit filters, sorting, or pagination from result keys.
- Do not mutate query-key arrays after creation.
- Avoid broad invalidation when a scoped key is available.

## ANTI-PATTERNS

- Avoid prop drilling table or sidebar state through unrelated layers.
- Avoid parallel local state for URL-backed controls.
- Avoid one-off UI imports that bypass the shared design system.
- Favor the smallest composition change that preserves established contracts.
