import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Spinner } from "@workspace/ui-react/components/spinner";

import { useSubscriptionQuery } from "#/features/subscriptions/hooks/use-subscription-query";
import { getSubscriptionCompletion } from "#/features/subscriptions/steps/completion/subscription-completion";
import { CompanyReferencesStep } from "#/features/subscriptions/steps/components/company-references-step";
import { ContractCharacteristicsStep } from "#/features/subscriptions/steps/components/contract-characteristics-step";
import { ContractFeesStep } from "#/features/subscriptions/steps/components/contract-fees-step";
import { FormalismStep } from "#/features/subscriptions/steps/components/formalism-step";
import { KycStep } from "#/features/subscriptions/steps/components/kyc-step";
import { SubscriptionStepNavigation } from "#/features/subscriptions/steps/components/subscription-step-navigation";
import { SUPPORTED_SUBSCRIPTION_STEPS } from "#/features/subscriptions/steps/step.constants";

const supportedSteps = SUPPORTED_SUBSCRIPTION_STEPS.map(String);

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/$id/steps/$step/")({
	beforeLoad: ({ params }) => {
		if (!supportedSteps.includes(params.step)) throw notFound();
	},
	component: SubscriptionStepPage,
});

function SubscriptionStepPage() {
	const { id, step } = Route.useParams();
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
	const { data: subscription, isPending, isError } = useSubscriptionQuery(id);

	if (isPending) {
		return (
			<div className="flex min-h-80 items-center justify-center">
				<Spinner className="size-6 text-primary-9" />
			</div>
		);
	}

	if (isError || !subscription || !subscription.meta.canUpdate) {
		return <p className="text-error-10">{t("error")}</p>;
	}

	const Step =
		step === "2"
			? KycStep
			: step === "3"
				? ContractCharacteristicsStep
				: step === "4"
					? ContractFeesStep
					: step === "5"
						? FormalismStep
						: CompanyReferencesStep;

	return (
		<div className="mx-auto -mt-4 grid w-full max-w-7xl gap-8 sm:-mt-8">
			<SubscriptionStepNavigation
				completedSteps={subscription.completedSteps}
				completion={getSubscriptionCompletion(subscription)}
				currentStep={Number(step)}
				subscriptionId={id}
			/>
			<Step subscriptionId={id} subscription={subscription} />
		</div>
	);
}
