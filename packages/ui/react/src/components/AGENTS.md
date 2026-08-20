# Components

## Folder Shape

- Keep one public UI surface per direct child folder.
- Each current folder contains `<name>.tsx`, `<name>.stories.tsx`, and `index.ts`.
- Put implementation, public types, and examples beside the component.
- Name implementation exports `NameRoot` and `NamePart`.
- Keep the consumer-facing name in the barrel: `Name`.
- Import public components from `@workspace/ui-react/components/<name>`.
- Internal component dependencies may import a sibling barrel with `../<name>`.
- Do not add a package-wide component barrel; exports are per-component subpaths.

## Barrels and APIs

- `index.ts` is the sole consumer API for its folder.
- Assemble most public APIs with `Object.assign(NameRoot, { Part })`.
- Expose parts as properties: `Dialog.Content`, `Card.Header`, `Table.Cell`.
- Keep root props aliased as `NameProps` in the barrel.
- Re-export part prop types from the barrel with their public names.
- Preserve generic root signatures for collection controls.
- Select, Combobox, and Autocomplete expose typed generic root APIs.
- Keep Base UI prop surfaces on their wrappers unless deliberately narrowed.
- Re-export the intended Base UI namespace as the existing `*Headless` alias.
- Preserve established public export spellings; they are compatibility surface.
- Toast is the intentional exception: export `ToastProvider`, Sonner `toast`, and `ExternalToast`.
- Single-root components still use `Object.assign(Root, {})` in their barrels.

## Composition

- Wrap Base UI primitives locally; consumers use this package's styled API.
- Dialog and alert dialog own backdrop, popup, and transition presentation.
- Menus, selects, comboboxes, and autocomplete compose dropdowns with `ScrollArea`.
- Inputs accept local slot composition; retain their sizing-hook integration.
- Password input composes Input, Button, Toggle, and local visibility state.
- Number input composes Base UI number-field behavior with Input and Button controls.
- Card and Link use Base UI render utilities for polymorphic native elements.
- Sidebar, Table, Skeleton, and Spinner are local semantic/presentational components.
- Tabs compose Base UI tabs with the local scroll area.
- Do not flatten a compound API into unrelated standalone exports.

## Styling

- Use Tailwind utility strings and generated theme token classes.
- Compose ordinary `className` values with `cn` or `cx` from `tailwind-variants`.
- Define variant matrices with `tv`; derive props with `VariantProps<typeof variants>`.
- Pass variant-aware class names through the existing `tv` call pattern.
- Preserve Base UI data-attribute selectors for state, visibility, and transitions.
- Keep styles local to the component implementation.
- Use existing neutral, primary, semantic, radius, border, and spacing utilities.
- Do not introduce ad hoc CSS variables or duplicate theme tokens.
- Do not replace render-prop or `render` support with fixed elements without need.

## Stories

- Keep one colocated `*.stories.tsx` file for each component folder.
- Type metadata with `Meta` and stories with `StoryObj` from `@storybook/react-vite`.
- Import the subject from `./index` in its own story.
- Import collaborating components through their sibling barrels or public subpaths.
- Set the component's Storybook title and subject metadata.
- Use `Default` for the baseline composition.
- Add focused variants for supported modes, sizes, grouping, multiplicity, or states.
- Model controlled interactions in the story when the API requires state.
- Keep examples representative of public compound composition.
- Treat stories as the component manual QA and documentation surface.

## Anti-patterns

- Do not import a component implementation file from an application or another package.
- Do not expose a new component or part without updating its local barrel.
- Do not bypass wrappers by importing Base UI primitives in consumers.
- Do not move component stories to a central examples directory.
- Do not duplicate local styling rules in global CSS.
- Do not remove forwarded props, refs, data attributes, or accessibility behavior from wrapped primitives.
- Do not casually rename a public alias, prop type, or compound property.
