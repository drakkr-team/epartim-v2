import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Field } from "@workspace/ui-react/components/field";
import { Menu } from "@workspace/ui-react/components/menu";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "@workspace/ui-react/icons";

import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/admins/$adminId/")({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			api.admins.view.queryOptions({ params: { adminId: params.adminId } }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError) {
			if (error.isStatus(404)) {
				throw notFound();
			}
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).admins.$adminId");

	const { adminId } = Route.useParams();

	const { data: admin } = useSuspenseQuery(api.admins.view.queryOptions({ params: { adminId } }));
	const canDoActions = admin.meta.canUpdate || admin.meta.canDelete;

	return (
		<main className="mx-auto grid max-w-lg gap-9">
			<header className="flex justify-between gap-2">
				<div className="grid gap-1">
					<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("headline")}
					</h2>
					<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
					<p className="text-neutral-11 text-sm">{t("description")}</p>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
							<EllipsisVerticalIcon />
						</Menu.Trigger>

						<Menu.Content align="end">
							{admin.meta.canUpdate && (
								<Menu.Item
									render={<Link to="/admins/$adminId/edit" params={{ adminId: adminId }} />}
								>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{admin.meta.canDelete && (
								<Menu.Item variant="destructive">
									<TrashIcon />
									{t("action.delete")}
								</Menu.Item>
							)}
						</Menu.Content>
					</Menu>
				)}
			</header>

			<Card className="grid grid-cols-2 gap-4">
				<Field>
					<Field.Label>{t("field.id")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.id}</p>
				</Field>

				<Field>
					<Field.Label>{t("field.name")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.name}</p>
				</Field>

				<Field>
					<Field.Label>{t("field.email")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.email}</p>
				</Field>

				<Field>
					<Field.Label>{t("field.activatedAt")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.activatedAt?.toLocaleDateString()}</p>
				</Field>

				<Field>
					<Field.Label>{t("field.createdAt")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.createdAt.toLocaleDateString()}</p>
				</Field>

				<Field>
					<Field.Label>{t("field.updatedAt")}</Field.Label>
					<p className="text-neutral-12 text-sm">{admin.updatedAt.toLocaleDateString()}</p>
				</Field>
			</Card>
		</main>
	);
}
