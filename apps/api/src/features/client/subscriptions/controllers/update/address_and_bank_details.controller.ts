import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateAddressAndBankDetailsService from "#features/client/subscriptions/services/update/address_and_bank_details.service";
import Subscription from "#models/subscription";
import { UpdateAddressAndBankDetailsSchema } from "#validators/subscription/address_and_bank_details.validator";

@inject()
export default class UpdateAddressAndBankDetailsController {
	constructor(protected updateAddressAndBankDetailsService: UpdateAddressAndBankDetailsService) {}

	async handle({ params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);

		const payload = await request.validateUsing(
			UpdateAddressAndBankDetailsController.payloadSchema,
		);

		return this.updateAddressAndBankDetailsService.handle(subscription, payload);
	}

	static payloadSchema = vine.create(UpdateAddressAndBankDetailsSchema);
}
