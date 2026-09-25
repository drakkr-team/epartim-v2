import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";

import DocumentNotRequiredException from "#exceptions/document_not_required.exception";
import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { type SubscriptionDocumentType } from "#models/subscription_document";

@inject()
export default class DeleteSubscriptionDocumentService {
	constructor(
		protected documentRequirementsService: SubscriptionDocumentRequirementsService,
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
	) {}

	async handle(params: {
		ownerId?: number;
		subscription: Subscription;
		type: SubscriptionDocumentType;
	}) {
		const { ownerId, subscription, type } = params;
		const documentOwnerId = ownerId ?? null;
		let fileId: number | null = null;

		await db.transaction(async (trx) => {
			const requirements = await this.documentRequirementsService.handle(subscription, { trx });
			const requirement = requirements.find(
				(item) => item.ownerId === documentOwnerId && item.type === type,
			);
			if (!requirement) throw new DocumentNotRequiredException();
			if (requirement.step === SubscriptionStep.CONTRACT_CHARACTERISTICS) {
				await Subscription.query({ client: trx })
					.where("id", subscription.id)
					.forUpdate()
					.firstOrFail();
			}

			const documentQuery = SubscriptionDocument.query({ client: trx })
				.where("subscriptionId", subscription.id)
				.where("type", type)
				.preload("file")
				.forUpdate();
			if (documentOwnerId === null) {
				await documentQuery.whereNull("companyBeneficialOwnerId");
			} else {
				await documentQuery.where("companyBeneficialOwnerId", documentOwnerId);
			}
			const document = await documentQuery.firstOrFail();

			fileId = document.fileId;
			await document.useTransaction(trx).delete();
			await this.validateSubscriptionStepService.invalidate(subscription, trx, requirement.step);
		});

		const file = await File.findOrFail(fileId!);
		await file.delete();
	}
}
