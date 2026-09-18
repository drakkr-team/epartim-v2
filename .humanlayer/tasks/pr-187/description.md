## Why the change

Administrators need a complete role-management interface so they can browse roles, inspect permissions, and safely create, update, assign, or delete roles according to their own authorization level.

## Special things to note

- Read access remains implicit for every resource, while create, update, and delete permissions are explicitly selectable.
- The super-admin role is hidden from non-super-admins and cannot be updated or deleted; assigned roles also cannot be deleted.
- The existing administrator forms and detail view now select and display roles from the same typed API surface.

## Change outline

Role ownership is split between protected routes, reusable role UI, typed query/mutation hooks, and the API safeguards that determine available actions.

```diff
 apps/
 ├── admin/src/
+│   ├── routes/(protected)/roles/       # list, create, view, and edit screens
+│   ├── features/roles/components/      # forms, permission matrices, actions, deletion
+│   └── features/roles/hooks/           # table state and CRUD mutations
 │   └── features/admins/                # role selection and linked role details
 └── api/src/
+    ├── constants/role.ts               # shared authorization resources and actions
     └── features/admin/roles/           # role-aware list, update, and delete safeguards
```

The admin application now exposes the complete role workflow and reuses it when managing administrators.

```diff
 <AdminShell>
+  <RolesListRoute>
+    <DataTable search sorting pagination>
+      <RoleActions view edit delete>
+  <CreateRoleRoute>
+    <RoleForm>
+      <AuthorizationMatrix selectable>
+  <RoleDetailRoute>
+    <AuthorizationMatrix read-only>
+    <RoleActions edit delete>
+  <EditRoleRoute>
+    <RoleForm>
   <AdminForm>
+    <RoleCombobox paginated-search>
   <AdminDetail>
+    <RoleLink>
```

Role permissions and protected-role rules now flow from the API into the action metadata consumed by the interface.

```diff
 list/view role
+  load the current administrator role
+  hide the super-admin role from non-super-admins
+  evaluate update/delete policies for each target role
+  return canCreate/canUpdate/canDelete metadata

 create/update role
+  validate permissions against the shared authorization options
+  invalidate role queries and return to the role detail screen

 delete role
+  reject the super-admin role
+  reject roles assigned to administrators
+  delete and refresh the role list
```
