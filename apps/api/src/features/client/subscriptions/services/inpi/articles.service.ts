import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import DocumentReplacementConfirmationRequiredException from "#exceptions/document_replacement_confirmation_required.exception";
import InpiDocumentUnavailableException from "#exceptions/inpi_document_unavailable.exception";
import InpiPreviewExpiredException from "#exceptions/inpi_preview_expired.exception";
import ChangeSubscriptionCompanyService from "#features/client/subscriptions/services/company_change.service";
import SubscriptionEditLockService from "#features/client/subscriptions/services/edit_lock.service";
import PreviewSubscriptionInpiService from "#features/client/subscriptions/services/inpi/preview.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Company from "#models/company";
import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";
import FileService from "#services/file.service";
import InpiClientService from "#services/inpi/client.service";
import InpiMapperService from "#services/inpi/mapper.service";
import { ImportSubscriptionInpiArticlesSchema } from "#validators/subscription/inpi.validator";

@inject()
export default class SubscriptionInpiArticlesService {
	constructor(
		protected previewService: PreviewSubscriptionInpiService,
		protected editLockService: SubscriptionEditLockService,
		protected client: InpiClientService,
		protected mapper: InpiMapperService,
		protected fileService: FileService,
		protected companyChangeService: ChangeSubscriptionCompanyService,
		protected validateStepService: ValidateSubscriptionStepService,
	) {}

	async preview(subscription: Subscription, previewId: string, actId: string) {
		this.companyChangeService.assertEditable(subscription);
		const preview = await this.previewService.find(subscription.id, previewId);
		if (!preview.articles.some((article) => article.id === actId))
			throw new InpiDocumentUnavailableException();
		const article = this.mapper.article(await this.client.article(actId), preview.siren);
		if (!article) throw new InpiDocumentUnavailableException();
		return { article, buffer: await this.client.download(actId) };
	}

	async import(
		subscription: Subscription,
		payload: Infer<typeof ImportSubscriptionInpiArticlesSchema>,
	) {
		this.companyChangeService.assertEditable(subscription);
		const { article, buffer } = await this.preview(subscription, payload.previewId, payload.actId);
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		if (company.siren !== article.siren) throw new InpiPreviewExpiredException();
		const existing = await SubscriptionDocument.query()
			.where("subscriptionId", subscription.id)
			.where("type", SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION)
			.whereNull("companyBeneficialOwnerId")
			.preload("file")
			.first();
		if (existing?.inpiActId === article.id && existing.inpiSiren === article.siren)
			return existing.file;
		if (existing && !payload.replaceExisting)
			throw new DocumentReplacementConfirmationRequiredException();
		const file = await this.fileService.uploadPdf({
			buffer,
			name: `statuts_${article.siren}.pdf`,
			path: `subscriptions/${subscription.id}`,
		});
		try {
			await db.transaction(async (trx) => {
				const locked = await Subscription.query({ client: trx })
					.where("id", subscription.id)
					.forUpdate()
					.firstOrFail();
				this.companyChangeService.assertEditable(locked);
				const currentCompany = await Company.findByOrFail("subscriptionId", locked.id, {
					client: trx,
				});
				if (currentCompany.siren !== article.siren) throw new InpiPreviewExpiredException();
				if (existing)
					await existing
						.useTransaction(trx)
						.merge({ fileId: file.id, inpiActId: article.id, inpiSiren: article.siren })
						.save();
				else
					await SubscriptionDocument.create(
						{
							subscriptionId: locked.id,
							type: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
							fileId: file.id,
							inpiActId: article.id,
							inpiSiren: article.siren,
						},
						{ client: trx },
					);
				await this.validateStepService.invalidate(locked, trx, SubscriptionStep.COMPANY_REFERENCES);
			});
		} catch (error) {
			await file.delete();
			throw error;
		}
		if (existing) await existing.file.delete();
		return file;
	}

	async removeWithdrawnCopies() {
		const documents = await SubscriptionDocument.query()
			.whereNotNull("inpiActId")
			.whereNotNull("inpiSiren");
		let removed = 0;
		for (const document of documents) {
			// Only an explicit withdrawal for this exact act authorizes deletion.
			const metadata = await this.client.article(document.inpiActId!);
			if (!this.mapper.withdrawn(metadata, document.inpiActId!, document.inpiSiren!)) continue;
			await this.editLockService.handle(document.subscriptionId, async () => {
				const file = await db.transaction(async (trx) => {
					const subscription = await Subscription.query({ client: trx })
						.where("id", document.subscriptionId)
						.forUpdate()
						.firstOrFail();
					const current = await SubscriptionDocument.query({ client: trx })
						.where("id", document.id)
						.where("fileId", document.fileId)
						.where("inpiActId", document.inpiActId!)
						.forUpdate()
						.first();
					if (!current) return null;
					const file = await File.findOrFail(current.fileId, { client: trx });
					await current.delete();
					await this.validateStepService.invalidate(
						subscription,
						trx,
						SubscriptionStep.COMPANY_REFERENCES,
					);
					await Subscription.query({ client: trx })
						.where("id", subscription.id)
						.increment("editRevision", 1);
					return file;
				});
				if (file) {
					await file.delete();
					removed++;
				}
			});
		}
		return removed;
	}
}
