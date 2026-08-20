# Admin Users

## Access boundary

- This feature administers staff users, not client self-service accounts.
- The route prefix is `/admin`.
- Invitation acceptance is `POST /admin/invitations/accept`.
- Acceptance is guest-only.
- Every `/admin/users` endpoint requires the `client` guard.
- Every `/admin/users` endpoint also requires `admin()`.
- Do not treat the URL prefix as authorization.
- Use `auth.user!` as the acting administrator after middleware authorization.
- Keep acceptance separate from authenticated administrative operations.

## HTTP surface

- `GET /users/options`: assignable roles, firms, and networks.
- `GET /users`: list, with optional status, role, firmId, and networkId filters.
- `POST /users`: create an invited user.
- `GET /users/:id`: view user plus latest invitation.
- `PUT /users/:id`: update identity and assignment.
- `POST /users/:id/invitations/resend`: replace and send an invitation.
- `POST /users/:id/invitations/cancel`: revoke the pending invitation.
- `POST /users/:id/disable`: disable an active user.
- `POST /users/:id/reactivate`: reactivate a disabled user.
- Preserve route names under `admin.*` for client and test lookups.
- Keep Yaak requests aligned with route method, path, and guest/admin auth state.
- Check `.yaak` when changing an exposed endpoint; do not edit it for internal-only changes.

## Ownership

- Controllers validate, load targets, delegate, and present responses.
- `AdminUserService` owns assignment rules and administrative state transitions.
- `InvitationActivationService` owns token verification and activation transactionality.
- Validators own request shape; services own cross-record business invariants.
- Present `User` through `UserPresenter`.
- Present invitation metadata through `UserInvitationPresenter`.
- Return `null` for successful cancel, disable, and reactivate actions.
- Do not return invitation token hashes or plaintext tokens.

## Invitation lifecycle

- Creation normalizes email and starts the user at `invited`.
- Creation rejects an existing email.
- A new invitation revokes every unaccepted, unrevoked predecessor.
- Store only the SHA-256 token hash; retain plaintext token only for dispatch.
- Invitations expire seven days after sending.
- Dispatch the account-invitation job only after transaction commit.
- Resend is valid only for invited users.
- Cancellation is valid only for invited users.
- Acceptance locks the invitation, validates token/revocation/expiry, sets password and `active`, then logs in.
- Never activate an invitation outside its database transaction.

## Assignments and states

- Administrator and commercial roles have no firm or network assignment.
- Network managers require a network and no firm.
- Distributors require a firm; an optional network must match that firm's network.
- A user cannot alter their own role or assignment.
- Disabling requires an active target and must not disable the actor.
- The final active administrator cannot be disabled.
- Disable and reactivate increment `authVersion` to invalidate prior sessions.

## ANTI-PATTERNS

- Do not bypass `AdminUserService` for role, assignment, invitation, or status transitions.
- Do not expose invitation tokens or token hashes in presenters or responses.
- Do not change route methods, paths, or auth requirements without updating Yaak.
