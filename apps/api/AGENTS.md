# API MAP

- Package: `@workspace/api`, AdonisJS 7, ESM TypeScript.
- Runtime entrypoints: `bin/server.ts`, `bin/console.ts`, `bin/test.ts`.
- `adonisrc.ts` preloads `#start/routes`, `#start/kernel`, and `#start/view`.
- Init hooks index `src/**/*.controller.ts`, generate Tuyau registry, then generate data types.
- `start/routes.ts` imports both `#features/admin/routes` and `#features/client/routes`.
- Add a feature route module, then import it through its tree's route index.
- `start/kernel.ts` installs container bindings, forced JSON, and CORS server middleware.
- Router middleware: session, body parser, auth init, silent auth, SuperJSON, bouncer, limiter.
- Named middleware: `auth`, `authAttempt`, `admin`, `guest`.
- `start/view.ts` exposes shared theme `fonts` and `colors` to Edge mail templates.
## Package map

- `config/`: Adonis runtime adapters, all reading validated `#start/env` values.
- `database/migrations/`: schema changes; `database/schema.ts` is generated.
- `database/seeders/main/`: normal seeding; bootstrap admin has its dedicated script.
- `src/models/`: Lucid models; `src/presenters/`: response-shaping helpers.
- `src/services/`: cross-feature services such as OTP and files.
- `src/validators/`: shared Vine validation schemas.
- `src/middlewares/`: application and named middleware implementations.
- `src/exceptions/handler.ts`: exception rendering; `report()` must not send responses.
- `src/views/`: shared Edge email layout and components.
- `src/features/`: HTTP code, grouped first by audience then by domain.
## Configuration

- `config/auth.ts`: one `client` session guard backed by `User`; no remember-me tokens.
- `config/database.ts`: PostgreSQL connection and main seeders.
- `config/session.ts`: `adonis-session`, seven-day, HTTP-only, lax cookie session.
- `config/cors.ts`: credentials enabled; development permits all origins.
- `config/queue.ts`: Redis or sync; jobs discovered under `**/jobs/**/*.job.ts`.
- Mail jobs use queue `emails`; run the worker for asynchronous delivery.
- `config/mail.ts`: SMTP transport and configured sender.
- `config/drive.ts`: private filesystem uploads at `/uploads` or private S3.
- `.env`, `.env.example`, and `.env.test` supply runtime and test configuration.
## Route trees

- Admin tree: `src/features/admin/`, imported by `src/features/admin/routes.ts`.
- Admin account modules: `admin_management/{authentication,password,profile}`.
- Admin account prefixes are `admin/admin-management/{authentication,password,profile}`.
- Admin users module: `admin/users/`, declared below `/admin`.
- Admin user management requires `auth({ guards: ["client"] })` and `admin()`.
- Admin invitation acceptance is guest-only; keep it under `admin/users/routes.ts`.
- Client tree: `src/features/client/`, imported by `src/features/client/routes.ts`.
- Client account modules: `user_management/{authentication,password,profile}`.
- Client prefixes begin `/client/user-management/`.
- Authentication handles login/logout; password handles forgot/reset/update; profile handles self-service CRUD.
- Use `guest()` for login, forgot, and reset; use the `client` auth guard for protected routes.
- Throttle login, forgot, and reset with `authAttempt` and their existing scopes.
- Route handlers reference `controllers` from `#generated/controllers`, never direct controller imports.
- Preserve route names: Tuyau clients derive their typed surface from generated route metadata.
## Tests and conventions

- Active Japa tests are colocated in both admin and client feature trees.
- Controller HTTP cases use `*.e2e.spec.ts`; policies, jobs, and mails use `*.unit.spec.ts`.
- `adonisrc.ts` discovers those two suffixes across the package.
- `bootstrap.ts` migrates then truncates the test database; e2e suites start the HTTP server.
- Keep tests beside the implementation they exercise, not in a separate legacy test tree.
- Controllers conventionally expose `handle()`; use static `vine.create(...)` payload schemas where needed.
- Use `@inject()` for services with dependencies.
- Feature jobs extend `Job`; keep feature mail templates and mail classes colocated.
- Use package aliases (`#features/*`, `#models/*`, `#services/*`, `#start/*`), not deep relatives.
## ANTI-PATTERNS

- Do not edit `ace.js`, `.adonisjs/**`, generated controller registries, or `database/schema.ts`.
- Do not bypass `force_json_response.middleware.ts`; API consumers require JSON responses and errors.
- Do not move feature controllers into `src/controllers`; indexing scans feature code under `src`.
- Do not rename `password_changed_notifiction.mail.ts` casually; existing imports use that spelling.
- Do not rename routes without checking generated Tuyau consumers and updating `.yaak` route records.
## Commands

```bash
pnpm --filter @workspace/api dev
pnpm --filter @workspace/api worker
pnpm --filter @workspace/api test
pnpm --filter @workspace/api typecheck
pnpm --filter @workspace/api build
pnpm --filter @workspace/api docker-compose
pnpm --filter @workspace/api bootstrap:admin
```
