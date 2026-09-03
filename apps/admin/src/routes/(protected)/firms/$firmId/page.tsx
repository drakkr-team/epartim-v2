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
import { DeleteFirmDialog } from "#/features/firms/components/delete-dialog";
import { humanizeIBAN } from "#/helpers/iban";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/firms/$firmId/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.firms.view.queryOptions({ params: { firmId: params.firmId } }),
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
	const { t } = useTranslation("routes.(protected).firms.$firmId");

	const { firmId } = Route.useParams();
	const navigate = useNavigate();

	const { data: firm } = useSuspenseQuery(api.firms.view.queryOptions({ params: { firmId } }));
	const canDoActions = firm.meta.canUpdate || firm.meta.canDelete;

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleAfterDelete = () => {
		navigate({ to: "/firms", replace: true });
	};

	return (
		<main className="mx-auto grid max-w-xl gap-9">
			<header className="flex items-center justify-between gap-2">
				<div className="grid gap-1">
					<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("headline")}
					</h2>
					<h1 className="font-bold text-3xl text-secondary-12">{firm.name}</h1>
					<p className="text-neutral-11 text-sm">{t("description")}</p>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
							<EllipsisVerticalIcon />
						</Menu.Trigger>
						<Menu.Content align="end">
							{firm.meta.canUpdate && (
								<Menu.Item render={<Link to="/firms/$firmId/edit" params={{ firmId }} />}>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{firm.meta.canDelete && (
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

					<DetailField label={t("field.id")} value={firm.id.toString()} />
					<DetailField label={t("field.name")} value={firm.name} />
					<DetailField
						label={t("field.amundiOrgId")}
						value={firm.amundiOrgId ?? t("status.notProvided")}
					/>
					<DetailField label={t("field.orias")} value={firm.orias} />
					<DetailField
						label={t("field.createdAt")}
						value={firm.createdAt.toLocaleDateString("fr-FR")}
					/>
					<DetailField
						label={t("field.updatedAt")}
						value={firm.updatedAt.toLocaleDateString("fr-FR")}
					/>
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
						{t("section.address")}
					</h2>

					<DetailField label={t("field.address.lineOne")} value={firm.address.lineOne} />
					<DetailField
						label={t("field.address.lineTwo")}
						value={firm.address.lineTwo ?? t("status.notProvided")}
					/>
					<DetailField label={t("field.address.zip")} value={firm.address.zip} />
					<DetailField label={t("field.address.city")} value={firm.address.city} />
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
						{t("section.payment")}
					</h2>

					<DetailField
						label={t("field.paymentDetail.iban")}
						value={humanizeIBAN(firm.paymentDetail.iban)}
					/>
					<DetailField label={t("field.paymentDetail.bic")} value={firm.paymentDetail.bic} />
				</div>
			</Card>

			<DeleteFirmDialog
				firm={firm}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				afterDelete={handleAfterDelete}
			/>
		</main>
	);
}
