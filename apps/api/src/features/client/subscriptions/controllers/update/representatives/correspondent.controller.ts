import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateCorrespondentService from "#features/client/subscriptions/services/update/representatives/correspondent.service";
import Subscription from "#models/subscription";
import { UpdateCorrespondentSchema } from "#validators/subscription/representatives/correspondent.validator";

@inject()
export default class UpdateCorrespondentController {
	constructor(protected updateCorrespondentService: UpdateCorrespondentService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		const payload = await request.validateUsing(UpdateCorrespondentController.payloadSchema);

		return this.updateCorrespondentService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateCorrespondentSchema);
}
