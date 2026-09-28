import { SubscriptionMatchingDevice } from "@workspace/api/constants/subscription_matching_rules";
import { SubscriptionPlanAdhesionType } from "@workspace/api/constants/subscription_plan_adhesion";
import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { DispositivesSection } from "#/features/subscriptions/contract_characteristics/components/dispositives-section.tsx";
import { ExistingAgreementsSection } from "#/features/subscriptions/contract_characteristics/components/existing-agreements-section";
import { MatchingCalculationSection } from "#/features/subscriptions/contract_characteristics/components/matching-calculation-section";
import { MatchingDistributionSection } from "#/features/subscriptions/contract_characteristics/components/matching-distribution-section";
import { MatchingSection } from "#/features/subscriptions/contract_characteristics/components/matching-section";
import { MinimumSenioritySection } from "#/features/subscriptions/contract_characteristics/components/minimum-seniority-section";
import { VoluntaryPaymentPeriodSection } from "#/features/subscriptions/contract_characteristics/components/voluntary-payment-period-section";
import { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type ContractCharacteristicsFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function ContractCharacteristicsForm(props: ContractCharacteristicsFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, updateContractCharacteristics, matchingServerErrors, clearMatchingServerErrors } =
		useContractCharacteristicsForm({
			subscriptionId,
			contractCharacteristics: subscription.contractCharacteristics,
		});
	useRegisterSubscriptionStepForm(form);

	return (
		<form noValidate className="grid gap-8">
			<Card className="p-6 sm:p-8">
				<DispositivesSection
					form={form}
					updateContractCharacteristics={updateContractCharacteristics}
				/>
			</Card>
			<Card className="p-6 sm:p-8">
				<ExistingAgreementsSection form={form} />
			</Card>
			<Card className="p-6 sm:p-8">
				<MinimumSenioritySection form={form} />
			</Card>
			<Card className="p-6 sm:p-8">
				<VoluntaryPaymentPeriodSection
					form={form}
					updateContractCharacteristics={updateContractCharacteristics}
				/>
			</Card>
			<Card className="p-6 sm:p-8">
				<MatchingCalculationSection form={form} />
			</Card>
			<Card className="p-6 sm:p-8">
				<MatchingDistributionSection form={form} />
			</Card>
			<form.Subscribe selector={(state) => state.values.adhesionTypes}>
				{(adhesionTypes) => (
					<>
						{adhesionTypes.includes(SubscriptionPlanAdhesionType.PEI_EPARTIM) && (
							<Card className="p-6 sm:p-8">
								<MatchingSection
									device={SubscriptionMatchingDevice.PEI}
									form={form}
									serverErrors={matchingServerErrors}
									clearServerErrors={clearMatchingServerErrors}
								/>
							</Card>
						)}
						{adhesionTypes.includes(SubscriptionPlanAdhesionType.PER_COLI_EPARTIM) && (
							<Card className="p-6 sm:p-8">
								<MatchingSection
									device={SubscriptionMatchingDevice.PER}
									form={form}
									serverErrors={matchingServerErrors}
									clearServerErrors={clearMatchingServerErrors}
								/>
							</Card>
						)}
					</>
				)}
			</form.Subscribe>
		</form>
	);
}
