import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import ApplySubscriptionInpiService from "#features/client/subscriptions/services/inpi/apply.service";
import Subscription from "#models/subscription";
import { ApplySubscriptionInpiSchema } from "#validators/subscription/inpi.validator";

@inject()
export default class ApplySubscriptionInpiController {
	constructor(protected applyService: ApplySubscriptionInpiService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(ApplySubscriptionInpiController.payloadSchema);
		return this.applyService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(ApplySubscriptionInpiSchema);
}
