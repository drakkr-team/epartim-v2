import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";

import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import Subscription from "#models/subscription";

@inject()
export default class ValidateSubscriptionStepService {
	constructor(protected documentRequirementsService: SubscriptionDocumentRequirementsService) {}

	async handle(subscription: Subscription) {
		return db.transaction(async (trx) => {
			const lockedSubscription = await this.#findForUpdate(subscription.id, trx);
			const requirements = await this.documentRequirementsService.handle(lockedSubscription, {
				trx,
			});
			const errors = requirements.flatMap((requirement) =>
				requirement.document
					? []
					: [
							{
								field: `documents.${requirement.type}`,
								message: "Ce document est obligatoire.",
								rule: "required",
							},
						],
			);
			if (errors.length > 0) throw new ValidationError(errors);

			const completedSteps = this.#normalizeCompletedSteps(
				lockedSubscription.completedSteps,
				SubscriptionStep.COMPANY_REFERENCES,
			);
			await lockedSubscription.useTransaction(trx).merge({ completedSteps }).save();

			return lockedSubscription;
		});
	}

	async invalidate(subscription: Subscription, trx: TransactionClientContract) {
		const lockedSubscription = await this.#findForUpdate(subscription.id, trx);
		const completedSteps = this.#normalizeCompletedSteps(lockedSubscription.completedSteps);
		if (!completedSteps.includes(SubscriptionStep.COMPANY_REFERENCES)) return;

		await lockedSubscription
			.useTransaction(trx)
			.merge({
				completedSteps: completedSteps.filter(
					(completedStep) => completedStep !== SubscriptionStep.COMPANY_REFERENCES,
				),
			})
			.save();
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
