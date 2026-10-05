import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismEmployeesService from "#features/client/subscriptions/services/update/formalism/employees.service";
import Subscription from "#models/subscription";
import { validateFormalismPersonId } from "#validators/subscription/formalism.validator";

@inject()
export default class DeleteFormalismEmployeeController {
	constructor(protected service: SubscriptionFormalismEmployeesService) {}
	async handle({ bouncer, params, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		await this.service.delete(subscription, await validateFormalismPersonId(params.employeeId));
		return response.noContent();
	}
}
