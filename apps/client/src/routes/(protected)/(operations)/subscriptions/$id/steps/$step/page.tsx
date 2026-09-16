import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Spinner } from "@workspace/ui-react/components/spinner";

import { useSubscriptionQuery } from "#/features/subscriptions/hooks/use-subscription-query";
import { CompanyReferencesStep } from "#/features/subscriptions/steps/components/company-references-step";
import { KycStep } from "#/features/subscriptions/steps/components/kyc-step";

const supportedSteps = ["1", "2"] as const;

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/$id/steps/$step/")({
	beforeLoad: ({ params }) => {
		if (!supportedSteps.includes(params.step as (typeof supportedSteps)[number])) throw notFound();
	},
	component: SubscriptionStepPage,
});

function SubscriptionStepPage() {
	const { id, step } = Route.useParams();
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
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

	if (step === "2") return <KycStep />;

	return <CompanyReferencesStep subscriptionId={id} subscription={subscriptionQuery.data} />;
}
