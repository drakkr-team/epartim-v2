import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateRepresentativesAndAuthorizationsService from "#features/client/subscriptions/services/update/representatives_and_authorizations.service";
import Subscription from "#models/subscription";
import { UpdateRepresentativesAndAuthorizationsSchema } from "#validators/subscription/representatives_and_authorizations.validator";

@inject()
export default class UpdateRepresentativesAndAuthorizationsController {
	constructor(
		protected updateRepresentativesAndAuthorizationsService: UpdateRepresentativesAndAuthorizationsService,
	) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		const payload = await request.validateUsing(
			UpdateRepresentativesAndAuthorizationsController.payloadSchema,
		);

		return this.updateRepresentativesAndAuthorizationsService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateRepresentativesAndAuthorizationsSchema);
}
