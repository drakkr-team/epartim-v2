import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@workspace/ui-react/components/button";

import { UserForm } from "#/features/users/components/user-form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(admin)/users/$id/")({ component: UserPage });

function UserPage() {
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const userQuery = useQuery(api.viewUser.queryOptions({ params: { id } }));
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: api.viewUser.pathKey() });
		queryClient.invalidateQueries({ queryKey: api.listUsers.pathKey() });
	};
	const resend = useMutation(api.resendInvitation.mutationOptions({ onSuccess: invalidate }));
	const cancel = useMutation(api.cancelInvitation.mutationOptions({ onSuccess: invalidate }));
	const disable = useMutation(api.disableUser.mutationOptions({ onSuccess: invalidate }));
	const reactivate = useMutation(api.reactivateUser.mutationOptions({ onSuccess: invalidate }));
	const user = userQuery.data;

	if (userQuery.isLoading) return <p className="text-neutral-11">Chargement…</p>;
	if (!user) return <p className="text-neutral-11">Utilisateur introuvable.</p>;

	return (
		<section className="space-y-8">
			<div>
				<Link className="text-neutral-11 text-sm hover:underline" to="/users">
					← Utilisateurs
				</Link>
				<h1 className="mt-3 font-bold text-4xl text-primary-12 tracking-tight">
					{user.firstName} {user.lastName}
				</h1>
				<p className="mt-1 text-neutral-11">{user.email}</p>
			</div>

			<div className="flex flex-wrap gap-3">
				{user.status === "invited" && (
					<>
						<Button onClick={() => resend.mutate({ params: { id } })}>Renvoyer l’invitation</Button>
						<Button onClick={() => cancel.mutate({ params: { id } })} variant="destructive">
							Annuler l’invitation
						</Button>
					</>
				)}
				{user.status === "active" && (
					<Button onClick={() => disable.mutate({ params: { id } })} variant="destructive">
						Désactiver
					</Button>
				)}
				{user.status === "disabled" && (
					<Button onClick={() => reactivate.mutate({ params: { id } })} variant="primary">
						Réactiver
					</Button>
				)}
			</div>

			<div>
				<h2 className="mb-4 font-bold text-2xl text-primary-12">Informations utilisateur</h2>
				<UserForm user={user} />
			</div>
		</section>
	);
}
