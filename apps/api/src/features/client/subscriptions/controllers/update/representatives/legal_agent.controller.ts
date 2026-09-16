import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateLegalAgentService from "#features/client/subscriptions/services/update/representatives/legal_agent.service";
import Subscription from "#models/subscription";
import { LegalAgentSchema } from "#validators/subscription/representatives/contact.validator";

@inject()
export default class UpdateLegalAgentController {
	constructor(protected updateLegalAgentService: UpdateLegalAgentService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		const payload = await request.validateUsing(UpdateLegalAgentController.payloadSchema);

		return this.updateLegalAgentService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(LegalAgentSchema);
}
