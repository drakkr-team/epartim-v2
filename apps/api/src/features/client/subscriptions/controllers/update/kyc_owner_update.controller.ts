import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import KycOwnersService from "#features/client/subscriptions/services/update/kyc_owners.service";
import Subscription from "#models/subscription";
import CompanyBeneficialOwnerPresenter from "#presenters/company_beneficial_owner.presenter";
import { UpdateKycOwnerSchema } from "#validators/subscription/kyc_owner.validator";

@inject()
export default class UpdateKycOwnerController {
	constructor(
		protected kycOwnersService: KycOwnersService,
		protected companyBeneficialOwnerPresenter: CompanyBeneficialOwnerPresenter,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateKycOwnerController.payloadSchema);
		const owner = await this.kycOwnersService.update(subscription, Number(params.ownerId), payload);
		await owner.load("address");
		await owner.load("roles");

		return this.companyBeneficialOwnerPresenter.toJSON(owner, owner.address, owner.roles);
	}

	static payloadSchema = vine.create(UpdateKycOwnerSchema);
}
