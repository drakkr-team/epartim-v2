# Admin account profile

## SURFACE

- Mount: `/admin/account-management/profile`.
- Route name: `admin.account_management.profile`.
- The only route is authenticated `GET /`.
- The route uses the `admin` guard and the generated profile controller.

## WHERE TO LOOK

| Task | Location |
|---|---|
| Route and guard | `routes.ts` |
| Authorization | `policies/view.policy.ts` |
| Response handling | `controllers/view.controller.ts` |
| Serialized fields | `#presenters/admin.presenter` |

## CONTROLLER CONTRACT

- Authorize `ViewProfilePolicy.handle` before reading the authenticated model.
- Treat `auth.user` as `Admin`; this domain does not use the client `User` model.
- Serialize through `AdminPresenter.toJSON()`.
- Response fields are `id`, `name`, `email`, `activatedAt`, `createdAt`, and `updatedAt`.
- Timestamp values are converted to JavaScript `Date` values by the presenter.

## VERIFICATION

- Keep the colocated controller and policy specs aligned with the GET-only contract.
- Route changes also require a matching Yaak request and regenerated Tuyau registry.

## ANTI-PATTERNS

- Do not describe or implement update/delete behavior in this module without adding routes, policies, validators, and specs.
- Do not use `UserPresenter`, client profile services, relation loading, or client notification jobs.
- Do not return the raw Admin model or bypass the profile policy.
