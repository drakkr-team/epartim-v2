import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import InvalidDocumentTypeException from "#exceptions/invalid_document_type.exception";
import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import DeleteSubscriptionDocumentService from "#features/client/subscriptions/services/documents/delete.service";
import Subscription from "#models/subscription";
import { isSubscriptionDocumentType } from "#models/subscription_document";

@inject()
export default class DeleteSubscriptionDocumentController {
	constructor(protected deleteSubscriptionDocumentService: DeleteSubscriptionDocumentService) {}

	async handle({ bouncer, params, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);

		if (!isSubscriptionDocumentType(params.documentType)) {
			throw new InvalidDocumentTypeException();
		}

		await this.deleteSubscriptionDocumentService.handle({
			subscription,
			type: params.documentType,
		});

		return response.noContent();
	}
}
