# apps/web/src/features/user_management/password KNOWLEDGE BASE

## OVERVIEW

Guest password recovery (forgot/reset) and authenticated password update feature using TanStack Form, Tuyau mutations, and colocated French translations.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Forgot password UI | `components/forgot-form.tsx` | Uses `useForgotPasswordForm`; single email field. |
| Forgot password mutation | `hooks/use-forgot-mutation.ts` | Calls `api.userManagement.password.forgot`; navigates to `/login` on success. |
| Reset password UI | `components/reset-form.tsx` | Uses `useResetPasswordForm`; requires reset token prop. |
| Reset password mutation | `hooks/use-reset-mutation.ts` | Calls `api.userManagement.password.reset`. |
| Update password UI | `components/update-form.tsx` | Authenticated; uses `useUpdatePasswordForm`; wrapped in `Card`. |
| Update password mutation | `hooks/use-update-mutation.ts` | Calls `api.userManagement.password.update`. |
| Translations | `locales/fr.json` | Copy for all password hooks and components. |
| Forgot route | `../../../routes/(guest)/(auth)/forgot-password/page.tsx` | Renders `ForgotPasswordForm`. |
| Reset route | `../../../routes/(guest)/(auth)/reset-password/page.tsx` | Renders `ResetPasswordForm`. |
| Update route | `../../../routes/(private)/profile/security/page.tsx` | Renders `UpdatePasswordForm`. |

## CONVENTIONS

- Forgot/reset forms are guest-only; update form requires auth and lives inside the profile security tab.
- Form validation uses `zod` schemas with `revalidateLogic()`.
- Reset form validates password confirmation via `z.refine()` for mismatch errors.
- Mutations use `toastifyTuyauError` with explicit mappings per hook (network, validation, guest-only, too-many-requests, invalid-token, unexpected).
- Success toasts navigate appropriately (forgot/reset → `/login`).
- Hook translation namespaces include the full feature path and hook name.

## ANTI-PATTERNS

- Do not hardcode API paths; use `api.userManagement.password.*.mutationOptions()`.
- Do not bypass `useAppForm`; field components are registered centrally.
- Do not change backend error codes without updating `locales/fr.json` and hook error mappings.

## NOTES

- Reset password requires a valid token from the email link; the route passes it to the form.
- Update password uses `PasswordField` inputs; forgot uses `TextField` with `type="email"`.
