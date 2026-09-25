import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type ContractCharacteristicsStepProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function ContractCharacteristicsStep(props: ContractCharacteristicsStepProps) {
	const { subscription, subscriptionId } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");

	return (
		<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
			<div className="grid min-w-0 gap-8">
				<SubscriptionStepHeader
					description={t("step-three.description")}
					eyebrow={t("step-three.eyebrow")}
					isValidated={subscription.completedSteps?.includes(3) ?? false}
					title={t("step-three.title")}
				/>
				<div className="lg:hidden">
					<SubscriptionSummary subscription={subscription} />
				</div>
				<SubscriptionStepFooter
					currentStep={3}
					stepLabel={t("step-three.short-title")}
					subscriptionId={subscriptionId}
				>
					{null}
				</SubscriptionStepFooter>
			</div>

			<aside className="hidden lg:block">
				<div className="sticky top-8">
					<SubscriptionSummary subscription={subscription} />
				</div>
			</aside>
		</main>
	);
}
