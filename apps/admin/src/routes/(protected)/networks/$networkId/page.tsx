import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Menu } from "@workspace/ui-react/components/menu";
import { Separator } from "@workspace/ui-react/components/separator";
import {
	EllipsisVerticalIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { DetailField } from "#/components/app/detail-field";
import { humanizeIBAN } from "#/helpers/iban";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/networks/$networkId/")({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.query(
				api.networks.view.queryOptions({ params: { networkId: params.networkId } }),
			),
			context.queryClient.query(
				api.firms.list.queryOptions({ query: { networkId: Number(params.networkId) } }),
			),
		]);
	},
	onError: (error) => {
		if (error instanceof TuyauError && error.isStatus(404)) {
			throw notFound();
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).networks.$networkId");
	const { networkId } = Route.useParams();
	const firmQuery = { networkId: Number(networkId) };

	const { data: network } = useSuspenseQuery(
		api.networks.view.queryOptions({ params: { networkId } }),
	);
	const { data: firms } = useSuspenseQuery(api.firms.list.queryOptions({ query: firmQuery }));

	const canDoActions = network.meta.canUpdate || network.meta.canDelete;

	return (
		<main className="mx-auto grid max-w-xl gap-9">
			<header className="flex items-center justify-between gap-2">
				<div className="grid gap-1">
					<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("headline")}
					</h2>
					<h1 className="font-bold text-3xl text-secondary-12">{network.name}</h1>
					<p className="text-neutral-11 text-sm">{t("description")}</p>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
							<EllipsisVerticalIcon />
						</Menu.Trigger>

						<Menu.Content align="end">
							{network.meta.canUpdate && (
								<Menu.Item>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{network.meta.canDelete && (
								<Menu.Item variant="destructive">
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

					<DetailField label={t("field.id")} value={network.id.toString()} />
					<DetailField label={t("field.name")} value={network.name} />
					<DetailField
						label={t("field.amundiOrgId")}
						value={network.amundiOrgId ?? t("status.notProvided")}
					/>
					<DetailField
						label={t("field.goCode")}
						value={network.goCode?.toString() ?? t("status.notProvided")}
					/>
					<DetailField
						label={t("field.createdAt")}
						value={network.createdAt.toLocaleDateString("fr-FR")}
					/>
					<DetailField
						label={t("field.updatedAt")}
						value={network.updatedAt.toLocaleDateString("fr-FR")}
					/>
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
						{t("section.address")}
					</h2>

					<DetailField label={t("field.address.lineOne")} value={network.address.lineOne} />
					<DetailField
						label={t("field.address.lineTwo")}
						value={network.address.lineTwo ?? t("status.notProvided")}
					/>
					<DetailField label={t("field.address.zip")} value={network.address.zip} />
					<DetailField label={t("field.address.city")} value={network.address.city} />
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
						{t("section.payment")}
					</h2>

					<DetailField
						label={t("field.paymentDetail.iban")}
						value={humanizeIBAN(network.paymentDetail.iban)}
					/>
					<DetailField label={t("field.paymentDetail.bic")} value={network.paymentDetail.bic} />
				</div>
			</Card>

			<Card className="grid gap-4">
				<div className="flex items-center justify-between gap-4">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.firms")}</h2>
					<Button
						variant="default"
						nativeButton={false}
						render={<Link to="/firms" search={firmQuery} />}
					>
						{t("action.viewAllFirms")}
					</Button>
				</div>

				{firms.data.length > 0 ? (
					<ul className="grid gap-3">
						{firms.data.map((firm) => (
							<li
								key={firm.id}
								className="flex items-center justify-between gap-4 border-neutral-6 border-t pt-3 first:border-0 first:pt-0"
							>
								<div className="grid gap-1">
									<p className="font-medium text-neutral-12 text-sm">{firm.name}</p>
									<p className="text-neutral-11 text-xs">
										{t("field.firm.orias")}: {firm.orias}
									</p>
								</div>
								<Button
									variant="ghost"
									nativeButton={false}
									render={<Link to="/firms/$firmId" params={{ firmId: firm.id.toString() }} />}
								>
									<SquareArrowOutUpRightIcon />
									{t("action.viewFirm")}
								</Button>
							</li>
						))}
					</ul>
				) : (
					<p className="py-8 text-center text-neutral-11 text-sm">{t("empty.firms")}</p>
				)}
			</Card>
		</main>
	);
}
