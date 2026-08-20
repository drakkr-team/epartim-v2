# Admin app

## Scope

- TanStack Start application for internal administration (`@workspace/admin`).
- Vite serves the app on port 3001.
- `src/routeTree.gen.ts` is generated and must not be edited.

## Current routes

- `/login` is a static administration login screen. Its inputs and submit action are intentionally disabled.
- `(admin)` contains only the dashboard shell and dashboard page.
- There are no administrator actions, user-management routes, invitations or API-backed authorization checks at this stage.

## Conventions

- Keep the admin in the shared visual system: `@workspace/ui-react`, `@workspace/ui-theme` and existing token classes.
- `AdminShell` owns sidebar navigation and page chrome.
- Use `#/` imports for app code.
- Add a protected route or typed API client only alongside a concrete administration capability.
- Do not recreate removed admin user workflows as inactive code.

## Commands

```bash
pnpm --filter @workspace/admin dev
pnpm --filter @workspace/admin typecheck
pnpm --filter @workspace/admin build
```
