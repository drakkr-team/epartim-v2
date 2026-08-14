import { createFileRoute, Link } from "@tanstack/react-router";

import { UserForm } from "#/features/users/components/user-form";

export const Route = createFileRoute("/(admin)/users/new/")({ component: NewUserPage });

function NewUserPage() {
	return (
		<section className="space-y-6">
			<div>
				<Link className="text-neutral-11 text-sm hover:underline" to="/users">
					← Utilisateurs
				</Link>
				<h1 className="mt-3 font-bold text-4xl text-primary-12 tracking-tight">
					Inviter un utilisateur
				</h1>
				<p className="mt-1 text-neutral-11">
					La fiche est créée et le lien d’activation est envoyé immédiatement.
				</p>
			</div>
			<UserForm />
		</section>
	);
}
