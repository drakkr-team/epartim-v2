import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import SubscriptionAccessPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionLegalIdentificationService from "#features/client/subscriptions/services/legal_identification.service";
import User from "#models/user";
import SubscriptionLegalIdentificationPresenter from "#presenters/subscription_legal_identification.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionLegalIdentificationService: SubscriptionLegalIdentificationService,
		protected subscriptionLegalIdentificationPresenter: SubscriptionLegalIdentificationPresenter,
	) {}

	async handle({ params, auth, bouncer }: HttpContext) {
		const subscription = await this.subscriptionLegalIdentificationService.getLegalIdentification(
			params.subscriptionId,
			(auth.user as User).id,
		);
		await bouncer.with(SubscriptionAccessPolicy).authorize("handle", subscription);

		return this.subscriptionLegalIdentificationPresenter.toJSON(subscription);
	}
}
