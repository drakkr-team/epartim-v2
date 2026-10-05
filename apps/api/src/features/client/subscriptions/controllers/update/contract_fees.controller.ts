import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionContractFeesService from "#features/client/subscriptions/services/update/contract_fees.service";
import Subscription from "#models/subscription";
import { UpdateSubscriptionContractFeesSchema } from "#validators/subscription/contract_fees.validator";

@inject()
export default class UpdateSubscriptionContractFeesController {
	constructor(protected subscriptionContractFeesService: SubscriptionContractFeesService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(
			UpdateSubscriptionContractFeesController.payloadSchema,
		);

		return this.subscriptionContractFeesService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateSubscriptionContractFeesSchema);
}
