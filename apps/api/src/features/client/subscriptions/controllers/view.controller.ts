import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import SubscriptionAccessPolicy from "#features/client/subscriptions/policies/access.policy";
import Subscription from "#models/subscription";
import CompanyPresenter from "#presenters/company.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(SubscriptionAccessPolicy).authorize("handle", subscription);
		await subscription.load("company");

		return {
			...this.subscriptionPresenter.toJSON(subscription),
			legalIdentification: this.companyPresenter.toJSON(subscription.company),
		};
	}
}
