# Admin management profile

## Surface

- Mount: `admin/account-management/profile`.
- Group requires the `client` auth guard.
- `GET /` views the authenticated admin user.
- `PUT /` updates the authenticated admin user.
- `DELETE /` permanently deletes the authenticated admin user.
- Parent account-management routes import this feature route module.
- Route names use `admin.account_management.profile`.

## Controllers

- Every handler authorizes its matching Bouncer policy first.
- Current user comes from `auth.user!`.
- View delegates response shaping to `UserPresenter`.
- Update validates with `UpdateUserSchema` through Vine.
- Update merges the validated payload, then saves the user.
- Update also returns `UserPresenter.toJSON(user)`.
- Delete delegates all mutation and side effects to `ProfileService`.
- Delete returns `null` after the service completes.
- Policies currently allow every authenticated caller.

## Presenter contract

- `UserPresenter` is async because it loads relations.
- It loads roles for role-code output.
- It loads the firm and that firm's network.
- It separately loads the user's direct network.
- Direct network takes precedence over firm network.
- Response includes identity and contact fields.
- Response includes user status.
- Roles are emitted as role-code strings.
- Firm is `{ id, name }` or `null`.
- Network is `{ id, name }` or `null`.
- Dates are converted to JavaScript `Date` values.
- Do not expose the raw model when this contract is required.

## Deletion workflow

- Keep deletion orchestration in `ProfileService.delete()`.
- Service resolves the current user from injected `HttpContext`.
- `user.delete()` runs before notification dispatch.
- Deletion is permanent; this model declares no soft-delete column.
- Dispatch `SendAccountDeletedNotification` after deletion.
- Dispatch payload contains the deleted user model.
- Log out the `client` guard after dispatching.
- Do not move mail dispatch or logout into the controller.
- Do not reverse deletion, dispatch, and logout ordering.

## Notification

- Job runs on the `emails` queue.
- Job sends `AccountDeletedNotificationMail`.
- Mail recipient is the deleted user's email.
- Subject states that the account was permanently deleted.
- Template is the feature-local Edge/MJML notification view.
- Template addresses the user by name.

## ANTI-PATTERNS

- Keep auth guard, route prefix, and route names aligned.
- Preserve presenter use for view and update responses.
- Preserve policy authorization before each operation.
- Reuse `UpdateUserSchema`; do not duplicate its payload rules here.
