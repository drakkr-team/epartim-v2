import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Breadcrumb } from "#/components/app/breadcrumb";
import { Sidebar } from "#/components/app/sidebar";
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
		<div className="flex min-h-svh bg-secondary-2">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<Breadcrumb />
				<div className="p-4 pt-8 sm:p-8 lg:p-12">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
