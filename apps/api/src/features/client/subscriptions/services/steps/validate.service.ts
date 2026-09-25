import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";

import { MinimumSeniorityMonths, SubscriptionAgreement } from "#constants/subscription_agreement";
import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";

@inject()
export default class ValidateSubscriptionStepService {
	constructor(protected documentRequirementsService: SubscriptionDocumentRequirementsService) {}

	async handle(subscription: Subscription, step: SubscriptionStep) {
		return db.transaction(async (trx) => {
			const lockedSubscription = await this.#findForUpdate(subscription.id, trx);
			if (step === SubscriptionStep.COMPANY_REFERENCES) {
				await this.#validateDocuments(lockedSubscription, trx, step);
			}
			if (step === SubscriptionStep.KYC) {
				await this.#validateDocuments(lockedSubscription, trx, step);
			}
			if (step === SubscriptionStep.CONTRACT_CHARACTERISTICS) {
				await this.#validateContractCharacteristics(lockedSubscription, trx);
				await this.#validateDocuments(lockedSubscription, trx, step);
			}

			const completedSteps = this.#normalizeCompletedSteps(lockedSubscription.completedSteps, step);
			await lockedSubscription.useTransaction(trx).merge({ completedSteps }).save();

			return lockedSubscription;
		});
	}

	async invalidate(
		subscription: Subscription,
		trx: TransactionClientContract,
		step: SubscriptionStep,
	) {
		const lockedSubscription = await this.#findForUpdate(subscription.id, trx);
		const completedSteps = this.#normalizeCompletedSteps(lockedSubscription.completedSteps);
		if (!completedSteps.includes(step)) return;

		await lockedSubscription
			.useTransaction(trx)
			.merge({
				completedSteps: completedSteps.filter((completedStep) => completedStep !== step),
			})
			.save();
	}

	async #validateDocuments(
		subscription: Subscription,
		trx: TransactionClientContract,
		step: SubscriptionStep,
	) {
		const requirements = await this.documentRequirementsService.handle(subscription, { step, trx });
		const errors = requirements.flatMap((requirement) =>
			requirement.document
				? []
				: [
						{
							field: `documents.${requirement.type}.${requirement.ownerId ?? "subscription"}`,
							message: "Ce document est obligatoire.",
							rule: "required",
						},
					],
		);
		if (errors.length > 0) throw new ValidationError(errors);
	}

	async #validateContractCharacteristics(
		subscription: Subscription,
		trx: TransactionClientContract,
	) {
		const plan = await SubscriptionPlan.query({ client: trx })
			.where("subscriptionId", subscription.id)
			.preload("adhesions")
			.first();
		const errors = [];
		if (!plan?.adhesions.length) {
			errors.push({
				field: "contractCharacteristics.adhesionTypes",
				message: "Sélectionnez au moins une adhésion.",
				rule: "required",
			});
		}
		if (!MinimumSeniorityMonths.some((months) => months === plan?.minimumSeniorityMonths)) {
			errors.push({
				field: "contractCharacteristics.minimumSeniorityMonths",
				message: "Sélectionnez une ancienneté minimale.",
				rule: "required",
			});
		}
		if (
			plan?.existingAgreements.includes(SubscriptionAgreement.OTHER) &&
			!plan.otherAgreementDetails?.trim()
		) {
			errors.push({
				field: "contractCharacteristics.otherAgreementDetails",
				message: "Détaillez l’autre accord existant.",
				rule: "required",
			});
		}
		if (errors.length > 0) throw new ValidationError(errors);
	}

	async #findForUpdate(subscriptionId: number, trx: TransactionClientContract) {
		return Subscription.query({ client: trx })
			.where("id", subscriptionId)
			.forUpdate()
			.firstOrFail();
	}

	#normalizeCompletedSteps(completedSteps: unknown[] | null, nextStep?: SubscriptionStep) {
		const steps =
			completedSteps?.filter((step): step is SubscriptionStep => Number.isInteger(step)) ?? [];
		if (nextStep !== undefined) steps.push(nextStep);

		return [...new Set(steps)].sort((firstStep, secondStep) => firstStep - secondStep);
	}
}
