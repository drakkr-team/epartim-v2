# Client profile API

## Scope

- This feature owns client profile view, update, and deletion flows.
- `routes.ts` registers the profile HTTP surface.
- Controllers orchestrate requests; services own profile workflow work.
- Policies guard view, update, and delete independently.
- Keep changes within this feature unless a shared contract must change.

## View

- `view.controller.ts` handles profile retrieval.
- Run `view.policy.ts` before returning profile data.
- Read the authenticated user from `auth.user!`.
- Return the user through `UserPresenter`.

## Update

- `update.controller.ts` handles profile mutations.
- Run `update.policy.ts` before changing profile data.
- Validate with shared `UpdateUserSchema`.
- Merge validated values into the authenticated user and save.
- Return the updated user through `UserPresenter`.

## Delete

- `delete.controller.ts` handles account/profile deletion.
- Run `delete.policy.ts` before starting deletion.
- Delegate the deletion workflow to `ProfileService`.
- Do not send account-deletion email in the controller.
- Return `null` after the workflow completes.

## Serialization

- Treat serialized profile fields as a public API contract.
- Use `UserPresenter` for view and update responses.
- Never return raw persistence models when presenter shape matters.
- Exclude credentials, tokens, secrets, and internal-only fields.
- Keep field names stable across view and update responses.
- Preserve the project's existing date serialization convention.
- Avoid response-only transformations in `ProfileService`.

## Service workflow

- `ProfileService` owns profile persistence and workflow sequencing.
- The service resolves the current user from injected `HttpContext`.
- Delete the user before dispatching the notification job.
- Dispatch the notification before logging out the `client` guard.
- Keep authorization in policies.

## Queue and mail

- `send_account_deleted_notification.job.ts` owns queued deletion notification delivery.
- Enqueue the job only after deletion reaches its safe completion point.
- Keep the HTTP request free of mail transport work.
- Existing job payload is the deleted `User` model.
- `account_deleted_notification.mail.ts` defines the notification message.
- `account_deleted_notification.html.edge` renders its HTML body.
- Keep recipient data, subject data, and template data aligned.

## ANTI-PATTERNS

- Do not return raw users, delete directly in controllers, or reorder delete/dispatch/logout.
- Do not move mail transport work out of the queue job.
