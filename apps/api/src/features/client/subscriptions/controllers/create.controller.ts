import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import CreateSubscriptionPolicy from "#features/client/subscriptions/policies/create.policy";
import SubscriptionLegalIdentificationService from "#features/client/subscriptions/services/legal_identification.service";
import User from "#models/user";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class CreateSubscriptionController {
	constructor(
		protected subscriptionLegalIdentificationService: SubscriptionLegalIdentificationService,
		protected subscriptionPresenter: SubscriptionPresenter,
	) {}

	async handle({ auth, bouncer, response }: HttpContext) {
		const user = auth.user as User;
		await bouncer.with(CreateSubscriptionPolicy).authorize("handle");

		const subscription = await this.subscriptionLegalIdentificationService.createDraft(user.id);

		return response.created(this.subscriptionPresenter.toJSON(subscription));
	}
}
