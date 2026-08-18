import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "#/components/layout/admin-shell";
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
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}
