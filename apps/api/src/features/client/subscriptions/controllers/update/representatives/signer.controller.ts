import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateSignerService from "#features/client/subscriptions/services/update/representatives/signer.service";
import Subscription from "#models/subscription";
import { SignerSchema } from "#validators/subscription/representatives/contact.validator";

@inject()
export default class UpdateSignerController {
	constructor(protected updateSignerService: UpdateSignerService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		const payload = await request.validateUsing(UpdateSignerController.payloadSchema);

		return this.updateSignerService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(SignerSchema);
}
