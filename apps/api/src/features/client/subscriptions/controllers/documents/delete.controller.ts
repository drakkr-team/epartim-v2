import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import InvalidDocumentTypeException from "#exceptions/invalid_document_type.exception";
import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import DeleteSubscriptionDocumentService from "#features/client/subscriptions/services/documents/delete.service";
import Subscription from "#models/subscription";
import { isSubscriptionDocumentType } from "#models/subscription_document";
import { DeleteSubscriptionDocumentSchema } from "#validators/subscription/document.validator";

@inject()
export default class DeleteSubscriptionDocumentController {
	constructor(protected deleteSubscriptionDocumentService: DeleteSubscriptionDocumentService) {}

	async handle({ bouncer, params, request, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);

		const documentType = Number(params.documentType);
		if (!isSubscriptionDocumentType(documentType)) {
			throw new InvalidDocumentTypeException();
		}
		const { query } = await request.validateUsing(
			DeleteSubscriptionDocumentController.payloadSchema,
			{
				data: { query: request.qs() },
			},
		);

		await this.deleteSubscriptionDocumentService.handle({
			ownerId: query.ownerId,
			subscription,
			type: documentType,
		});

		return response.noContent();
	}

	static payloadSchema = vine.create(DeleteSubscriptionDocumentSchema);
}
