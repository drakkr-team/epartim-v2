# Admin App

## OVERVIEW

- TanStack Start SPA for internal administration.
- Vite serves the app on port 3001.
- The root document sets French (`lang="fr"`) and the `Epartim Admin` title.
- The `(admin)` route group wraps the dashboard and user-management routes.
- `AdminShell` supplies the navy sidebar and the main content surface.
- The dashboard is `/`; user routes are `/users`, `/users/new`, and `/users/$id`.

## WHERE TO LOOK

- `src/routes/(admin)/layout.tsx`: protected admin boundary and redirect behavior.
- `src/utils/auth.ts`: administrator check backed by the current-profile query.
- `src/components/layout/admin-shell.tsx`: sidebar navigation and shell styling.
- `src/routes/(admin)/users/page.tsx`: user list, filters, and invitation entry point.
- `src/routes/(admin)/users/new/page.tsx`: invitation page copy and form host.
- `src/routes/(admin)/users/$id/page.tsx`: detail, status actions, and edit host.
- `src/features/users/components/user-form.tsx`: create/update payloads and role attachments.
- `src/libs/tuyau.ts`: typed admin API client configuration.
- `src/libs/i18n/config.ts`: French i18next initialization.
- `scripts/compile-locales.js`: merges route locale JSON into the runtime bundle.
- `src/styles/globals.css`: Tailwind entry point, shared theme CSS, and font imports.

## CONVENTIONS

- Put protected screens below `src/routes/(admin)`; its `beforeLoad` is the route guard.
- `isAdministrator` loads `api.adminManagement.profile.view` through the route QueryClient.
- A non-administrator redirects to `/login` at `VITE_APP_URL`; failed profile queries also deny access.
- Treat this guard as navigation control only; admin API authorization remains authoritative.
- Import app source through `#/`; relative imports are rejected by the app Biome config.
- Use `api` from `#/libs/tuyau`, not an ad-hoc HTTP client.
- Tuyau uses `VITE_API_BASE_URL`, JSON `Accept`, included credentials, SuperJSON, and `registry`.
- `api` is the React Query Tuyau client narrowed to the generated `.admin` surface.
- Use generated query/mutation options and invalidate their `pathKey()` after mutations.
- User listing fetches `listUsers` plus `userOptions`; filters are local by status, role, firm, and network.
- New users call `createUser`; a successful create invalidates the list and navigates to the detail route.
- User edits call `updateUser`; the email is create-only in the current form.
- A distributor requires a firm; a network manager requires a network; other role changes clear both IDs.
- Invited users can resend or cancel invitations; active users can be disabled; disabled users can reactivate.
- Detail status actions invalidate both the individual view and the users list.
- Keep the admin in the shared visual system: `@workspace/ui-react`, `@workspace/ui-theme`, Montserrat, and existing token classes.
- Preserve the light forced theme, tooltip provider, toast provider, and existing sidebar language.
- Use shared `Button`, `Input`, `Table`, `Sidebar`, icons, and toast exports before custom controls.
- Keep route-local French copy in `routes/**/locales/fr.json` when it needs translation support.

## ANTI-PATTERNS

- Do not add an unguarded route outside the `(admin)` group for an admin workflow.
- Do not bypass Tuyau, cookie credentials, or the generated API registry for admin calls.
- Do not duplicate authorization decisions in the UI as a substitute for API authorization.
- Do not create admin-only color, font, theme-mode, or sidebar conventions.
- Do not edit `src/routeTree.gen.ts`; TanStack generates it from the route files.
- Do not edit `src/libs/i18n/build/fr.json`; the locale compiler generates it.
- Do not hand-maintain `.tanstack` output if present.

## COMMANDS

- `pnpm --filter @workspace/admin dev` starts Vite and the locale watcher on port 3001.
- `pnpm --filter @workspace/admin i18n:build` regenerates the French runtime bundle.
- `pnpm --filter @workspace/admin typecheck` checks the app TypeScript surface.
- `pnpm --filter @workspace/admin build` produces the static Vite build.
