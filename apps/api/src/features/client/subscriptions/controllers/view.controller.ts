import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import SubscriptionAccessPolicy from "#features/client/subscriptions/policies/access.policy";
import Subscription from "#models/subscription";
import User from "#models/user";
import SubscriptionLegalIdentificationPresenter from "#presenters/subscription_legal_identification.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionLegalIdentificationPresenter: SubscriptionLegalIdentificationPresenter,
	) {}

	async handle({ params, auth, bouncer }: HttpContext) {
		const subscription = await Subscription.query()
			.where("id", params.subscriptionId)
			.where("createdBy", (auth.user as User).id)
			.firstOrFail();
		await subscription.load("company");
		await bouncer.with(SubscriptionAccessPolicy).authorize("handle", subscription);

		return this.subscriptionLegalIdentificationPresenter.toJSON(subscription);
	}
}
