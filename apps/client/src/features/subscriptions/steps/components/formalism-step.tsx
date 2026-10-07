import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
	getActiveFormalismGroups,
	SubscriptionFormalismMethod,
} from "@workspace/api/constants/subscription_formalism";
import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { FormalismEmployeesForm } from "#/features/subscriptions/formalism/components/employees-form";
import { FormalismForm } from "#/features/subscriptions/formalism/components/form";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
export function FormalismStep({
	subscription,
	subscriptionId,
}: {
	subscription: Subscription;
	subscriptionId: string;
}) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const isValidated = subscription.completedSteps?.includes(5) ?? false;
	const headcount = subscription.legalIdentification.companyHeadcount;
	const activeGroups = getActiveFormalismGroups(subscription.contractCharacteristics.adhesionTypes);
	const groups = subscription.formalism.groups.filter((group) =>
		activeGroups.includes(group.group),
	);
	const ratificationGroup = groups.find(
		(group) => group.method === SubscriptionFormalismMethod.RATIFICATION,
	);
	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader
						title={t("title")}
						description={t("description")}
						eyebrow={t("eyebrow")}
					/>
					<div className="lg:hidden">
						<SubscriptionSummary subscription={subscription} />
					</div>
					{(!headcount || groups.length === 0) && (
						<Card className="grid gap-3 p-6">
							<p className="text-neutral-11 text-sm">
								{t(!headcount ? "missingHeadcount" : "missingDevices")}
							</p>
							<Link
								className="w-fit font-semibold text-primary-9 underline"
								to="/subscriptions/$id/steps/$step"
								params={{ id: subscriptionId, step: !headcount ? "1" : "3" }}
							>
								{t(!headcount ? "action.stepOne" : "action.stepThree")}
							</Link>
						</Card>
					)}
					{headcount &&
						groups.flatMap((group) => [
							<FormalismForm
								key={group.group}
								subscriptionId={subscriptionId}
								group={group}
								devices={subscription.contractCharacteristics.adhesionTypes
									.filter((type) => getActiveFormalismGroups([type]).includes(group.group))
									.map((type) => t(`device.${type}`))
									.join(" · ")}
								formalism={subscription.formalism}
								headcount={headcount}
							/>,
							group.group === ratificationGroup?.group && (
								<FormalismEmployeesForm
									key="employees"
									subscriptionId={subscriptionId}
									employees={subscription.formalism.employees}
									headcount={headcount}
								/>
							),
						])}
					<SubscriptionStepFooter
						currentStep={5}
						stepLabel={t("shortTitle")}
						subscriptionId={subscriptionId}
					>
						<ValidateStepButton
							areDocumentsComplete={!!headcount && groups.length > 0}
							incompleteMessage={t(!headcount ? "missingHeadcount" : "missingDevices")}
							isValidated={isValidated}
							step={5}
							subscriptionId={subscriptionId}
						/>
					</SubscriptionStepFooter>
				</div>
				<aside className="hidden lg:block">
					<div className="sticky top-8 grid gap-4">
						<SubscriptionSummary subscription={subscription} />
					</div>
				</aside>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
