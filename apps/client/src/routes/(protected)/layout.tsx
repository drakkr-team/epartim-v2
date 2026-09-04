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
		<div className="flex min-h-svh text-neutral-12">
			<Sidebar />
			<main className="ml-64 min-w-0 flex-1">
				<div className="container mx-auto">
					<Breadcrumb />
					<div className="p-4 pt-8 sm:p-8 sm:pt-12">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
