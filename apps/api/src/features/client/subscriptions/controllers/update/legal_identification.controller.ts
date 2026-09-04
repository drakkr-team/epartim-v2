import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import SubscriptionAccessPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionLegalIdentificationService from "#features/client/subscriptions/services/legal_identification.service";
import User from "#models/user";
import { UpdateSubscriptionLegalIdentificationSchema } from "#validators/subscription_legal_identification.validator";

@inject()
export default class UpdateSubscriptionLegalIdentificationController {
	constructor(
		protected subscriptionLegalIdentificationService: SubscriptionLegalIdentificationService,
	) {}

	async handle({ params, request, auth, bouncer }: HttpContext) {
		const user = auth.user as User;
		const subscription = await this.subscriptionLegalIdentificationService.findForUserOrFail(
			params.subscriptionId,
			user.id,
		);
		await bouncer.with(SubscriptionAccessPolicy).authorize("handle", subscription);

		const payload = await request.validateUsing(
			UpdateSubscriptionLegalIdentificationController.payloadSchema,
		);

		return this.subscriptionLegalIdentificationService.updateLegalIdentification(
			params.subscriptionId,
			user.id,
			payload,
		);
	}

	static payloadSchema = vine.create(UpdateSubscriptionLegalIdentificationSchema);
}
