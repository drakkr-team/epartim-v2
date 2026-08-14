import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "#/utils/auth";

export const Route = createFileRoute("/(guest)/(auth)")({
	beforeLoad: async ({ context }) => {
		const user = await getCurrentUser(context.queryClient);
		if (user?.roles.includes("administrator") && import.meta.env.VITE_ADMIN_URL) {
			throw redirect({ href: import.meta.env.VITE_ADMIN_URL });
		}
		if (user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Layout,
});

function Layout() {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center p-4">
			<div className="grid w-full max-w-96">
				<Outlet />
			</div>
		</main>
	);
}
