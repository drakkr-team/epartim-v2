import { inject } from "@adonisjs/core";

import type Subscription from "#models/subscription";
import CompanyPresenter from "#presenters/company.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class SubscriptionLegalIdentificationPresenter {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
	) {}

	toJSON(subscription: Subscription) {
		return {
			...this.subscriptionPresenter.toJSON(subscription),
			legalIdentification: subscription.company
				? this.companyPresenter.toJSON(subscription.company)
				: null,
		};
	}
}
