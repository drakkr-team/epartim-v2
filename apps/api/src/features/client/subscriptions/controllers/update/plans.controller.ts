import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import UpdateContractCharacteristicsService from "#features/client/subscriptions/services/update/contract_characteristics.service";
import Subscription from "#models/subscription";
import SubscriptionPlanPresenter from "#presenters/subscription_plan.presenter";
import { UpdateSubscriptionContractCharacteristicsSchema } from "#validators/subscription/contract_characteristics.validator";

@inject()
export default class UpdateSubscriptionPlansController {
	constructor(
		protected updateContractCharacteristicsService: UpdateContractCharacteristicsService,
		protected subscriptionPlanPresenter: SubscriptionPlanPresenter,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateSubscriptionPlansController.payloadSchema);
		const { plan, adhesions } = await this.updateContractCharacteristicsService.handle(
			subscription,
			payload,
		);

		return this.subscriptionPlanPresenter.toJSON(plan, adhesions);
	}

	static payloadSchema = vine.create(UpdateSubscriptionContractCharacteristicsSchema);
}
