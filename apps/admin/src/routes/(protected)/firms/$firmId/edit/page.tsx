import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { FirmForm } from "#/features/firms/components/form";
import type { FirmFormValues } from "#/features/firms/utils/payload";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/firms/$firmId/edit/")({
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

function Pending() {
	const { t } = useTranslation("routes.(protected).firms.$firmId.edit");

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
	const { t } = useTranslation("routes.(protected).firms.$firmId.edit");
	const { firmId } = Route.useParams();
	const { data: firm } = useSuspenseQuery(api.firms.view.queryOptions({ params: { firmId } }));
	const defaultValues: FirmFormValues = {
		name: firm.name,
		amundiOrgId: firm.amundiOrgId ?? "",
		orias: firm.orias,
		networkId: firm.networkId === null ? null : Number(firm.networkId),
		address: {
			lineOne: firm.address.lineOne,
			lineTwo: firm.address.lineTwo ?? "",
			zip: firm.address.zip,
			city: firm.address.city,
			coordinates: {
				latitude: firm.address.coordinates?.latitude ?? null,
				longitude: firm.address.coordinates?.longitude ?? null,
			},
		},
		paymentDetail: {
			iban: firm.paymentDetail.iban,
			bic: firm.paymentDetail.bic,
		},
	};

	return (
		<main className="mx-auto grid max-w-3xl gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-11 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<Card className="p-6">
				<FirmForm action="update" firmId={firmId} defaultValues={defaultValues} />
			</Card>
		</main>
	);
}
