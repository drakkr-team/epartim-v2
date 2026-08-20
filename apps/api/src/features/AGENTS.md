# API features

## Current feature tree

- `client/user_management/authentication`: login and logout.
- `client/user_management/password`: forgot, reset and authenticated password update.
- `client/user_management/profile`: view, update and delete the authenticated user.
- No administration, invitation, role, firm or network feature is currently present.

## Conventions

- Keep routes, controllers, policies, services, jobs, mail classes and templates within their domain.
- Compose the user-management routes through `src/features/client/routes.ts`, then import that file from `start/routes.ts`.
- Reference route controllers from `#generated/controllers` only.
- Keep HTTP specs and unit specs beside the code they cover.
- Do not add a feature solely as a placeholder.

When a new HTTP route is added, also update the Yaak workspace.
