import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import { SubscriptionAgreement } from "#constants/subscription_agreement";
import type { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";
import SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { UpdateSubscriptionContractCharacteristicsSchema } from "#validators/subscription/contract_characteristics.validator";

export type UpdateContractCharacteristicsPayload = Infer<
	typeof UpdateSubscriptionContractCharacteristicsSchema
>;

@inject()
export default class UpdateContractCharacteristicsService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async handle(subscription: Subscription, payload: UpdateContractCharacteristicsPayload) {
		let obsoleteFiles: File[] = [];
		const result = await db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();
			const plan = await SubscriptionPlan.firstOrCreate(
				{ subscriptionId: subscription.id },
				{
					existingDeviceTransfer: false,
					estimatedTransferAmountCents: null,
					otherAgreementDetails: null,
					minimumSeniorityMonths: null,
				},
				{ client: trx },
			);
			const {
				adhesionTypes,
				estimatedTransferAmount,
				existingDeviceTransfer,
				existingAgreements,
				otherAgreementDetails,
				minimumSeniorityMonths,
			} = payload.contractCharacteristics;

			plan.merge({
				...(otherAgreementDetails === undefined ? {} : { otherAgreementDetails }),
				...(minimumSeniorityMonths === undefined ? {} : { minimumSeniorityMonths }),
				...(existingDeviceTransfer === undefined ? {} : { existingDeviceTransfer }),
				...(estimatedTransferAmount === undefined
					? {}
					: {
							estimatedTransferAmountCents:
								estimatedTransferAmount === null
									? null
									: BigInt(Math.round(estimatedTransferAmount * 100)),
						}),
			});
			if (!plan.existingDeviceTransfer) {
				plan.estimatedTransferAmountCents = null;
			}
			if (existingAgreements !== undefined) {
				await this.#replaceExistingAgreements(subscription.id, existingAgreements, trx);
				obsoleteFiles = await this.#deleteInactiveAgreementDocuments(
					subscription.id,
					existingAgreements,
					trx,
				);
			}
			const agreements = await SubscriptionExistingAgreement.query({ client: trx })
				.where("subscriptionId", subscription.id)
				.orderBy("type");
			if (!agreements.some((agreement) => agreement.type === SubscriptionAgreement.OTHER)) {
				plan.otherAgreementDetails = null;
			}
			await plan.useTransaction(trx).save();

			if (adhesionTypes !== undefined) {
				await this.#replaceAdhesions(plan, adhesionTypes, trx);
			}
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_CHARACTERISTICS,
			);

			const adhesions = await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.orderBy("type");

			return { plan, adhesions, existingAgreements: agreements };
		});
		await Promise.all(obsoleteFiles.map((file) => file.delete()));
		return result;
	}

	async #replaceExistingAgreements(
		subscriptionId: number,
		agreementTypes: SubscriptionAgreement[],
		trx: TransactionClientContract,
	) {
		if (agreementTypes.length === 0) {
			await SubscriptionExistingAgreement.query({ client: trx })
				.where("subscriptionId", subscriptionId)
				.delete();
			return;
		}

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

	async #deleteInactiveAgreementDocuments(
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

	async #replaceAdhesions(
		plan: SubscriptionPlan,
		adhesionTypes: number[],
		trx: TransactionClientContract,
	) {
		const selectedAdhesionTypes = adhesionTypes as SubscriptionPlanAdhesionType[];

		if (adhesionTypes.length === 0) {
			await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.delete();
			return;
		}

		await SubscriptionPlanAdhesion.query({ client: trx })
			.where("subscriptionPlanId", plan.id)
			.whereNotIn("type", selectedAdhesionTypes)
			.delete();
		const existingAdhesions = await SubscriptionPlanAdhesion.query({ client: trx })
			.where("subscriptionPlanId", plan.id)
			.select("type");
		const existingTypes = new Set(existingAdhesions.map((adhesion) => adhesion.type));
		const additions = selectedAdhesionTypes.filter((type) => !existingTypes.has(type));

		if (additions.length > 0) {
			await SubscriptionPlanAdhesion.createMany(
				additions.map((type) => ({ subscriptionPlanId: plan.id, type })),
				{ client: trx },
			);
		}
	}
}
