import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import UpdateSubscriptionPlansService from "#features/client/subscriptions/services/update/plans.service";
import Subscription from "#models/subscription";
import SubscriptionPlanPresenter from "#presenters/subscription_plan.presenter";
import { UpdateSubscriptionPlansSchema } from "#validators/subscription/plans.validator";

@inject()
export default class UpdateSubscriptionPlansController {
	constructor(
		protected updateSubscriptionPlansService: UpdateSubscriptionPlansService,
		protected subscriptionPlanPresenter: SubscriptionPlanPresenter,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateSubscriptionPlansController.payloadSchema);
		const { plan, adhesions } = await this.updateSubscriptionPlansService.handle(
			subscription,
			payload,
		);

		return this.subscriptionPlanPresenter.toJSON(plan, adhesions);
	}

	static payloadSchema = vine.create(UpdateSubscriptionPlansSchema);
}
