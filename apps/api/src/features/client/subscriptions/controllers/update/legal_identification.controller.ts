import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateLegalIdentificationService from "#features/client/subscriptions/services/update/legal_identification.service";
import Subscription from "#models/subscription";
import { UpdateLegalIdentificationSchema } from "#validators/subscription/legal_identification.validator";

@inject()
export default class UpdateSubscriptionLegalIdentificationController {
	constructor(protected updateLegalIdentificationService: UpdateLegalIdentificationService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);

		const payload = await request.validateUsing(
			UpdateSubscriptionLegalIdentificationController.payloadSchema,
		);

		return this.updateLegalIdentificationService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateLegalIdentificationSchema);
}
