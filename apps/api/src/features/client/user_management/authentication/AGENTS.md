# apps/api/src/features/user_management/authentication KNOWLEDGE BASE

## OVERVIEW

Session authentication feature for login/logout. Custom auth, guest, and silent auth middleware live in `apps/api/src/middlewares` and are registered from `start/kernel.ts`.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Routes | `routes.ts` | `/user_management/authentication/login` guest-only; `/user_management/authentication/logout` authenticated. |
| Login controller | `controllers/login.controller.ts` | Validates credentials then delegates to service. |
| Logout controller | `controllers/logout.controller.ts` | Delegates to service. |
| Session service | `services/auth.service.ts` | Owns `auth.use("web").attempt/logout`. |
| Middleware | `apps/api/src/middlewares/{auth,guest,silent_auth}_middleware.ts` | Registered in `start/kernel.ts`. |
| Exceptions | `exceptions/*.ts` | Auth error codes consumed by clients. |

## CONVENTIONS

- Controllers stay thin and call `AuthService`.
- Login payload uses `UserCredentialsSchema` from `#validators/user.validator`.
- `guest_middleware.ts` throws `GuestOnlyException` when an authenticated user hits guest routes.
- `silent_auth_middleware.ts` runs globally in router middleware to populate auth state without forcing auth.

## ANTI-PATTERNS

- Do not duplicate session login/logout logic in controllers.
- Do not remove `silent_auth_middleware` from router middleware without checking guest/auth route behavior.
- Do not change exception codes without updating web error-message mappings.

## NOTES

- Web login/logout hooks consume the `userManagement.authentication.login` and `userManagement.authentication.logout` Tuyau paths.
- Auth and guest middleware are registered from `apps/api/start/kernel.ts`.
