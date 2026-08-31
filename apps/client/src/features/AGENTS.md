# Client features

- `account_management/authentication` owns login and logout hooks and UI.
- `account_management/password` owns forgot, reset and password update flows.
- `account_management/profile` owns profile update and deletion flows.

Keep components, hooks and source translations under their domain feature. Route files remain in `src/routes` and compose those features.

Use `#/` imports, the typed client from `#/libs/tuyau` and shared UI primitives. Do not recreate invitation, role, firm, network or admin workflows without an explicit requirement.
