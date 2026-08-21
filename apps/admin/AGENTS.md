# Admin app

## Scope

- TanStack Start application shell for internal administration (`@workspace/admin`).
- Vite serves the app on port 3001.
- `src/routeTree.gen.ts` is generated and must not be edited.

## Current routes

- `/login` is a static administration login screen. Its inputs and submit action are intentionally disabled.
- `(admin)` contains only the dashboard shell and dashboard page; its layout does not enforce authentication.
- There is no frontend API client, session guard, query, mutation, or domain feature yet.
- Active admin account and CRUD APIs live in `apps/api`; do not imply they are wired to this UI.

## Conventions

- Keep the admin in the shared visual system: `@workspace/ui-react`, `@workspace/ui-theme` and existing token classes.
- `AdminShell` owns sidebar navigation and page chrome.
- Use `#/` imports for app code.
- Keep route translations beside their routes; regenerate locale bundles through the package scripts.
- Add protection and a typed API client with the first concrete administration capability.
- Do not recreate removed admin user workflows as inactive code.
- Do not edit `src/routeTree.gen.ts` or `src/libs/i18n/build/**`.

## Commands

```bash
pnpm --filter @workspace/admin dev
pnpm --filter @workspace/admin typecheck
pnpm --filter @workspace/admin build
```
