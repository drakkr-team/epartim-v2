# apps/client GUIDE

## SCOPE

- Customer-facing TanStack Start application.
- Package name: `@workspace/client`.
- Source alias: `#/` maps to `src/*`.
- Keep guidance local to this app; do not duplicate repository guidance.

## ROUTING

- File routes live in `src/routes`.
- Vite config uses `layout` as the route token.
- Vite config uses `page` as the index token.
- Route groups use parenthesized directories.
- `src/routeTree.gen.ts` is generated; never edit it.
- `src/routes/__root.tsx` imports global styles and i18n configuration.
- `src/router.tsx` creates the QueryClient-backed router.
- Router defaults include intent preloading and scroll restoration.

## ACCESS AREAS

- Guest authentication routes live under `(guest)/(auth)`.
- Guest flows: login, activation, password recovery, and password reset.
- Private routes live under `(private)`.
- Private home is `(private)/page.tsx`.
- Keep access boundaries in the relevant route layouts.
- Operations routes nest under `(private)/(operations)`.
- Operations include client portfolio and souscriptions.
- Souscription detail uses the `$id` dynamic route.
- Profile routes nest under `(private)/profile`.
- Profile tabs: profile, security, and privacy.
- Preserve the route-tabbed profile structure.

## FEATURES AND FORMS

- User-management features live in `src/features/user_management`.
- Authentication owns login and logout hooks/components.
- Invitation owns account-activation hooks/components.
- Password owns forgot, reset, and update flows.
- Profile owns update and deletion flows.
- Build client forms with `useAppForm` from `src/libs/form.ts`.
- Registered fields: text, password, textarea, number, switch, checkbox.
- Use registered `SubmitButton` through the app form API.
- Reuse feature-local hooks rather than duplicating mutation setup in routes.

## API DATA

- Use `api` from `src/libs/tuyau.ts` for typed API operations.
- Tuyau uses the generated `@workspace/api/registry`.
- The client base URL is `VITE_API_BASE_URL`.
- Requests send `Accept: application/json` and include credentials.
- SuperJSON is configured as the Tuyau plugin.
- Use Tuyau React Query query/mutation options with the app router QueryClient.

## I18N

- French is the configured application language.
- Source translations are colocated as `locales/fr.json`.
- Build translations with `pnpm i18n:build`.
- Watch translations with `pnpm i18n:dev`.
- Generated bundle: `src/libs/i18n/build/fr.json`.
- Never edit the generated bundle directly.
- `postinstall` runs the locale build.

## ANTI-PATTERNS AND COMMANDS

- Development command: `pnpm --filter @workspace/client dev`.
- Client development server runs Vite on port 3000.
- Validate types with `pnpm --filter @workspace/client typecheck`.
- Build with `pnpm --filter @workspace/client build`.
- `apps/client/Dockerfile` still prunes `@workspace/web` and copies `apps/web`; treat container builds as broken until corrected.
- Correct Docker paths must target `@workspace/client`, `apps/client/nginx.conf`, and `apps/client/dist/client`.
- Do not copy the admin app's direct-query or local-state form style into client features.
