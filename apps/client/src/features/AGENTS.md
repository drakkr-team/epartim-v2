# apps/web/src/features KNOWLEDGE BASE

## OVERVIEW

Frontend feature modules. Current domain mirrors the API domain: `user_management`; route files remain under `src/routes`.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Domain features | `user_management/` | Mirrors backend domain naming. |
| Shared form wrapper | `../libs/form.ts` | Feature forms should use `useAppForm`. |
| API client | `../libs/tuyau.ts` | Feature hooks use typed Tuyau query/mutation helpers. |
| Locale build | `../../scripts/compile-locales.js` | Compiles all `locales/fr.json` files. |
| Route surfaces | `../routes/(guest)/(auth)/*`, `../routes/(private)/profile/*` | Routes compose feature components. |

## CONVENTIONS

- Keep feature folders domain-first: `features/<domain>/<feature>`.
- Put feature components, hooks, and locales under the feature folder.
- Use `#/` imports for app-local modules.
- Feature namespaces should mirror their path when passed to `useTranslation`.

## ANTI-PATTERNS

- Do not put route-specific files in `features`; route files stay under `src/routes`.
- Do not edit generated i18n output under `src/libs/i18n/build`.
- Do not call raw fetch for API endpoints; use `src/libs/tuyau.ts`.

## NOTES

- Current feature code covers authentication, password, and profile flows; route composition lives outside `features`.
- Add one AGENTS file per domain or concrete feature when new conventions appear.
- Keep API domain spelling (`user_management`) aligned with backend paths.
