import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { errors as vineErrors } from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import { isSubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Subscription from "#models/subscription";

@inject()
export default class ValidateSubscriptionStepController {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async handle({ bouncer, params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);

		const step = Number(params.step);
		if (!isSubscriptionStep(step)) {
			throw new vineErrors.E_VALIDATION_ERROR([
				{
					field: "step",
					message: "Cette étape n’est pas prise en charge.",
					rule: "enum",
				},
			]);
		}

		return this.validateSubscriptionStepService.handle(subscription);
	}
}
