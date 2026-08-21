# Admin account management

## OVERVIEW

This domain owns the current administrator's session, password recovery, and profile view.
`routes.ts` imports all three child route modules under `/admin/account-management`.

## STRUCTURE

```text
account_management/
├── authentication/       # guest login; authenticated logout
├── password/             # guest forgot/reset workflow
└── profile/              # authenticated profile view only
```

## ROUTES

| Module | Namespace | Access |
|---|---|---|
| Authentication | `admin.account_management.authentication` | Admin guest login; admin-auth logout |
| Password | `admin.account_management.password` | Admin guest forgot/reset; brute-force limited |
| Profile | `admin.account_management.profile` | Admin-authenticated GET |

## CONVENTIONS

- Every route uses the `admin` guard, never the client guard.
- Login, forgot, and reset retain brute-force limiting and non-disclosure behavior.
- Controllers authorize through Bouncer policies before domain work.
- Password reset keeps token creation/consumption in `OtpService`.
- Password email jobs run on the `emails` queue and remain feature-local.
- Profile returns `AdminPresenter`; it does not expose the persistence model.
- Keep controllers, policies, services, jobs, mails, templates, and specs in their child module.

## ANTI-PATTERNS

- Do not document or add profile update/delete or authenticated password update without routes and tests.
- Do not share client user-management guards, models, policies, or mail assets.
- Do not send email inline or bypass policies because middleware already authenticated the request.
