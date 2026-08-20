import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "#/utils/auth";

export const Route = createFileRoute("/(guest)/(auth)")({
	beforeLoad: async ({ context }) => {
		const user = await getCurrentUser(context.queryClient);
		if (user) {
			throw redirect({ to: "/client-portfolio" });
		}
	},
	component: Layout,
});

function Layout() {
	return (
		<main className="grid min-h-svh place-items-center bg-secondary-2 px-6 py-10">
			<div className="w-full max-w-96">
				<div className="mb-8 text-center">
					<span className="font-extrabold text-[28px] text-primary-12 tracking-[-0.04em]">
						epartim<span className="text-secondary-9">.</span>
					</span>
				</div>
				<div className="rounded-2xl border border-neutral-4 bg-neutral-1 p-8 shadow-lg shadow-neutral-5/50">
					<Outlet />
				</div>
			</div>
		</main>
	);
}
