import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import InvalidDocumentTypeException from "#exceptions/invalid_document_type.exception";
import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import UploadSubscriptionDocumentService from "#features/client/subscriptions/services/documents/upload.service";
import Subscription from "#models/subscription";
import { isSubscriptionDocumentType } from "#models/subscription_document";
import { UploadSubscriptionDocumentSchema } from "#validators/subscription/document.validator";

@inject()
export default class UploadSubscriptionDocumentController {
	constructor(protected uploadSubscriptionDocumentService: UploadSubscriptionDocumentService) {}

	async handle({ bouncer, params, request, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);

		const documentType = Number(params.documentType);
		if (!isSubscriptionDocumentType(documentType)) {
			throw new InvalidDocumentTypeException();
		}

		const { file, query } = await request.validateUsing(
			UploadSubscriptionDocumentController.payloadSchema,
			{ data: { ...request.all(), query: request.qs() } },
		);
		const uploadedFile = await this.uploadSubscriptionDocumentService.handle({
			file,
			ownerId: query.ownerId,
			subscription,
			type: documentType,
		});

		return response.created({
			id: uploadedFile.id,
			name: uploadedFile.name,
			size: uploadedFile.size,
			type: uploadedFile.type,
		});
	}

	static payloadSchema = vine.create(UploadSubscriptionDocumentSchema);
}
