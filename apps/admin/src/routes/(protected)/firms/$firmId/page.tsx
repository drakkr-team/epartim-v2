import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Field } from "@workspace/ui-react/components/field";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	ArrowLeftIcon,
	EllipsisVerticalIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { api } from "#/libs/tuyau";

const allowedOriginParams = new Set(["page", "perPage", "q", "networkId", "orderBy"]);
const listOriginSchema = z
	.string()
	.refine((value) => {
		try {
			const origin = new URL(value, "https://admin.epartim.invalid");
			return (
				origin.origin === "https://admin.epartim.invalid" &&
				origin.pathname === "/firms" &&
				origin.hash === "" &&
				Array.from(origin.searchParams.keys()).every((key) => allowedOriginParams.has(key))
			);
		} catch (error) {
			if (error instanceof TypeError) return false;
			throw error;
		}
	})
	.optional();

const searchParamsSchema = z.object({
	from: listOriginSchema,
});

export const Route = createFileRoute("/(protected)/firms/$firmId/")({
	validateSearch: searchParamsSchema,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			api.firms.view.queryOptions({ params: { firmId: params.firmId } }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError && error.isStatus(404)) {
			throw notFound();
		}
	},
	pendingComponent: Pending,
	pendingMs: 0,
	component: Page,
});

function maskIban(iban: string) {
	const normalizedIban = iban.replaceAll(" ", "");
	return `•••• ${normalizedIban.slice(-4)}`;
}

function Pending() {
	const { t } = useTranslation("routes.(protected).firms.$firmId");

	return (
		<main aria-live="polite">
			<Card className="flex items-center justify-center gap-3 py-16">
				<Spinner />
				<p className="text-neutral-11 text-sm">{t("loading")}</p>
			</Card>
		</main>
	);
}

function Page() {
	const { t } = useTranslation("routes.(protected).firms.$firmId");
	const { firmId } = Route.useParams();
	const search = Route.useSearch();
	const { data: firm } = useSuspenseQuery(api.firms.view.queryOptions({ params: { firmId } }));
	const canDoActions = firm.meta.canUpdate || firm.meta.canDelete;
	const origin = search.from ?? "/firms";

	return (
		<main className="mx-auto grid max-w-3xl gap-9">
			<header className="flex items-start justify-between gap-4">
				<div className="grid gap-3">
					<Button
						className="w-fit"
						variant="ghost"
						nativeButton={false}
						render={<a href={origin} />}
					>
						<ArrowLeftIcon />
						{t("action.back")}
					</Button>
					<div className="grid gap-1">
						<h2 className="font-bold text-primary-11 text-xs uppercase tracking-widest">
							{t("headline")}
						</h2>
						<h1 className="font-bold text-3xl text-secondary-12">{firm.name}</h1>
						<p className="text-neutral-11 text-sm">{t("description")}</p>
					</div>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger
							render={<Button variant="ghost" size="icon-md" aria-label={t("action.menu")} />}
						>
							<EllipsisVerticalIcon />
						</Menu.Trigger>
						<Menu.Content align="end">
							{firm.meta.canUpdate && (
								<Menu.Item render={<a href={`/firms/${firmId}/edit`} />}>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{firm.meta.canDelete && (
								<Menu.Item variant="destructive">
									<TrashIcon />
									{t("action.delete")}
								</Menu.Item>
							)}
						</Menu.Content>
					</Menu>
				)}
			</header>

			<Card className="grid gap-8 p-6">
				<section className="grid gap-4">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.general")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<DetailField label={t("field.id")} value={firm.id.toString()} />
						<DetailField label={t("field.name")} value={firm.name} />
						<DetailField
							label={t("field.amundiOrgId")}
							value={firm.amundiOrgId ?? t("status.notProvided")}
						/>
						<DetailField label={t("field.orias")} value={firm.orias} />
						<DetailField
							label={t("field.network")}
							value={
								firm.networkId === null
									? t("status.noNetwork")
									: t("status.networkReference", { id: firm.networkId })
							}
						/>
					</div>
				</section>

				<section className="grid gap-4 border-neutral-6 border-t pt-6">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.address")}</h2>
					<address className="text-neutral-12 text-sm not-italic">
						<p>{firm.address.lineOne}</p>
						{firm.address.lineTwo && <p>{firm.address.lineTwo}</p>}
						<p>
							{firm.address.zip} {firm.address.city}
						</p>
					</address>
					{firm.address.coordinates && (
						<div className="grid gap-4 md:grid-cols-2">
							<DetailField
								label={t("field.latitude")}
								value={firm.address.coordinates.latitude.toString()}
							/>
							<DetailField
								label={t("field.longitude")}
								value={firm.address.coordinates.longitude.toString()}
							/>
						</div>
					)}
				</section>

				<section className="grid gap-4 border-neutral-6 border-t pt-6">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.payment")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<DetailField label={t("field.iban")} value={maskIban(firm.paymentDetail.iban)} />
						<DetailField label={t("field.bic")} value={firm.paymentDetail.bic} />
					</div>
				</section>

				<section className="grid gap-4 border-neutral-6 border-t pt-6">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.audit")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<DetailField
							label={t("field.createdAt")}
							value={firm.createdAt.toLocaleDateString("fr-FR")}
						/>
						<DetailField
							label={t("field.updatedAt")}
							value={firm.updatedAt.toLocaleDateString("fr-FR")}
						/>
					</div>
				</section>
			</Card>
		</main>
	);
}

type DetailFieldProps = {
	label: string;
	value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
	return (
		<Field>
			<Field.Label>{label}</Field.Label>
			<p className="text-neutral-12 text-sm">{value}</p>
		</Field>
	);
}
