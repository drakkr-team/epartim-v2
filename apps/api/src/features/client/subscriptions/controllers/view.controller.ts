import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import Subscription from "#models/subscription";
import CompanyPresenter from "#presenters/company.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
	) {}

	async handle({ params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await subscription.load("company");

		return {
			...this.subscriptionPresenter.toJSON(subscription),
			legalIdentification: this.companyPresenter.toJSON(subscription.company),
		};
	}
}
