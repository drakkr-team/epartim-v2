import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionAgreementsService from "#features/client/subscriptions/services/update/contract_characteristics/agreements.service";
import Subscription from "#models/subscription";
import { UpdateSubscriptionAgreementsSchema } from "#validators/subscription/contract_characteristics/agreements.validator";

@inject()
export default class UpdateSubscriptionAgreementsController {
	constructor(protected subscriptionAgreementsService: SubscriptionAgreementsService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(
			UpdateSubscriptionAgreementsController.payloadSchema,
		);

		return this.subscriptionAgreementsService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateSubscriptionAgreementsSchema);
}
