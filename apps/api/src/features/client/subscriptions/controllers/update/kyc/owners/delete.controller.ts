import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import KycOwnersService from "#features/client/subscriptions/services/update/kyc/owners.service";
import Subscription from "#models/subscription";

@inject()
export default class DeleteKycOwnerController {
	constructor(protected kycOwnersService: KycOwnersService) {}

	async handle({ bouncer, params, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		await this.kycOwnersService.delete(subscription, Number(params.ownerId));

		return response.noContent();
	}
}
