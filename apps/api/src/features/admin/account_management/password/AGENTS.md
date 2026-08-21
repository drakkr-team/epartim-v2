# Admin password behavior

## ROUTES

- Base path: `/admin/account-management/password`.
- Route name prefix: `admin.account_management.password`.
- `POST /forgot` is guest-only.
- `POST /forgot` uses `authAttempt` identifier `email`.
- Forgot throttle scope: `password-forgot`.
- `POST /reset` is guest-only.
- `POST /reset` uses `authAttempt` identifier `token`.
- Reset throttle scope: `password-reset`.
- `PUT /` requires the `client` auth guard.
- Forgot policy explicitly allows guests.
- Reset policy explicitly allows guests.
- Update policy authorizes its handler unconditionally.

## VALIDATION

- Forgot input accepts one email field.
- Forgot email input must be syntactically valid.
- Reset input requires a token string.
- Reset input requires `newPassword` through `UserPasswordValidator`.
- Update input requires a `currentPassword` string.
- Update `newPassword` uses `UserPasswordValidator`.

## SERVICE

- Forgot looks up the user by email.
- Missing forgot users return no content.
- Non-active forgot users return no content.
- Only active users receive reset instructions.
- Reset OTPs are alphanumeric.
- Reset OTPs have length 32.
- Reset OTP lifetime is 900 seconds.
- Reset OTP data contains the numeric user ID.
- Reset links target `/reset-password` on `FRONTEND_URL`.
- Reset links carry the OTP as query parameter `token`.
- Reset verifies the OTP before loading the user.
- Invalid, expired, or consumed OTPs yield `E_INVALID_TOKEN`.
- A verified OTP for a missing user yields `E_INVALID_TOKEN`.
- Successful reset persists the new password.
- Password update verifies the current password first.
- Wrong current passwords yield `E_INVALID_CREDENTIALS`.
- Successful authenticated updates persist the new password.
- Successful authenticated updates log out the `client` session.

## MAIL

- Successful reset and update dispatch changed-password mail.
- Forgot dispatches reset-instruction mail.
- Both mail jobs run on the `emails` queue.
- Reset mail payload contains `user` and `resetPasswordUrl`.
- Changed-password payload contains `user` and `loginUrl`.
- Login links target `/login` on `FRONTEND_URL`.
- Reset mail subject: `Réinitialisation de votre mot de passe`.
- Changed-password subject: `Votre mot de passe a été modifié`.
- Both mails address the affected user email.
- Reset mail renders `reset_password_instruction.html`.
- Changed-password mail renders `password_changed_notification.html`.

## ANTI-PATTERNS

- Do not reveal whether a forgot-password email belongs to an active user.
- Do not perform mail transport work in controllers or services; dispatch queue jobs.
- Preserve the typoed `password_changed_notifiction.mail.ts` filename.
