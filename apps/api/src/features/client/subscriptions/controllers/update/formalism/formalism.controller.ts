import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismService from "#features/client/subscriptions/services/update/formalism/formalism.service";
import Subscription from "#models/subscription";
import {
	UpdateFormalismGroupSchema,
	validateFormalismGroup,
} from "#validators/subscription/formalism.validator";

@inject()
export default class UpdateFormalismController {
	constructor(protected subscriptionFormalismService: SubscriptionFormalismService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const group = validateFormalismGroup(params.group);
		const payload = await request.validateUsing(UpdateFormalismController.payloadSchema);
		return this.subscriptionFormalismService.update(subscription, group, payload);
	}

	static payloadSchema = vine.create(UpdateFormalismGroupSchema);
}
