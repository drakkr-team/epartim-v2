import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Logo } from "@workspace/ui-react/components/logo";

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
				<Logo className="mx-auto mb-8 h-16 text-secondary-9" />

				<Outlet />
			</div>
		</main>
	);
}
