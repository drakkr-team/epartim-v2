# Password forms and mutations

## Scope

- Runtime password UI: `apps/client/src/features/user_management/password/`.
- Guest routes: `apps/client/src/routes/(guest)/(auth)/{forgot-password,reset-password}`.
- Authenticated update route: `apps/client/src/routes/(private)/profile/security/page.tsx`.
- Keep forgot, reset, and authenticated update flows separate.
- Reuse only existing local UI, form, schema, and API primitives.

## Forgot-password form

- Collect one email address.
- Use the feature's existing form hook and validation schema.
- Submit through the feature mutation hook.
- Keep field errors adjacent to the email input.
- Disable duplicate submit while the mutation is pending.
- Show transport failures through the local form-error pattern.
- Do not disclose whether an account exists.
- On success, show the neutral sent-email confirmation.
- Do not navigate to reset without a recovery token.

## Forgot-password mutation

- Keep the API call in the password feature mutation layer.
- Send the schema-validated email payload.
- Reuse the established API client.
- Do not call `fetch` from the form component.
- Keep pending, error, and success state mutation-owned.
- Map server validation errors through the shared adapter.
- Treat success as a generic recovery-request acknowledgement.
- Do not log email addresses or recovery responses.

## Reset-password form

- Read the recovery token via the route's existing search-param contract.
- Keep token parsing at the route or feature boundary.
- Render the form only with a usable token.
- Collect the new password and confirmation when required locally.
- Use the existing password validation schema.
- Keep confirmation mismatch as a field-level error.
- Submit token and validated password through the mutation hook.
- Disable submission while pending.
- Surface invalid or expired-token failures clearly.
- On success, route to the established sign-in destination.
- Do not retain the recovery token after a successful reset.

## Reset-password mutation

- Keep reset requests in the password feature mutation module.
- Use the established API client and endpoint contract.
- Preserve server semantics for invalid and expired tokens.
- Do not retry token-consuming requests automatically.
- Navigate from the success handler, never transport code.

## Update-password form

- Render in the authenticated user-management surface.
- Keep it distinct from recovery reset UI.
- Collect current password when the endpoint requires it.
- Collect new password and confirmation per the local schema.
- Keep validation errors beside their fields.
- Disable the submit action while pending.
- Clear sensitive fields only after confirmed success.
- Show standard feature success feedback.

## ANTI-PATTERNS

- Do not bypass `useAppForm` or generated Tuyau mutation options.
- Do not change backend error codes without updating hook mappings and `locales/fr.json`.
- Do not use timing delays to sequence successful reset navigation.
