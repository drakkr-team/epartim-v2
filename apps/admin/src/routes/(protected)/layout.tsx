import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "#/components/layout/admin-shell";
import { isAuthenticated } from "#/utils/auth";

export const Route = createFileRoute("/(protected)")({
	beforeLoad: async ({ context, location }) => {
		if (!(await isAuthenticated(context.queryClient))) {
			throw redirect({
				to: "/login",
				search: {
					redirectTo: location.pathname,
				},
			});
		}
	},
	component: Layout,
});

function Layout() {
	return (
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}
