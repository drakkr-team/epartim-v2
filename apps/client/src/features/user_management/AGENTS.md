# User management feature guide
## Scope
- Owns client-side authentication and account-management flows.
- Concrete features are `authentication`, `invitation`, `password`, and `profile`.
- Treat invitation acceptance as an account-creation/authentication flow.
- Keep password recovery and password change within this feature boundary.
- Keep profile viewing and editing within this feature boundary.
- Reuse shared UI, API, and form primitives; do not fork leaf implementations.

## Authentication and invitations

- Login establishes the authenticated user state.
- Logout clears user-scoped state before leaving protected navigation.
- Invitation acceptance activates an invited account and establishes authenticated state.
- Preserve invitation context until acceptance completes or is explicitly cancelled.
- Invalid, expired, or consumed invitations are terminal user-facing errors.
- Do not silently turn invitation failures into generic registration failures.
- Protected routes require authenticated state, not merely cached profile data.

## Password flows

- Password-reset requests do not disclose whether an account exists.
- Reset-token failures are explicit and recoverable through a new request.
- Password changes require current authentication where the API requires it.
- On successful password mutation, reconcile session state using the API contract.
- Never retain passwords, reset tokens, or plaintext credentials in client caches.

## Profile flows

- Profile screens render from the authenticated user's canonical record.
- Save profile edits through the feature API layer.
- Reconcile the canonical user record after a successful profile mutation.
- Do not duplicate profile fields or validation rules in leaf screens.
- Preserve server-returned profile values over optimistic local guesses.

## Cache rules

- Define user cache keys centrally at the feature boundary.
- Cache authenticated user data only while a valid session exists.
- Invalidate or remove user-scoped cache on logout, session expiry, and account switch.
- Invalidate affected user queries after profile or password mutations.
- Do not let a failed mutation overwrite known-good cached user data.
- Avoid cache writes for credentials, invitation tokens, and reset tokens.
- Prefer targeted invalidation over broad cache clearing.

## Navigation rules

- Navigation follows confirmed API state, never button intent alone.
- Send unauthenticated users to the sign-in route with a safe return destination.
- Return to the invitation flow only when its token/context remains valid.
- Redirect authenticated users away from guest-only routes.
- Preserve intended destination across sign-in when routing supports it.
- Use feature-level route constants or shared navigation helpers.
- Do not hard-code filesystem paths as navigation destinations.

## Error rules

- Surface actionable server errors next to the action that failed.
- Keep validation errors mapped to their relevant fields.
- Use shared error normalization; do not parse transport errors in leaf components.
- Preserve retryable form input after recoverable request failures.
- Treat unauthorized responses as session-state transitions, not isolated toasts.
- Log unexpected failures through the established client reporting path.
- Do not expose internal error details, tokens, or credentials in messages.

## Locales and copy

- Put user-facing strings in the established client locale catalogs.
- Reuse existing authentication and account copy keys before adding keys.
- Add invitation-specific copy for valid, invalid, expired, and accepted states.
- Keep interpolation data minimal and safe for display.
- Do not embed translated prose in components, hooks, or API modules.
- Keep locale keys semantic; avoid encoding layout or route names in keys.
- Update every supported locale when adding machine-consumed keys.

## ANTI-PATTERNS

- Do not call raw fetch, duplicate generated cache keys, or keep credentials/tokens in query state.
- Do not move route guards, redirects, or route-search parsing into presentation components.
- Do not change backend error codes without updating hook mappings and French locale keys.
