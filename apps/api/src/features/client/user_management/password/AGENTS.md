# apps/api/src/features/user_management/password KNOWLEDGE BASE

## OVERVIEW

Password recovery and authenticated password update feature using user tokens, queued mail jobs, and Edge/MJML mail templates.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Routes | `routes.ts` | Guest `POST /user_management/password/forgot`, `POST /user_management/password/reset`; auth `PUT /user_management/password`. |
| Controllers | `controllers/*.controller.ts` | Forgot/reset/update handlers. |
| Workflow service | `services/password.service.ts` | Token verification, password updates, mail sending. |
| Token service | `../../../services/user_token.service.ts` | Generate/verify/revoke token lifecycle. |
| Jobs | `jobs/*.job.ts` | Dispatch reset/changed emails on queue `emails`. |
| Mail classes | `mails/*.mail.ts` | Build reset/changed emails. |
| Mail templates | `mails/*.html.edge` | Edge/MJML templates. |

## CONVENTIONS

- Forgot/reset routes are guest-only under `/user_management/password`.
- Update password route is authenticated under `/user_management/password`.
- Token type comes from `UserTokenType` in `src/models/user_token.ts`.
- Password schemas come from `#validators/user.validator`.

## ANTI-PATTERNS

- Do not casually rename `password_changed_notifiction.mail.ts`; current code references the typoed filename.
- Do not create password tokens without revoking existing tokens of the same type.
- Do not send password mail from controllers; keep mail orchestration in `PasswordService`.

## NOTES

- Reset links depend on app URL/env configuration read by `PasswordService`.
- Mail template filenames and mail class filenames are intentionally colocated for this feature.

# Client password flow

- Scope: client user password recovery and authenticated password changes.
- Keep forgot, reset, and update paths deliberately separate.
- Forgot emits the reset-instruction job only for an eligible existing user.
- A successful forgot response remains generic in every case.
- Reset consumes a one-time reset token plus the replacement password.
- Reject absent, malformed, expired, or already-consumed reset tokens.
- Consume the reset token atomically with the password update.
- Never accept a reset token as an authentication session.
- Update requires the authenticated user and the current password.
- Update rejects an incorrect current password before changing credentials.
- Update never reuses the recovery-token pathway.
- Password policy is enforced at every password-writing boundary.
- Keep policy errors field-specific and stable for API clients.
- Do not duplicate policy rules in controllers, jobs, or mailers.
- Policy changes require unit coverage for accepted and rejected values.
- Hash passwords through the established user/authentication mechanism.
- Never log plaintext passwords, password hashes, or reset token values.
- Generate reset tokens with the existing cryptographic token facility.
- Preserve the configured reset-token expiry; do not hard-code a second TTL.
- Invalidate prior usable reset tokens when the domain service requires it.
- Queue reset instructions; controllers must not send mail inline.
- Queue password-changed notifications after a committed password change.
- Jobs receive minimal identifiers or established payloads, never plaintext secrets.
- Keep queue retries safe: repeated execution must not create a new secret.
- Do not make notification delivery part of password-change success semantics.
- Reset mail uses the client reset URL construction already owned by the mailer.
- Mail templates receive only data required to render the instruction.
- Do not put password values, hashes, or durable credentials in mail payloads.
- Treat reset links as sensitive; avoid diagnostic logging of full URLs.
- Password-changed mail is informational and contains no reset capability.
- Mail unit tests assert recipient, subject, template, and machine-consumed data.
- Forgot controller tests cover generic responses for known and unknown addresses.
- Forgot tests assert queueing only when the applicable user path is reached.
- Reset controller tests cover valid, expired, invalid, and reused token paths.
- Reset tests assert password persistence and one-time token consumption together.
- Authenticated update tests cover valid and invalid current-password cases.
- Policy unit tests own validation edge cases; controller tests do not duplicate them.
- Job tests assert the queued mail contract, not provider internals.
- Mail tests must not pin prose-only template wording.
- E2E tests use deterministic token setup and await concrete queue/mail effects.
- Preserve existing error status and response shapes unless the API contract changes.
- Keep changes local to this feature; shared auth changes need explicit justification.
