import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@workspace/ui-react/components/button";
import { Input } from "@workspace/ui-react/components/input";

export const Route = createFileRoute("/(guest)/login/")({
	component: LoginPage,
});

//TODO: statique, à terminer

function LoginPage() {
	return (
		<main className="grid min-h-svh place-items-center bg-secondary-2 px-4 py-8">
			<section className="w-full max-w-md rounded-xl bg-neutral-1 p-6 shadow-sm sm:p-8">
				<header className="mb-6">
					<p className="font-semibold text-secondary-11 text-xs uppercase tracking-[0.18em]">
						Epartim administration
					</p>
					<h1 className="mt-1.5 font-bold text-2xl text-primary-12">Connexion</h1>
					<p className="mt-1.5 text-neutral-11 text-sm">Cet écran sera branché ultérieurement.</p>
				</header>

				<form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
					<label className="grid gap-1.5 font-medium text-neutral-12 text-sm" htmlFor="email">
						Adresse e-mail
						<Input disabled id="email" placeholder="admin@epartim.fr" type="email" />
					</label>
					<label className="grid gap-1.5 font-medium text-neutral-12 text-sm" htmlFor="password">
						Mot de passe
						<Input disabled id="password" placeholder="••••••••" type="password" />
					</label>
					<Button disabled type="submit" variant="primary">
						Se connecter
					</Button>
				</form>
			</section>
		</main>
	);
}
