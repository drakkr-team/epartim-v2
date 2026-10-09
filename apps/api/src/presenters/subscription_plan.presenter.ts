import { SubscriptionAgreement } from "#constants/subscription_agreement";
import type SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import SubscriptionPlan from "#models/subscription_plan";
import type SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { presentSubscriptionMatchingRules } from "#presenters/subscription_matching.presenter";

export default class SubscriptionPlanPresenter {
	toJSON(
		plan: SubscriptionPlan,
		adhesions: SubscriptionPlanAdhesion[],
		existingAgreements: SubscriptionExistingAgreement[],
	) {
		return {
			id: plan.id,
			subscriptionId: plan.subscriptionId,
			existingDeviceTransfer: plan.existingDeviceTransfer,
			estimatedTransferAmount:
				plan.estimatedTransferAmountCents === null
					? null
					: Number(plan.estimatedTransferAmountCents) / 100,
			adhesionTypes: adhesions.map((adhesion) => adhesion.type),
			existingAgreements: Object.values(SubscriptionAgreement).filter((type) =>
				existingAgreements.some((agreement) => agreement.type === type),
			),
			otherAgreementDetails: plan.otherAgreementDetails,
			minimumSeniorityMonths: plan.minimumSeniorityMonths,
			voluntaryParticipationDuration: plan.voluntaryParticipationDuration,
			voluntaryParticipationStartDate: plan.voluntaryParticipationStartDate?.toISODate() ?? null,
			voluntaryParticipationEndDate: plan.voluntaryParticipationEndDate?.toISODate() ?? null,
			voluntaryParticipationMinimumSeniorityMonths:
				plan.voluntaryParticipationMinimumSeniorityMonths,
			voluntaryParticipationSalaryPercentage:
				plan.voluntaryParticipationSalaryBasisPoints === null
					? null
					: plan.voluntaryParticipationSalaryBasisPoints / 100,
			voluntaryParticipationPresencePercentage:
				plan.voluntaryParticipationPresenceBasisPoints === null
					? null
					: plan.voluntaryParticipationPresenceBasisPoints / 100,
			voluntaryParticipationEqualPercentage:
				plan.voluntaryParticipationEqualBasisPoints === null
					? null
					: plan.voluntaryParticipationEqualBasisPoints / 100,
			voluntaryParticipationFormula: plan.voluntaryParticipationFormula,
			matchingCalculationMethod: plan.matchingCalculationMethod,
			matchingDistributionPeriod: plan.matchingDistributionPeriod,
			matchingRules: presentSubscriptionMatchingRules(plan.matchingRules),
			voluntaryPaymentsLimitedToPeriod: plan.voluntaryPaymentsLimitedToPeriod,
			voluntaryPaymentPeriodStartDate: plan.voluntaryPaymentPeriodStartDate?.toISODate() ?? null,
			voluntaryPaymentPeriodEndDate: plan.voluntaryPaymentPeriodEndDate?.toISODate() ?? null,
		};
	}
}
