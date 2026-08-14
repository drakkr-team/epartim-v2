import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@workspace/ui-react/components/button";
import { Table } from "@workspace/ui-react/components/table";

import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(admin)/users/")({ component: UsersPage });

function UsersPage() {
	const { data: users = [], isLoading } = useQuery(api.admin.listUsers.queryOptions());
	const { data: options } = useQuery(api.admin.userOptions.queryOptions());
	const [status, setStatus] = useState("");
	const [role, setRole] = useState("");
	const [firmId, setFirmId] = useState("");
	const [networkId, setNetworkId] = useState("");
	const filteredUsers = users.filter((user) => {
		return (
			(!status || user.status === status) &&
			(!role ||
				user.roles.includes(
					role as "administrator" | "commercial" | "network_manager" | "distributor",
				)) &&
			(!firmId || user.firm?.id === Number(firmId)) &&
			(!networkId || user.network?.id === Number(networkId))
		);
	});

	return (
		<section className="space-y-6">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="font-semibold text-2xl text-neutral-12">Utilisateurs</h1>
					<p className="mt-1 text-neutral-11">Gérez les comptes, rôles et invitations.</p>
				</div>
				<Button render={<Link to="/users/new" />} variant="primary">
					Inviter un utilisateur
				</Button>
			</header>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<select
					aria-label="Filtrer par statut"
					className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
					value={status}
					onChange={(event) => setStatus(event.target.value)}
				>
					<option value="">Tous les statuts</option>
					<option value="invited">Invité</option>
					<option value="active">Actif</option>
					<option value="disabled">Désactivé</option>
				</select>
				<select
					aria-label="Filtrer par rôle"
					className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
					value={role}
					onChange={(event) => setRole(event.target.value)}
				>
					<option value="">Tous les rôles</option>
					{options?.roles.map((item) => (
						<option key={item.code} value={item.code}>
							{item.name}
						</option>
					))}
				</select>
				<select
					aria-label="Filtrer par cabinet"
					className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
					value={firmId}
					onChange={(event) => setFirmId(event.target.value)}
				>
					<option value="">Tous les cabinets</option>
					{options?.firms.map((firm) => (
						<option key={firm.id} value={firm.id}>
							{firm.name}
						</option>
					))}
				</select>
				<select
					aria-label="Filtrer par réseau"
					className="h-10 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-neutral-12 text-sm"
					value={networkId}
					onChange={(event) => setNetworkId(event.target.value)}
				>
					<option value="">Tous les réseaux</option>
					{options?.networks.map((network) => (
						<option key={network.id} value={network.id}>
							{network.name}
						</option>
					))}
				</select>
			</div>

			{isLoading ? (
				<p className="text-neutral-11">Chargement…</p>
			) : (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Utilisateur</Table.HeaderCell>
							<Table.HeaderCell>Rôle</Table.HeaderCell>
							<Table.HeaderCell>Rattachement</Table.HeaderCell>
							<Table.HeaderCell>Statut</Table.HeaderCell>
							<Table.HeaderCell>Invitation</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{filteredUsers.map((user) => (
							<Table.Row key={user.id} interactive>
								<Table.Cell>
									<Link
										className="font-medium hover:underline"
										to="/users/$id"
										params={{ id: String(user.id) }}
									>
										{user.firstName} {user.lastName}
									</Link>
									<div className="text-neutral-11">{user.email}</div>
								</Table.Cell>
								<Table.Cell>{user.roles.join(", ") || "—"}</Table.Cell>
								<Table.Cell>{user.firm?.name || user.network?.name || "—"}</Table.Cell>
								<Table.Cell>{user.status}</Table.Cell>
								<Table.Cell>{user.invitation?.sentAt ? "Envoyée" : "—"}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
		</section>
	);
}
