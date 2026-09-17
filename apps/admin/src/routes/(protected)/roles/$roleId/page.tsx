import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Menu } from "@workspace/ui-react/components/menu";
import { Separator } from "@workspace/ui-react/components/separator";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "@workspace/ui-react/icons";

import { DetailField } from "#/components/app/detail-field";
import { AuthorizationMatrix } from "#/features/roles/components/authorization-matrix";
import { DeleteRoleDialog } from "#/features/roles/components/delete-dialog";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/roles/$roleId/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.roles.view.queryOptions({ params: { roleId: params.roleId } }, { staleTime: "static" }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError && error.isStatus(404)) {
			throw notFound();
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).roles.$roleId");
	const { roleId } = Route.useParams();
	const navigate = useNavigate();

	const { data: role } = useSuspenseQuery(api.roles.view.queryOptions({ params: { roleId } }));

	const canDoActions = (role.meta.canUpdate || role.meta.canDelete);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleAfterDelete = () => {
		navigate({ to: "/roles", replace: true });
	};

	return (
		<main className="mx-auto grid max-w-3xl gap-9">
			<header className="flex items-center justify-between gap-2">
				<div className="grid gap-1">
					<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("headline")}
					</h2>
					<h1 className="font-bold text-3xl text-secondary-12">{role.name}</h1>
					<p className="text-neutral-11 text-sm">{t("description")}</p>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger
							render={<Button variant="ghost" size="icon-md" aria-label={t("action.menu")} />}
						>
							<EllipsisVerticalIcon />
						</Menu.Trigger>

						<Menu.Content align="end">
							{role.meta.canUpdate && (
								<Menu.Item render={<Link to="/roles/$roleId/edit" params={{ roleId }} />}>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{role.meta.canDelete && (
								<Menu.Item variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
									<TrashIcon />
									{t("action.delete")}
								</Menu.Item>
							)}
						</Menu.Content>
					</Menu>
				)}
			</header>

			<Card className="grid gap-5">
				<div className="grid grid-cols-2 gap-4">
					<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
						{t("section.general")}
					</h2>

					<DetailField label={t("field.id")} value={role.id.toString()} />
					<DetailField label={t("field.name")} value={role.name} />
					<DetailField
						label={t("field.createdAt")}
						value={role.createdAt.toLocaleDateString("fr-FR")}
					/>
					<DetailField
						label={t("field.updatedAt")}
						value={role.updatedAt.toLocaleDateString("fr-FR")}
					/>
				</div>

				<Separator />

				<AuthorizationMatrix
					authorizations={role.authorizations}
					isSuperAdmin={role.isSuperAdmin}
				/>
			</Card>

			<DeleteRoleDialog
				role={role}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				afterDelete={handleAfterDelete}
			/>
		</main>
	);
}
