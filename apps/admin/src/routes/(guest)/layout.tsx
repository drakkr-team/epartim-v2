import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { isAuthenticated } from "#/utils/auth";

export const Route = createFileRoute("/(guest)")({
	beforeLoad: async ({ context }) => {
		if (await isAuthenticated(context.queryClient)) {
			throw redirect({ to: "/" });
		}
	},
	component: Layout,
});

function Layout() {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center">
			<div className="grid w-full max-w-96">
				<h3 className="mb-8 text-center font-bold text-2xl text-secondary-12">
					epartim<span className="text-primary-9">.</span>
				</h3>

				<Outlet />
			</div>
		</main>
	);
}
