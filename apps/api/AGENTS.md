# API MAP

## OVERVIEW

- `@workspace/api`: AdonisJS 7, ESM TypeScript, Lucid, Japa, Tuyau, Redis-backed queues.
- Runtime entrypoints: `bin/server.ts`, `bin/console.ts`, `bin/test.ts`.
- `start/routes.ts` composes independent admin and client route trees.
- `adonisrc.ts` indexes feature controllers and generates the typed frontend registry.

## FEATURE BOUNDARIES

| Domain | Location | Guard / role |
|---|---|---|
| Admin account | `src/features/admin/account_management` | Admin login/logout, password recovery, profile view |
| Admin CRUD | `src/features/admin/admins` | Protected administrator list/create/view/update/delete |
| Client account | `src/features/client/user_management` | Client auth, password, profile lifecycle |

- Keep routes, controllers, policies, services, jobs, mails, templates, and specs inside their domain.
- Shared models, presenters, validators, middleware, and services remain under `src/*`.
- Password flows use `OtpService`; preserve Redis storage and one-time token consumption.
- Email work is dispatched through feature jobs on the `emails` queue.

## DATA AND GENERATED BOUNDARIES

- Write schema changes as migrations; use schema-builder APIs rather than raw SQL.
- `database/schema.ts` is generated from migrations and is never a hand-edit target.
- Models extend generated schema classes; check the generated base before adding persistence fields.
- Do not edit `ace.js`, `.adonisjs/**`, `build/**`, or generated controller/Tuyau registries.
- After route/controller changes, run API build or dev to refresh generated registries.

## CONVENTIONS

- Route files resolve controllers through `#generated/controllers`.
- Use aliases such as `#features/*`, `#models/*`, `#presenters/*`, `#services/*`, and `#start/*`.
- Controllers validate with Vine, authorize with Bouncer, delegate workflows, and return presenters.
- Keep `*.unit.spec.ts` and `*.e2e.spec.ts` beside the implementation they cover.
- Preserve `force_json_response.middleware.ts`; consumers require JSON responses and errors.
- Add every changed HTTP route to `.yaak/` with matching auth, params, and body.

## COMMANDS

```bash
pnpm --filter @workspace/api dev
pnpm --filter @workspace/api test
pnpm --filter @workspace/api typecheck
pnpm --filter @workspace/api build
```
