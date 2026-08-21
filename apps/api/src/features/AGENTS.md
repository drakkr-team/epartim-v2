# API features

## Current feature tree

- `admin/account_management/authentication`: admin login and logout.
- `admin/account_management/password`: admin forgot/reset password flows.
- `admin/account_management/profile`: authenticated admin profile view.
- `admin/admins`: protected administrator list/create/view/update/delete.
- `client/user_management/authentication`: login and logout.
- `client/user_management/password`: forgot, reset and authenticated password update.
- `client/user_management/profile`: view, update and delete the authenticated user.

## Where to look

| Task | Location |
|---|---|
| Compose all HTTP domains | `start/routes.ts` |
| Compose admin features | `admin/routes.ts` |
| Compose client features | `client/routes.ts` |
| Shared controller registry | `#generated/controllers` |

## Conventions

- Keep routes, controllers, policies, services, jobs, mail classes and templates within their domain.
- Compose domain routes through `src/features/{admin,client}/routes.ts`, then import both from `start/routes.ts`.
- Reference route controllers from `#generated/controllers` only.
- Authenticate each domain with its matching `admin` or `client` guard.
- Validate at controllers, authorize through policies, delegate workflows to services, and serialize with presenters.
- Keep HTTP specs and unit specs beside the code they cover.
- Do not add a feature solely as a placeholder.

When a new HTTP route is added, also update the Yaak workspace.
