# Client user management

## SCOPE

- `authentication`: login form/mutation and logout mutation.
- `password`: forgot, reset, and authenticated update forms/mutations.
- `profile`: update form and permanent-deletion confirmation flow.
- Hooks own API, cache, navigation, toast, and translated-error behavior; components own rendering.

## API AND CACHE

- Use the typed `api` client from `#/libs/tuyau`; never call raw fetch from feature code.
- Use generated Tuyau query/mutation options and keys.
- `#/utils/auth.ts` owns current-user loading for route guards.
- Login refreshes the canonical profile query before navigating.
- Logout and account deletion remove the profile query before leaving private routes.
- Profile and password mutations invalidate only affected generated keys.
- Never put passwords or reset tokens in React Query state.

## NAVIGATION AND ERRORS

- Navigate only after confirmed mutation success.
- Login accepts a safe redirect destination and otherwise opens `/client-portfolio`.
- Logout, account deletion, and authenticated password update return to login.
- Password reset returns to login after the API accepts the token.
- Map Tuyau failures through `toastifyTuyauError`; form hooks own field-error mapping.
- Keep retryable form values after recoverable failures.

## LOCALES

- Every hook/component namespace has colocated French messages.
- Keep locale namespaces aligned with `features.user_management.<domain>...`.
- Update error-code mappings and locale keys together.
- Generated locale bundles under `src/libs/i18n/build` are never edited directly.

## ANTI-PATTERNS

- Do not invent invitation/registration behavior; neither feature exists here.
- Do not duplicate API clients, cache keys, transport parsing, or route guards in components.
- Do not navigate on button intent, retain credentials, or broadly clear unrelated caches.
