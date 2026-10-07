import { companyReferencesCompletion } from "#/features/subscriptions/steps/completion/company-references";
import type {
	StepCompletion,
	SubscriptionSnapshot,
} from "#/features/subscriptions/steps/completion/completion";
import { contractCharacteristicsCompletion } from "#/features/subscriptions/steps/completion/contract-characteristics";
import { contractFeesCompletion } from "#/features/subscriptions/steps/completion/contract-fees";
import { formalismCompletion } from "#/features/subscriptions/steps/completion/formalism";
import { kycCompletion } from "#/features/subscriptions/steps/completion/kyc";
import type { SUPPORTED_SUBSCRIPTION_STEPS } from "#/features/subscriptions/steps/step.constants";

export type SubscriptionCompletion = Record<
	(typeof SUPPORTED_SUBSCRIPTION_STEPS)[number],
	StepCompletion | null
>;

// Consume the query snapshot only: unsaved edits and completedSteps never drive this indicator.
export function getSubscriptionCompletion(
	subscription: SubscriptionSnapshot,
): SubscriptionCompletion {
	return {
		1: companyReferencesCompletion(subscription),
		2: kycCompletion(subscription),
		3: contractCharacteristicsCompletion(subscription),
		4: contractFeesCompletion(subscription),
		5: formalismCompletion(subscription),
	};
}
