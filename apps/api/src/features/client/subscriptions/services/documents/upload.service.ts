import { inject } from "@adonisjs/core";
import type { MultipartFile } from "@adonisjs/core/bodyparser";
import db from "@adonisjs/lucid/services/db";

import DocumentNotRequiredException from "#exceptions/document_not_required.exception";
import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import type File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { type SubscriptionDocumentType } from "#models/subscription_document";
import FileService from "#services/file.service";

@inject()
export default class UploadSubscriptionDocumentService {
	constructor(
		protected documentRequirementsService: SubscriptionDocumentRequirementsService,
		protected fileService: FileService,
	) {}

	async handle(params: {
		file: MultipartFile;
		subscription: Subscription;
		type: SubscriptionDocumentType;
	}) {
		const { file, subscription, type } = params;
		const requirements = await this.documentRequirementsService.handle(subscription);

		if (!requirements.some((requirement) => requirement.type === type)) {
			throw new DocumentNotRequiredException();
		}

		const uploadedFile = await this.fileService.upload({
			file,
			path: `subscriptions/${subscription.id}`,
		});
		let replacedFile: File | null = null;

		try {
			replacedFile = await db.transaction(async (trx) => {
				const existingDocument = await SubscriptionDocument.query({ client: trx })
					.where("subscriptionId", subscription.id)
					.where("type", type)
					.preload("file")
					.forUpdate()
					.first();

				if (existingDocument) {
					const existingFile = existingDocument.file;
					await existingDocument.useTransaction(trx).merge({ fileId: uploadedFile.id }).save();
					return existingFile;
				}

				await SubscriptionDocument.create(
					{ fileId: uploadedFile.id, subscriptionId: subscription.id, type },
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
