import { readFile } from "node:fs/promises";

import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismEmployeesService from "#features/client/subscriptions/services/update/formalism/employees.service";
import { formalismError } from "#features/client/subscriptions/services/update/formalism/formalism.service";
import Subscription from "#models/subscription";
import { ImportFormalismEmployeesSchema } from "#validators/subscription/formalism.validator";

@inject()
export default class ImportFormalismEmployeesController {
	constructor(
		protected subscriptionFormalismEmployeesService: SubscriptionFormalismEmployeesService,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const { file } = await request.validateUsing(ImportFormalismEmployeesController.payloadSchema);
		if (!file.tmpPath) formalismError("file", "Le fichier CSV n’a pas pu être lu.");
		return this.subscriptionFormalismEmployeesService.import(
			subscription,
			await readFile(file.tmpPath, "utf8"),
		);
	}

	static payloadSchema = vine.create(ImportFormalismEmployeesSchema);
}
