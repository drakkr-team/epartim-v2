import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateAuthorizationsService from "#features/client/subscriptions/services/update/representatives/authorizations.service";
import Subscription from "#models/subscription";
import { UpdateAuthorizationsSchema } from "#validators/subscription/representatives/authorizations.validator";

@inject()
export default class UpdateAuthorizationsController {
	constructor(protected updateAuthorizationsService: UpdateAuthorizationsService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		const payload = await request.validateUsing(UpdateAuthorizationsController.payloadSchema);

		return this.updateAuthorizationsService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateAuthorizationsSchema);
}
