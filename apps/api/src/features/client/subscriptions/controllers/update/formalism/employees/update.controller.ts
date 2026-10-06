import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismEmployeesService from "#features/client/subscriptions/services/update/formalism/employees.service";
import Subscription from "#models/subscription";
import {
	UpdateFormalismPersonSchema,
	validateFormalismPersonId,
} from "#validators/subscription/formalism.validator";

@inject()
export default class UpdateFormalismEmployeeController {
	constructor(
		protected subscriptionFormalismEmployeesService: SubscriptionFormalismEmployeesService,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateFormalismEmployeeController.payloadSchema);
		return this.subscriptionFormalismEmployeesService.update(
			subscription,
			validateFormalismPersonId(params.employeeId),
			payload,
		);
	}

	static payloadSchema = vine.create(UpdateFormalismPersonSchema);
}
