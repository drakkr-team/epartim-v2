import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "#/components/app/sidebar";
import { isAuthenticated } from "#/utils/auth";

export const Route = createFileRoute("/(private)")({
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
		<div className="ml-72 p-4 pt-8">
			<Sidebar />
			<Outlet />
		</div>
	);
}
