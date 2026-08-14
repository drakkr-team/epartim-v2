import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "#/components/layout/admin-shell";
import { isAdministrator } from "#/utils/auth";

export const Route = createFileRoute("/(admin)")({
	beforeLoad: async ({ context }) => {
		if (!(await isAdministrator(context.queryClient))) {
			throw redirect({ href: new URL("/login", import.meta.env.VITE_APP_URL).toString() });
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
