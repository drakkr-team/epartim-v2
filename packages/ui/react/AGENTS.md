# @workspace/ui-react

## Scope

- Private React 19 UI workspace package.
- ESM package; source is consumed directly.
- No package build script.
- TypeScript runs in strict, no-emit bundler mode.
- Keep package guidance here; component authoring rules live in `src/components/AGENTS.md`.

## Public API

- Import components only from `@workspace/ui-react/components/<name>`.
- The `./components/*` export resolves to each component folder's `index.ts`.
- Public component subpaths: `alert-dialog`, `autocomplete`, `avatar`, `button`, `card`.
- Also: `checkbox`, `combobox`, `dialog`, `field`, `input`, `link`, `menu`.
- Also: `number-input`, `password-input`, `scroll-area`, `select`, `sidebar`.
- Also: `skeleton`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `tooltip`.
- Each component barrel exports its named UI surface and its public prop types.
- Base UI wrappers additionally expose their intentionally named `*Headless` aliases.
- `@workspace/ui-react/components/toast` exports `toast`, `ExternalToast`, and `ToastProvider`.
- `@workspace/ui-react/icons` re-exports all `lucide-react` icons.
- `@workspace/ui-react/hooks/use-element-size` exports `useElementSize`.
- `@workspace/ui-react/hooks/use-merge-refs` exports `useMergeRefs`.

## ANTI-PATTERNS

- Do not import component implementation files from consuming apps.
- Do not invent unexported package entry points.

## Styling and tooling

- `src/globals.css` imports Tailwind and `@workspace/ui-theme/tailwind`.
- Storybook loads that global stylesheet; retain it when changing preview setup.
- Vite uses React, React Compiler via Babel, and Tailwind plugins.
- Package Biome enables recommended React and Tailwind domains.
- Biome safely sorts Tailwind classes passed to `tv` and `cn`.
- Keep source compatible with React 19, React DOM 19, Tailwind 4, and the UI theme peer dependency.

## Storybook QA

- Stories are discovered from `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`.
- There are 25 colocated component stories and 25 component barrels.
- Docs and themes addons are enabled; docs default to `Documentation`.
- Autodocs are globally tagged on.
- Preview uses the centered layout and disables the backgrounds toolbar.
- `on*` args are wired to the actions panel.
- Theme decorators set `data-theme` to `light` or `dark`.
- Theme decorators also apply the neutral background utility classes.
- Manually inspect changed stories in both theme modes.
- Exercise visible variants, disabled states, keyboard behavior, overlays, and responsive layout as applicable.

## Commands

```bash
pnpm --filter @workspace/ui-react dev
pnpm --filter @workspace/ui-react typecheck
pnpm --filter @workspace/ui-react exec biome check .
```

- `dev` starts Storybook on port 6006 without opening a browser.
- This package defines no build or test script.
