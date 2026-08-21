# API MAP

- Package: `@workspace/api`, AdonisJS 7, ESM TypeScript.
- Runtime entrypoints: `bin/server.ts`, `bin/console.ts`, `bin/test.ts`.
- `start/routes.ts` registers the client user-management routes.
- Init hooks index controllers, generate the Tuyau registry, then generate data types.

## Current data model

- `users` is relation-free and contains `id`, `first_name`, `last_name`, `email`, `password`, `created_at` and `updated_at`.
- `files` is retained from the `e5.stack` base. Do not add a relation from `users` until it is needed.
- Do not reintroduce firms, networks, roles, invitations or admin tables without an explicit decision.
- Use schema-builder APIs in migrations; do not write raw SQL.
- `database/schema.ts` is generated: never edit it manually. Models must extend their generated schema class and declare only relations, hooks, or custom behavior; never redeclare database columns in model files.

## Client identity routes

- The client API lives in `src/features/client/user_management`.
- It exposes authentication, profile, password recovery/reset and password update routes below `/client/user-management`.
- The `client` session guard backs authentication.
- Use `auth`, `guest` and `authAttempt` middleware only through `#start/kernel`.
- Password reset tokens use `OtpService`; keep its Redis storage and one-time verification behavior intact.
- Mails, jobs and Edge templates remain colocated with their feature.

## Conventions

- Route handlers reference controllers from `#generated/controllers`, never direct controller imports.
- Use package aliases (`#models/*`, `#services/*`, `#start/*`), not deep relatives.
- Keep controller tests beside the implementation they exercise.
- Preserve `force_json_response.middleware.ts`; API consumers require JSON responses and errors.
- Do not edit `ace.js`, `.adonisjs/**`, generated controller registries or `database/schema.ts`.
- After route changes, run the API dev server or build to regenerate the Tuyau registry.

## Commands

```bash
pnpm --filter @workspace/api dev
pnpm --filter @workspace/api test
pnpm --filter @workspace/api typecheck
pnpm --filter @workspace/api build
```
