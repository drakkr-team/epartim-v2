# Admin API features

## OVERVIEW

Admin HTTP behavior is split between the signed-in administrator's own account and CRUD
operations over administrator records. `routes.ts` imports both domains.

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Login, logout, password, profile | `account_management` | Current administrator lifecycle |
| Administrator CRUD | `admins` | List/create/view/update/delete other admins |
| Route composition | `routes.ts` | Imported by `src/features/admin/routes.ts` |
| Response shape | `#presenters/admin.presenter` | Stable admin fields and timestamps |
| Validation | `#validators/admin.validator` | Shared create/update payload schemas |

## CONVENTIONS

- All protected routes use the `admin` guard; guest login/reset routes use the same guard.
- Account routes use `admin.account_management.*`; CRUD routes use `admin.admins.*`.
- Controllers authorize with their matching Bouncer policy before reading or mutating records.
- CRUD controllers return `AdminPresenter`; list responses also use `PaginationPresenter`.
- Keep list filtering/sorting in `admins/services/list.service.ts`, not in the controller.
- Create assigns a random initial password; activation/recovery belongs to account-management.
- Delete policy forbids deleting the currently authenticated administrator.

## ANTI-PATTERNS

- Do not apply the `client` guard to admin routes.
- Do not merge account-management and administrator CRUD into one route namespace.
- Do not return raw Admin models or duplicate presenter/validator shapes in controllers.
- Do not bypass policy checks because the route already has auth middleware.
