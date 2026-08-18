import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "#/features/authentication/components/login-form";
import { getCurrentAdmin } from "#/utils/auth";

export const Route = createFileRoute("/login/")({
	beforeLoad: async ({ context }) => {
		if (await getCurrentAdmin(context.queryClient)) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<main className="grid min-h-svh place-items-center bg-brand-shell px-6 py-10">
			<div className="w-full max-w-96">
				<div className="mb-8 text-center">
					<span className="font-extrabold text-[28px] text-brand-navy tracking-[-0.04em]">
						epartim<span className="text-brand-gold">.</span>
					</span>
				</div>
				<div className="rounded-2xl border border-brand-line bg-brand-surface p-8 shadow-lg shadow-neutral-5/50">
					<header className="mb-6">
						<p className="font-semibold text-[10.5px] text-brand-gold-strong uppercase tracking-[0.18em]">
							Administration
						</p>
						<h1 className="mt-1.5 font-bold text-[26px] text-brand-navy leading-tight">
							Connexion
						</h1>
						<p className="mt-1.5 text-[13px] text-brand-ink-muted leading-snug">
							Connectez-vous avec votre compte d’administration.
						</p>
					</header>
					<LoginForm />
				</div>
			</div>
		</main>
	);
}
