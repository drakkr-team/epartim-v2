import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionMatchingService from "#features/client/subscriptions/services/update/contract_characteristics/matching.service";
import Subscription from "#models/subscription";
import { UpdateSubscriptionMatchingSchema } from "#validators/subscription/contract_characteristics/matching.validator";

@inject()
export default class UpdateSubscriptionMatchingController {
	constructor(protected subscriptionMatchingService: SubscriptionMatchingService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateSubscriptionMatchingController.payloadSchema);

		return this.subscriptionMatchingService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateSubscriptionMatchingSchema);
}
