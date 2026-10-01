import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import UpdateKycProfileService from "#features/client/subscriptions/services/update/kyc/profile.service";
import Subscription from "#models/subscription";
import CompanyKycProfilePresenter from "#presenters/company_kyc_profile.presenter";
import { UpdateKycProfileSchema } from "#validators/subscription/kyc/profile.validator";

@inject()
export default class UpdateKycProfileController {
	constructor(
		protected updateKycProfileService: UpdateKycProfileService,
		protected companyKycProfilePresenter: CompanyKycProfilePresenter,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(UpdateKycProfileController.payloadSchema);
		const profile = await this.updateKycProfileService.handle(subscription, payload);

		return this.companyKycProfilePresenter.toJSON(profile);
	}

	static payloadSchema = vine.create(UpdateKycProfileSchema);
}
