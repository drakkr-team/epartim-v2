import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@workspace/ui-react/components/button";
import { Input } from "@workspace/ui-react/components/input";
import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";

type EditableUser = {
	id?: number;
	email: string;
	firstName: string | null;
	lastName: string | null;
	mobilePhone: string | null;
	roles: string[];
	firm: { id: number } | null;
	network: { id: number } | null;
};

export function UserForm({ user }: { user?: EditableUser }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: options } = useQuery(api.userOptions.queryOptions());
	const [email, setEmail] = useState(user?.email || "");
	const [firstName, setFirstName] = useState(user?.firstName || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [mobilePhone, setMobilePhone] = useState(user?.mobilePhone || "");
	const [roleCode, setRoleCode] = useState(user?.roles[0] || "distributor");
	const [firmId, setFirmId] = useState(user?.firm?.id ? String(user.firm.id) : "");
	const [networkId, setNetworkId] = useState(user?.network?.id ? String(user.network.id) : "");

	useEffect(() => {
		if (!user) return;
		setFirstName(user.firstName || "");
		setLastName(user.lastName || "");
		setMobilePhone(user.mobilePhone || "");
		setRoleCode(user.roles[0] || "distributor");
		setFirmId(user.firm?.id ? String(user.firm.id) : "");
		setNetworkId(user.network?.id ? String(user.network.id) : "");
	}, [user]);

	const invalidateUsers = () =>
		queryClient.invalidateQueries({ queryKey: api.listUsers.pathKey() });
	const create = useMutation(
		api.createUser.mutationOptions({
			onSuccess: (createdUser) => {
				invalidateUsers();
				toast.success("Invitation envoyée");
				navigate({ to: "/users/$id", params: { id: String(createdUser.id) } });
			},
			onError: () => toast.error("Impossible de créer cet utilisateur."),
		}),
	);
	const update = useMutation(
		api.updateUser.mutationOptions({
			onSuccess: () => {
				invalidateUsers();
				toast.success("Utilisateur mis à jour");
			},
			onError: () => toast.error("Impossible de mettre à jour cet utilisateur."),
		}),
	);

	const needsFirm = roleCode === "distributor";
	const needsNetwork = roleCode === "network_manager";
	const pending = create.isPending || update.isPending;

	return (
		<form
			className="grid max-w-2xl gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				const body = {
					firstName,
					lastName,
					mobilePhone: mobilePhone || null,
					roleCode: roleCode as "administrator" | "commercial" | "network_manager" | "distributor",
					firmId: needsFirm && firmId ? Number(firmId) : null,
					networkId: needsNetwork && networkId ? Number(networkId) : null,
				};

				if (user?.id) {
					update.mutate({ params: { id: user.id }, body });
				} else {
					create.mutate({ body: { ...body, email } });
				}
			}}
		>
			{!user && (
				<label className="grid gap-1 text-neutral-12 text-sm" htmlFor="email">
					Adresse e-mail
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</label>
			)}
			<div className="grid gap-4 sm:grid-cols-2">
				<label className="grid gap-1 text-neutral-12 text-sm" htmlFor="first-name">
					Prénom
					<Input
						id="first-name"
						value={firstName}
						onChange={(event) => setFirstName(event.target.value)}
						required
					/>
				</label>
				<label className="grid gap-1 text-neutral-12 text-sm" htmlFor="last-name">
					Nom
					<Input
						id="last-name"
						value={lastName}
						onChange={(event) => setLastName(event.target.value)}
						required
					/>
				</label>
			</div>
			<label className="grid gap-1 text-neutral-12 text-sm" htmlFor="mobile-phone">
				Téléphone mobile <span className="text-neutral-10">(facultatif)</span>
				<Input
					id="mobile-phone"
					value={mobilePhone}
					onChange={(event) => setMobilePhone(event.target.value)}
				/>
			</label>
			<label className="grid gap-1 text-neutral-12 text-sm">
				Rôle
				<select
					className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
					value={roleCode}
					onChange={(event) => {
						setRoleCode(event.target.value);
						setFirmId("");
						setNetworkId("");
					}}
				>
					{options?.roles.map((role) => (
						<option key={role.code} value={role.code}>
							{role.name}
						</option>
					))}
				</select>
			</label>
			{needsFirm && (
				<label className="grid gap-1 text-neutral-12 text-sm">
					Cabinet
					<select
						className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
						value={firmId}
						onChange={(event) => setFirmId(event.target.value)}
						required
					>
						<option value="">Sélectionner un cabinet</option>
						{options?.firms.map((firm) => (
							<option key={firm.id} value={firm.id}>
								{firm.name}
							</option>
						))}
					</select>
				</label>
			)}
			{needsNetwork && (
				<label className="grid gap-1 text-neutral-12 text-sm">
					Réseau
					<select
						className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
						value={networkId}
						onChange={(event) => setNetworkId(event.target.value)}
						required
					>
						<option value="">Sélectionner un réseau</option>
						{options?.networks.map((network) => (
							<option key={network.id} value={network.id}>
								{network.name}
							</option>
						))}
					</select>
				</label>
			)}
			<Button type="submit" variant="primary" disabled={pending || !options}>
				{user ? "Enregistrer" : "Créer et inviter"}
			</Button>
		</form>
	);
}
