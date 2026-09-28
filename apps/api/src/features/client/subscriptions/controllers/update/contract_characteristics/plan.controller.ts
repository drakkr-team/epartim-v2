import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionPlanService from "#features/client/subscriptions/services/update/contract_characteristics/plan.service";
import Subscription from "#models/subscription";
import { UpdateSubscriptionPlanSchema } from "#validators/subscription/contract_characteristics/plan.validator";

@inject()
export default class UpdateSubscriptionPlanController {
	constructor(protected subscriptionPlanService: SubscriptionPlanService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateSubscriptionPlanController.payloadSchema);

		return this.subscriptionPlanService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateSubscriptionPlanSchema);
}
