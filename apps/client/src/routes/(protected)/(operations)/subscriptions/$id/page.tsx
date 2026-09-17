import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { AddressAndBankDetailsForm } from "#/features/subscriptions/address_and_bank_details/components/form";
import { DocumentsChecklist } from "#/features/subscriptions/documents/components/documents-checklist";
import { DocumentsSection } from "#/features/subscriptions/documents/components/documents-section";
import { useSubscriptionQuery } from "#/features/subscriptions/hooks/use-subscription-query";
import { LegalIdentificationForm } from "#/features/subscriptions/legal_identification/components/form.tsx";
import { RepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/components/form";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/$id/")({
	staticData: {
		breadcrumb: { labelKey: "new-subscription", to: "/subscriptions/$id" },
	} satisfies BreadcrumbStaticData,
	component: NewSubscriptionPage,
});

function NewSubscriptionPage() {
	const { id } = Route.useParams();
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id");
	const subscriptionQuery = useSubscriptionQuery(id);

	if (subscriptionQuery.isPending) {
		return (
			<div className="flex min-h-80 items-center justify-center">
				<Spinner className="size-6 text-primary-9" />
			</div>
		);
	}

	if (subscriptionQuery.isError || !subscriptionQuery.data) {
		return <p className="text-error-10">{t("error")}</p>;
	}

	return (
		<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
			<div className="grid min-w-0 gap-8">
				<header className="border-neutral-4 border-b pb-6">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h1 className="mt-3 font-bold text-3xl text-secondary-12">{t("title")}</h1>
					<p className="mt-2 text-neutral-11 text-sm sm:text-base">{t("description")}</p>
				</header>

				<LegalIdentificationForm
					subscriptionId={id}
					legalIdentification={subscriptionQuery.data.legalIdentification}
				/>

				<AddressAndBankDetailsForm
					subscriptionId={id}
					address={subscriptionQuery.data.addressAndBankDetails.address}
					paymentDetail={subscriptionQuery.data.addressAndBankDetails.paymentDetail}
				/>

				<RepresentativesAndAuthorizationsForm
					subscriptionId={id}
					representativesAndAuthorizations={subscriptionQuery.data.representativesAndAuthorizations}
				/>

				<DocumentsSection subscriptionId={id} documents={subscriptionQuery.data.documents} />

				<footer className="flex justify-start border-neutral-4 border-t pt-6">
					<Button nativeButton={false} variant="ghost" render={<Link to="/subscriptions" />}>
						{t("action.quit")}
					</Button>
				</footer>
			</div>

			<aside className="hidden lg:block">
				<div className="fixed right-8 bottom-6 z-10 w-72">
					<DocumentsChecklist documents={subscriptionQuery.data.documents} />
				</div>
			</aside>
		</main>
	);
}
