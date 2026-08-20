# Theme package

## Purpose

- Shared design-token package.
- Owns fonts and color scales.
- Exposes token data and generated Tailwind CSS.
- Package name: `@workspace/ui-theme`.
- ESM package.

## Public API

- `@workspace/ui-theme/tokens` exports `fonts` and `colors`.
- `@workspace/ui-theme/tailwind` resolves to generated `src/tailwind.css`.
- Keep these two export paths stable.
- Consumers must not import package internals.

## Source boundary

- Edit `src/tokens.ts` for token changes.
- `fonts` values must be strings.
- `colors` is color -> scale -> `{ light, dark }`.
- Numeric and named scale keys are supported.
- Add both theme values for every color token.
- Token names become CSS custom-property suffixes.

## Generated boundary

- `src/tailwind.css` is generated and checked in.
- Never edit `src/tailwind.css` manually.
- `scripts/generate-tailwind.js` validates tokens before writing CSS.
- It emits `@theme inline` font and color utilities.
- It emits light `:root` values.
- It emits dark `[data-theme="dark"]` values.
- It emits the Tailwind `dark` custom variant.
- It emits reduced-motion defaults.
- Regenerate after every `tokens.ts` edit.
- Command: `pnpm --filter @workspace/ui-theme generate:tailwind`.
- Watch command: `pnpm --filter @workspace/ui-theme dev`.
- Package build is the generator.

## Consumers

- `apps/client/src/styles/globals.css` imports `@workspace/ui-theme/tailwind`.
- Client imports Tailwind before the theme stylesheet.
- Client scans `@workspace/ui-react` with `@source`.
- `apps/admin/src/styles/globals.css` imports `@workspace/ui-theme/tailwind`.
- Admin follows the same Tailwind import order and UI-react source scan.
- `packages/ui/react/src/globals.css` also imports the generated stylesheet.
- Keep client and admin on the shared visual token system.

## API Edge use

- `apps/api/start/view.ts` imports `colors` and `fonts` from `@workspace/ui-theme/tokens`.
- It registers both as Edge globals: `colors` and `fonts`.
- Edge templates consume token data, not `tailwind.css`.
- Preserve token names and value shapes used by templates.

## Verification

- Run `pnpm --filter @workspace/ui-theme generate:tailwind` after token edits.
- Run `pnpm --filter @workspace/ui-theme typecheck` for TypeScript changes.
- Inspect client, admin, and API Edge consumers before changing exports.

## ANTI-PATTERNS

- Do not edit generated CSS or import package internals.
- Do not add incomplete light/dark color pairs.
- Do not change token names or export paths without checking all three consumer surfaces.
