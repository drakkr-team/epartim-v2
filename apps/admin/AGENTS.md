# Admin App

Dedicated TanStack Start application for internal administration.

## Scope

- Manage users, invitations, roles, firms, and networks.
- Expose operational admin workflows only after API domain services exist.
- Reuse `@workspace/ui-react`, `@workspace/ui-theme`, Tuyau, and Adonis session auth.

## Conventions

- Keep business rules in `apps/api`; this app calls explicit admin API actions.
- Do not write CRUD screens that edit sensitive fields directly.
- Protect admin screens in the router and enforce authorization again in the API.
- Keep the admin visually identical to the web app: use the shared theme tokens, fonts, theme mode, sidebar conventions, and shared UI components. Content uses the shared default sans-serif font (Montserrat); only use alternate shared fonts when the equivalent web component does. Do not create admin-specific colors or typography.
- Use feature folders under `src/features`.
- Keep generated files untouched: `src/routeTree.gen.ts`, `src/libs/i18n/build/**`.
