import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionPlanAdhesionsService from "#features/client/subscriptions/services/update/contract_characteristics/adhesions.service";
import Subscription from "#models/subscription";
import { UpdateSubscriptionPlanAdhesionsSchema } from "#validators/subscription/contract_characteristics/adhesions.validator";

@inject()
export default class UpdateSubscriptionPlanAdhesionsController {
	constructor(protected subscriptionPlanAdhesionsService: SubscriptionPlanAdhesionsService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(
			UpdateSubscriptionPlanAdhesionsController.payloadSchema,
		);

		return this.subscriptionPlanAdhesionsService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateSubscriptionPlanAdhesionsSchema);
}
