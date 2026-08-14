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
		<main className="grid min-h-svh place-items-center bg-brand-shell px-6 py-10">
			<div className="w-full max-w-96">
				<div className="mb-8 text-center">
					<span className="font-extrabold text-[28px] text-brand-navy tracking-[-0.04em]">
						epartim<span className="text-brand-gold">.</span>
					</span>
				</div>
				<div className="rounded-2xl border border-brand-line bg-brand-surface p-8 shadow-lg shadow-neutral-5/50">
					<Outlet />
				</div>
			</div>
		</main>
	);
}
