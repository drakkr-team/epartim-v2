import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { isAuthenticated } from "#/utils/auth";

export const Route = createFileRoute("/(guest)/(auth)")({
	beforeLoad: async ({ context }) => {
		if (await isAuthenticated(context.queryClient)) {
			throw redirect({ to: "/" });
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
