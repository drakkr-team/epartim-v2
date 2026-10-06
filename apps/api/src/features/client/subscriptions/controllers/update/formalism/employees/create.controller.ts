import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismEmployeesService from "#features/client/subscriptions/services/update/formalism/employees.service";
import Subscription from "#models/subscription";

@inject()
export default class CreateFormalismEmployeeController {
	constructor(
		protected subscriptionFormalismEmployeesService: SubscriptionFormalismEmployeesService,
	) {}

	async handle({ bouncer, params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		return this.subscriptionFormalismEmployeesService.create(subscription);
	}
}
