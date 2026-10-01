import { inject } from "@adonisjs/core";
import type { MultipartFile } from "@adonisjs/core/bodyparser";
import db from "@adonisjs/lucid/services/db";

import DocumentNotRequiredException from "#exceptions/document_not_required.exception";
import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import type File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { type SubscriptionDocumentType } from "#models/subscription_document";
import FileService from "#services/file.service";

@inject()
export default class UploadSubscriptionDocumentService {
	constructor(
		protected documentRequirementsService: SubscriptionDocumentRequirementsService,
		protected fileService: FileService,
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
	) {}

	async handle(params: {
		file: MultipartFile;
		ownerId?: number;
		subscription: Subscription;
		type: SubscriptionDocumentType;
	}) {
		const { file, ownerId, subscription, type } = params;
		const documentOwnerId = ownerId ?? null;
		const requirements = await this.documentRequirementsService.handle(subscription);

		const requirement = requirements.find(
			(item) => item.type === type && item.ownerId === documentOwnerId,
		);
		if (!requirement) throw new DocumentNotRequiredException();

		const uploadedFile = await this.fileService.upload({
			file,
			path: `subscriptions/${subscription.id}`,
		});
		let replacedFile: File | null = null;

		try {
			replacedFile = await db.transaction(async (trx) => {
				if (requirement.step === SubscriptionStep.CONTRACT_CHARACTERISTICS) {
					await Subscription.query({ client: trx })
						.where("id", subscription.id)
						.forUpdate()
						.firstOrFail();
					const currentRequirements = await this.documentRequirementsService.handle(subscription, {
						step: requirement.step,
						trx,
					});
					if (
						!currentRequirements.some(
							(item) => item.type === type && item.ownerId === documentOwnerId,
						)
					) {
						throw new DocumentNotRequiredException();
					}
					await this.validateSubscriptionStepService.invalidate(
						subscription,
						trx,
						requirement.step,
					);
				}
				const documentQuery = SubscriptionDocument.query({ client: trx })
					.where("subscriptionId", subscription.id)
					.where("type", type)
					.preload("file")
					.forUpdate();
				if (documentOwnerId === null) {
					documentQuery.whereNull("companyBeneficialOwnerId");
				} else {
					documentQuery.where("companyBeneficialOwnerId", documentOwnerId);
				}
				const existingDocument = await documentQuery.first();

				if (existingDocument) {
					const existingFile = existingDocument.file;
					await existingDocument.useTransaction(trx).merge({ fileId: uploadedFile.id }).save();
					return existingFile;
				}

				await SubscriptionDocument.create(
					{
						companyBeneficialOwnerId: documentOwnerId,
						fileId: uploadedFile.id,
						subscriptionId: subscription.id,
						type,
					},
					{ client: trx },
				);

				return null;
			});
		} catch (error) {
			await uploadedFile.delete();
			throw error;
		}

		if (replacedFile) await replacedFile.delete();

		return uploadedFile;
	}
}
