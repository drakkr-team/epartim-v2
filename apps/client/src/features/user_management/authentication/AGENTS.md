# apps/web/src/features/user_management/authentication KNOWLEDGE BASE

## OVERVIEW

Login/logout frontend feature built with TanStack Form, Tuyau mutations, React Query cache updates, and colocated French translations.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Login UI | `components/login-form.tsx` | Uses `useLoginForm`. |
| Form setup | `hooks/use-login-form.ts` | Builds `useAppForm` defaults and submit handler. |
| Login mutation | `hooks/use-login-mutation.ts` | Calls `api.userManagement.authentication.login`. |
| Logout mutation | `hooks/use-logout-mutation.ts` | Calls `api.userManagement.authentication.logout`; used by sidebar. |
| Translations | `locales/fr.json` | Error copy for auth hooks. |
| Login route | `../../../routes/(guest)/(auth)/login/page.tsx` | Validates `redirectTo` search. |

## CONVENTIONS

- Form defaults are `{ uid: "", password: "" }`.
- Login success clears `api.userManagement.profile.view.pathKey()` and navigates to `redirectTo ?? "/"`.
- Logout success clears `api.userManagement.profile.view.pathKey()` and navigates to `/login`.
- Hook translation namespaces include the full feature path and hook name.
- Error mappings translate Tuyau network, validation, auth, guest-only, and unexpected cases.

## ANTI-PATTERNS

- Do not hardcode API paths; use the generated `api.userManagement.authentication.*` helpers.
- Do not bypass `useAppForm`; field components are registered centrally.
- Do not change backend error codes without updating `locales/fr.json` and hook mappings.
- `UseLogin*Params = never` placeholders are current style; remove only with a focused hook API cleanup.
