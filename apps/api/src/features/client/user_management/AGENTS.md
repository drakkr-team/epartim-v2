# Client user-management guide

## Scope

- Entry point: `routes.ts` imports all three namespaces.
- Base paths use `/client/user-management`, with hyphens.
- Route names use `client.user_management`, with underscores.
- Controllers resolve through `#generated/controllers`.
- Middleware comes from `#start/kernel`.

## Authentication namespace

- Module: `authentication/`.
- Prefix: `/client/user-management/authentication`.
- Route name prefix: `client.user_management.authentication`.
- `POST /login` targets `Login`.
- Login is guest-only via `middleware.guest()`.
- Login applies `authAttempt` with identifier `uid`.
- Login attempt scope is `login`.
- `DELETE /logout` targets `Logout`.
- Logout requires `middleware.auth({ guards: ["client"] })`.
- Keep login/logout policies and service in this namespace.

## Password namespace

- Module: `password/`.
- Prefix: `/client/user-management/password`.
- Route name prefix: `client.user_management.password`.
- Guest routes: `POST /forgot` and `POST /reset`.
- Forgot targets `Forgot`; reset targets `Reset`.
- Guest group uses `middleware.guest()`.
- Forgot throttles/auth-attempts on `email` in `password-forgot` scope.
- Reset throttles/auth-attempts on `token` in `password-reset` scope.
- Authenticated route: `PUT /` targets `Update`.
- Update requires the `client` guard.
- Keep token, mail-job, and password service workflows local.
- Reset and changed-notification mail assets are local to this namespace.

## Profile namespace

- Module: `profile/`.
- Prefix: `/client/user-management/profile`.
- Route name prefix: `client.user_management.profile`.
- `GET /` targets `View`.
- `PUT /` targets `Update`.
- `DELETE /` targets `Delete`.
- The whole profile group requires the `client` guard.
- Keep view, update, and delete policies local.
- Keep account-deleted mail job and assets local.
- Profile service owns account-deletion orchestration.

## Shared contracts

- User payload validators live at `#validators/user.validator`.
- Password and profile handlers consume shared user schemas.
- User model lives at `#models/user`.
- Preserve `user.toJSON()` when response shaping matters.
- Do not return raw user records where the model JSON contract is required.

## Local workflow rules

- Keep route controllers inside their namespace.
- Keep authorization rules in namespace policies.
- Use guest middleware only for unauthenticated login/recovery flows.
- Use explicit `client` guard middleware for authenticated client flows.
- Keep password mail dispatch out of controllers.
- Keep profile deletion side effects in the profile service.
- Preserve route prefixes and names; Tuyau consumers depend on them.

## ANTI-PATTERNS

- Do not direct-import controllers from route files.
- Do not move password mail work or profile deletion side effects into controllers.
- Do not return raw user records where presenter or model serialization defines the contract.
