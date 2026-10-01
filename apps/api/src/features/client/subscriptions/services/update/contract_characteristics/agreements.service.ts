import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import SubscriptionPlanService from "#features/client/subscriptions/services/update/contract_characteristics/plan.service";
import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";
import SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import { UpdateSubscriptionAgreementsSchema } from "#validators/subscription/contract_characteristics/agreements.validator";

export type UpdateSubscriptionAgreementsPayload = Infer<typeof UpdateSubscriptionAgreementsSchema>;

@inject()
export default class SubscriptionAgreementsService {
	constructor(
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
		protected subscriptionPlanService: SubscriptionPlanService,
	) {}

	async handle(subscription: Subscription, payload: UpdateSubscriptionAgreementsPayload) {
		let obsoleteFiles: File[] = [];
		const agreements = await db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();

			const plan = await this.subscriptionPlanService.getOrCreate(subscription.id, trx);
			if (payload.existingAgreements !== undefined) {
				obsoleteFiles = await this.#replace(subscription.id, payload.existingAgreements, trx);
			}
			if (payload.otherAgreementDetails !== undefined) {
				plan.otherAgreementDetails = payload.otherAgreementDetails;
			}

			const existingAgreements = await this.list(subscription.id, trx);
			if (!existingAgreements.some((agreement) => agreement.type === SubscriptionAgreement.OTHER)) {
				plan.otherAgreementDetails = null;
			}
			await plan.useTransaction(trx).save();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_CHARACTERISTICS,
			);

			return existingAgreements;
		});

		await Promise.all(obsoleteFiles.map((file) => file.delete()));
		return agreements;
	}

	async list(subscriptionId: number, trx: TransactionClientContract) {
		return SubscriptionExistingAgreement.query({ client: trx })
			.where("subscriptionId", subscriptionId)
			.orderBy("type");
	}

	async #replace(
		subscriptionId: number,
		agreementTypes: SubscriptionAgreement[],
		trx: TransactionClientContract,
	) {
		if (agreementTypes.length === 0) {
			await SubscriptionExistingAgreement.query({ client: trx })
				.where("subscriptionId", subscriptionId)
				.delete();
		} else {
			await SubscriptionExistingAgreement.query({ client: trx })
				.where("subscriptionId", subscriptionId)
				.whereNotIn("type", agreementTypes)
				.delete();
			const existingAgreements = await SubscriptionExistingAgreement.query({ client: trx })
				.where("subscriptionId", subscriptionId)
				.select("type");
			const existingTypes = new Set(existingAgreements.map((agreement) => agreement.type));
			const additions = agreementTypes.filter((type) => !existingTypes.has(type));

			if (additions.length > 0) {
				await SubscriptionExistingAgreement.createMany(
					additions.map((type) => ({ subscriptionId, type })),
					{ client: trx },
				);
			}
		}

		return this.#deleteInactiveDocuments(subscriptionId, agreementTypes, trx);
	}

	async #deleteInactiveDocuments(
		subscriptionId: number,
		existingAgreements: SubscriptionAgreement[],
		trx: TransactionClientContract,
	) {
		const inactiveTypes: SubscriptionDocumentType[] = [];

		if (!existingAgreements.includes(SubscriptionAgreement.PARTICIPATION)) {
			inactiveTypes.push(SubscriptionDocumentType.PARTICIPATION_AGREEMENT);
		}
		if (!existingAgreements.includes(SubscriptionAgreement.INCENTIVES)) {
			inactiveTypes.push(SubscriptionDocumentType.INCENTIVES_AGREEMENT);
		}
		if (!existingAgreements.includes(SubscriptionAgreement.PPV)) {
			inactiveTypes.push(SubscriptionDocumentType.PPV_AGREEMENT);
		}
		if (!existingAgreements.includes(SubscriptionAgreement.PPVE)) {
			inactiveTypes.push(SubscriptionDocumentType.PPVE_AGREEMENT);
		}
		if (!existingAgreements.includes(SubscriptionAgreement.OTHER)) {
			inactiveTypes.push(SubscriptionDocumentType.OTHER_AGREEMENT);
		}

		if (inactiveTypes.length === 0) return [];
		const documents = await SubscriptionDocument.query({ client: trx })
			.where("subscriptionId", subscriptionId)
			.whereIn("type", inactiveTypes)
			.preload("file");
		await Promise.all(documents.map((document) => document.useTransaction(trx).delete()));
		return documents.map((document) => document.file);
	}
}
