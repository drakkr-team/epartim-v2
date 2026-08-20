import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "#/components/layout/admin-shell";

export const Route = createFileRoute("/(admin)")({
	component: Layout,
});

function Layout() {
	return (
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}
