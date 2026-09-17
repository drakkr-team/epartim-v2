import db from "@adonisjs/lucid/services/db";

import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { type SubscriptionDocumentType } from "#models/subscription_document";

export default class DeleteSubscriptionDocumentService {
	async handle(params: { subscription: Subscription; type: SubscriptionDocumentType }) {
		const { subscription, type } = params;
		let fileId: number | null = null;

		await db.transaction(async (trx) => {
			const document = await SubscriptionDocument.query({ client: trx })
				.where("subscriptionId", subscription.id)
				.where("type", type)
				.preload("file")
				.forUpdate()
				.firstOrFail();

			fileId = document.fileId;
			await document.useTransaction(trx).delete();
		});

		const file = await File.findOrFail(fileId!);
		await file.delete();
	}
}
