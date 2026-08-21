# apps/api/src/features/admin/admin_management KNOWLEDGE BASE

## OVERVIEW

Admin account management is split into authentication, password, and profile
modules. `../routes.ts` imports this feature; this feature's `routes.ts` imports
all three module route files. The HTTP base path is `/admin/admin-management`,
not `/user_management`.

## STRUCTURE

```text
admin_management/
├── authentication/       # login/logout and session lifecycle
├── password/             # forgot/reset/update password flows
└── profile/              # authenticated profile view/update/delete
```

## ROUTES AND NAMESPACES

| Module | HTTP prefix | Route namespace | Controller namespace |
|---|---|---|---|
| Authentication | `/admin/admin-management/authentication` | `admin.admin_management.authentication` | `controllers.features.admin.adminManagement.authentication` |
| Password | `/admin/admin-management/password` | `admin.admin_management.password` | `controllers.features.admin.adminManagement.password` |
| Profile | `/admin/admin-management/profile` | `admin.admin_management.profile` | `controllers.features.admin.adminManagement.profile` |

- Authentication exposes guest-only `POST /login` and client-authenticated
  `DELETE /logout`.
- Password exposes guest-only `POST /forgot` and `POST /reset`, plus
  client-authenticated `PUT /` for changing the current password.
- Profile exposes client-authenticated `GET /`, `PUT /`, and `DELETE /`.
- Route aliases use underscores in `admin_management`; URL segments use the
  hyphenated `admin-management` spelling.

## GUARDS AND AUTHORIZATION

- Login is wrapped in `middleware.guest()` and
  `middleware.authAttempt({ identifier: "uid", scope: "login" })`.
- Forgot/reset share `middleware.guest()` and use `authAttempt` with `email` /
  `password-forgot` and `token` / `password-reset`, respectively.
- Logout, password update, and every profile route use
  `middleware.auth({ guards: ["client"] })`.
- Each controller also authorizes its matching feature policy through Bouncer;
  keep route middleware and controller policy checks symmetric when adding an
  account-management operation.

## COMPOSITION

- Authentication delegates session work to `authentication/services/auth.service.ts`.
- Password controllers validate payloads, then delegate reset/update workflows
  and mail dispatch to `password/services/password.service.ts` and its jobs.
- Profile view/update present users with `UserPresenter`; deletion delegates to
  `profile/services/profile.service.ts` so account deletion and its notification
  stay together.
- Password and profile password/profile payload validation comes from
  `#validators/user.validator` where the controller imports it.

## ANTI-PATTERNS

- Do not copy user-management paths, aliases, or controller namespaces here.
- Do not weaken `client` guard selection or replace guest routes with client auth.
- Do not move service side effects, mail dispatch, or Bouncer authorization into
  unrelated modules.
