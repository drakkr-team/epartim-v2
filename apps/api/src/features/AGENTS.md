# API FEATURE ROUTE MAP

## Domain split

- `src/features/admin` is the internal administration API.
- `src/features/client` is the customer-facing API.
- Do not place staff user administration under `client`.
- Do not place customer account flows under `admin`.
- Admin account management lives at `admin/admin_management`.
- Client account management lives at `client/user_management`.
- Their authentication, profile, and password flows are parallel, not shared route files.
- Admin user lifecycle operations live separately in `admin/users`.

## Route composition

- `start/routes.ts` imports only `#features/admin/routes` and `#features/client/routes`.
- `admin/routes.ts` composes `admin_management/routes` and `users/routes`.
- `client/routes.ts` composes `user_management/routes`.
- `admin/admin_management/routes.ts` composes authentication, profile, and password routes.
- `client/user_management/routes.ts` composes authentication, profile, and password routes.
- Keep leaf route declarations beside their feature controllers.
- Import a new leaf route through every required domain aggregator.
- A route omitted from an aggregator is not registered.

## Public route namespaces

- Admin authentication: `/admin/admin-management/authentication`.
- Admin profile: `/admin/admin-management/profile`.
- Admin password: `/admin/admin-management/password`.
- Admin user administration: `/admin/users`.
- Invitation acceptance: `/admin/invitations/accept`.
- Client authentication: `/client/user-management/authentication`.
- Client profile: `/client/user-management/profile`.
- Client password: `/client/user-management/password`.
- Preserve route-name namespaces: `admin.*` and `client.*`.
- Management subdomains use `admin_management` and `user_management` in route names.

## Controllers and middleware

- Route targets come from `#generated/controllers`.
- Controller registry paths mirror feature directories in camel case.
- Example: `admin/admin_management` maps through `controllers.features.admin.adminManagement`.
- Example: client user management maps through `controllers.features.client.userManagement`.
- Do not direct-import a controller into a route file.
- Do not hand-edit generated controller registry output.
- Fix controller source placement or naming, then regenerate the registry.
- Login routes require `guest()` and `authAttempt({ identifier: "uid", scope: "login" })`.
- Logout routes require `auth({ guards: ["client"] })`.
- Forgot-password and reset-password routes are guest-only.
- Forgot attempts use email and `password-forgot` scope.
- Reset attempts use token and `password-reset` scope.
- Password update routes require the `client` auth guard.
- Profile view, update, and deletion routes require the `client` auth guard.
- `/admin/invitations/accept` is guest-only.
- Admin `/users` operations require the `client` guard and `admin()` middleware.
- Do not infer admin authorization from the `/admin` prefix alone.

## Tests

- Colocate controller HTTP coverage as `*.controller.e2e.spec.ts`.
- Colocate policy coverage as `*.policy.unit.spec.ts`.
- Keep password job and mail tests beside their jobs and mails.
- Existing admin and client authentication/password tests follow this layout.
- Add route-behavior coverage in the owning admin or client feature, never at `src/features` root.

## ANTI-PATTERNS

- Do not register leaf routes directly from `start/routes.ts`; preserve the composition chain.
- Do not infer admin authorization from URL prefixes; apply `admin()` explicitly.
- Do not hand-edit generated controller registries to fix source naming.
