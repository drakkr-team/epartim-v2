import SubscriptionPlan from "#models/subscription_plan";
import type SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

export default class SubscriptionPlanPresenter {
	toJSON(plan: SubscriptionPlan, adhesions: SubscriptionPlanAdhesion[]) {
		return {
			id: plan.id,
			subscriptionId: plan.subscriptionId,
			existingDeviceTransfer: plan.existingDeviceTransfer,
			estimatedTransferAmount:
				plan.estimatedTransferAmountCents === null
					? null
					: Number(plan.estimatedTransferAmountCents) / 100,
			adhesionTypes: adhesions.map((adhesion) => adhesion.type),
			existingAgreements: plan.existingAgreements,
			otherAgreementDetails: plan.otherAgreementDetails,
			minimumSeniorityMonths: plan.minimumSeniorityMonths,
		};
	}
}
