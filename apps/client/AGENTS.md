# Client app

## Scope

- Customer-facing TanStack Start application (`@workspace/client`).
- Source alias: `#/` maps to `src/*`.
- File routes live in `src/routes`; `src/routeTree.gen.ts` is generated and must not be edited.

## Current routes and features

- Guest routes under `(guest)/(auth)` provide login, password recovery and password reset.
- Private routes are protected through the `(private)` layout.
- Profile routes provide general information, security and privacy screens.
- Client identity hooks live under `src/features/user_management` and use the typed Tuyau client in `src/libs/tuyau.ts`.
- The sidebar user menu remains visual-only until its final product behavior is decided; do not attach actions to it without an explicit request.

## Conventions

- Use shared primitives from `@workspace/ui-react` before creating local components.
- Use `#/` imports for app source.
- Keep route-local French content in `routes/**/locales/fr.json` and feature translations with their feature.
- Do not edit generated i18n bundles or `routeTree.gen.ts`.

## Commands

```bash
pnpm --filter @workspace/client dev
pnpm --filter @workspace/client typecheck
pnpm --filter @workspace/client build
```
