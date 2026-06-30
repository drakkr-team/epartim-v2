import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<main className="grid min-h-screen place-items-center p-6">
			<section className="w-full max-w-sm space-y-4">
				<div>
					<h1 className="font-semibold text-2xl text-neutral-12">Connexion admin</h1>
					<p className="mt-2 text-neutral-11">
						L'ecran de connexion sera branche sur la session Adonis existante.
					</p>
				</div>
			</section>
		</main>
	);
}
