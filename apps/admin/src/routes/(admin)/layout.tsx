import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "#/components/app/sidebar";
import { getCurrentAdmin } from "#/utils/auth";

export const Route = createFileRoute("/(admin)")({
	beforeLoad: async ({ context }) => {
		if (!(await getCurrentAdmin(context.queryClient))) {
			throw redirect({ to: "/login" });
		}
	},
	component: Layout,
});

function Layout() {
	return (
		<div className="flex min-h-svh bg-brand-shell text-neutral-12">
			<Sidebar />
			<main className="min-w-0 flex-1 p-4 pt-8 sm:p-8 lg:p-12">
				<Outlet />
			</main>
		</div>
	);
}
