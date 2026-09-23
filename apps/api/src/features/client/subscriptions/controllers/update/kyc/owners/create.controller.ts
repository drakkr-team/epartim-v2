import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import KycOwnersService from "#features/client/subscriptions/services/update/kyc/owners.service";
import Subscription from "#models/subscription";
import CompanyBeneficialOwnerPresenter from "#presenters/company_beneficial_owner.presenter";

@inject()
export default class CreateKycOwnerController {
	constructor(
		protected kycOwnersService: KycOwnersService,
		protected companyBeneficialOwnerPresenter: CompanyBeneficialOwnerPresenter,
	) {}

	async handle({ bouncer, params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const owner = await this.kycOwnersService.create(subscription);
		const [address, roles] = await Promise.all([
			owner.related("address").query().firstOrFail(),
			owner.related("roles").query(),
		]);

		return this.companyBeneficialOwnerPresenter.toJSON(owner, address, roles);
	}
}
