import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";
import { DateTime } from "luxon";

import {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "#constants/subscription_matching";
import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { UpdateSubscriptionPlanSchema } from "#validators/subscription/contract_characteristics/plan.validator";

export type UpdateSubscriptionPlanPayload = Infer<typeof UpdateSubscriptionPlanSchema>;

@inject()
export default class SubscriptionPlanService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async handle(subscription: Subscription, payload: UpdateSubscriptionPlanPayload) {
		return db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();

			const plan = await this.getOrCreate(subscription.id, trx);
			if (Object.keys(payload).some((field) => field.startsWith("voluntaryParticipation"))) {
				const adhesion = await SubscriptionPlanAdhesion.query({ client: trx })
					.where("subscriptionPlanId", plan.id)
					.where("type", SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT)
					.first();
				if (!adhesion)
					throw new ValidationError([
						{
							field: "voluntaryParticipationDuration",
							message: "Sélectionnez d’abord l’accord de participation volontaire.",
							rule: "adhesion",
						},
					]);
			}
			this.applyChanges(plan, payload);
			await plan.useTransaction(trx).save();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_CHARACTERISTICS,
			);

			return plan;
		});
	}

	async getOrCreate(subscriptionId: number, trx: TransactionClientContract) {
		return SubscriptionPlan.firstOrCreate(
			{ subscriptionId },
			{
				existingDeviceTransfer: false,
				estimatedTransferAmountCents: null,
				otherAgreementDetails: null,
				minimumSeniorityMonths: null,
				matchingCalculationMethod: SubscriptionMatchingCalculationMethod.AMUNDI,
				matchingDistributionPeriod: SubscriptionMatchingDistributionPeriod.YEARS,
				voluntaryPaymentsLimitedToPeriod: false,
				voluntaryPaymentPeriodStartDate: null,
				voluntaryPaymentPeriodEndDate: null,
			},
			{ client: trx },
		);
	}

	applyChanges(plan: SubscriptionPlan, payload: UpdateSubscriptionPlanPayload) {
		const {
			estimatedTransferAmount,
			existingDeviceTransfer,
			matchingCalculationMethod,
			matchingDistributionPeriod,
			minimumSeniorityMonths,
			voluntaryPaymentsLimitedToPeriod,
			voluntaryPaymentPeriodEndDate,
			voluntaryPaymentPeriodStartDate,
		} = payload;

		plan.merge({
			...(payload.voluntaryParticipationDuration === undefined
				? {}
				: { voluntaryParticipationDuration: payload.voluntaryParticipationDuration }),
			...(payload.voluntaryParticipationMinimumSeniorityMonths === undefined
				? {}
				: {
						voluntaryParticipationMinimumSeniorityMonths:
							payload.voluntaryParticipationMinimumSeniorityMonths,
					}),
			...(payload.voluntaryParticipationFormula === undefined
				? {}
				: { voluntaryParticipationFormula: payload.voluntaryParticipationFormula }),
			...(payload.voluntaryParticipationStartDate === undefined
				? {}
				: {
						voluntaryParticipationStartDate: payload.voluntaryParticipationStartDate
							? DateTime.fromISO(payload.voluntaryParticipationStartDate)
							: null,
					}),
			...(payload.voluntaryParticipationEndDate === undefined
				? {}
				: {
						voluntaryParticipationEndDate: payload.voluntaryParticipationEndDate
							? DateTime.fromISO(payload.voluntaryParticipationEndDate)
							: null,
					}),
			...(payload.voluntaryParticipationSalaryPercentage === undefined
				? {}
				: {
						voluntaryParticipationSalaryBasisPoints:
							payload.voluntaryParticipationSalaryPercentage === null
								? null
								: Math.round(payload.voluntaryParticipationSalaryPercentage * 100),
					}),
			...(payload.voluntaryParticipationPresencePercentage === undefined
				? {}
				: {
						voluntaryParticipationPresenceBasisPoints:
							payload.voluntaryParticipationPresencePercentage === null
								? null
								: Math.round(payload.voluntaryParticipationPresencePercentage * 100),
					}),
			...(payload.voluntaryParticipationEqualPercentage === undefined
				? {}
				: {
						voluntaryParticipationEqualBasisPoints:
							payload.voluntaryParticipationEqualPercentage === null
								? null
								: Math.round(payload.voluntaryParticipationEqualPercentage * 100),
					}),
			...(minimumSeniorityMonths === undefined ? {} : { minimumSeniorityMonths }),
			...(matchingCalculationMethod === undefined ? {} : { matchingCalculationMethod }),
			...(matchingDistributionPeriod === undefined ? {} : { matchingDistributionPeriod }),
			...(existingDeviceTransfer === undefined ? {} : { existingDeviceTransfer }),
			...(estimatedTransferAmount === undefined
				? {}
				: {
						estimatedTransferAmountCents:
							estimatedTransferAmount === null
								? null
								: BigInt(Math.round(estimatedTransferAmount * 100)),
					}),
			...(voluntaryPaymentsLimitedToPeriod === undefined
				? {}
				: { voluntaryPaymentsLimitedToPeriod }),
			...(voluntaryPaymentPeriodStartDate === undefined
				? {}
				: {
						voluntaryPaymentPeriodStartDate: voluntaryPaymentPeriodStartDate
							? DateTime.fromISO(voluntaryPaymentPeriodStartDate)
							: null,
					}),
			...(voluntaryPaymentPeriodEndDate === undefined
				? {}
				: {
						voluntaryPaymentPeriodEndDate: voluntaryPaymentPeriodEndDate
							? DateTime.fromISO(voluntaryPaymentPeriodEndDate)
							: null,
					}),
		});
		this.#applyRules(plan);
	}

	clearVoluntaryParticipation(plan: SubscriptionPlan) {
		plan.merge({
			voluntaryParticipationDuration: null,
			voluntaryParticipationStartDate: null,
			voluntaryParticipationEndDate: null,
			voluntaryParticipationMinimumSeniorityMonths: null,
			voluntaryParticipationSalaryBasisPoints: null,
			voluntaryParticipationPresenceBasisPoints: null,
			voluntaryParticipationEqualBasisPoints: null,
			voluntaryParticipationFormula: null,
		});
	}

	#applyRules(plan: SubscriptionPlan) {
		if (
			plan.voluntaryParticipationStartDate &&
			plan.voluntaryParticipationEndDate &&
			plan.voluntaryParticipationEndDate <= plan.voluntaryParticipationStartDate
		) {
			throw new ValidationError([
				{
					field: "voluntaryParticipationEndDate",
					message: "La date de clôture doit être strictement postérieure à la date d’ouverture.",
					rule: "after",
				},
			]);
		}
		if (!plan.existingDeviceTransfer) {
			plan.estimatedTransferAmountCents = null;
		}
		if (!plan.voluntaryPaymentsLimitedToPeriod) {
			plan.voluntaryPaymentPeriodStartDate = null;
			plan.voluntaryPaymentPeriodEndDate = null;
		}
		if (
			plan.voluntaryPaymentPeriodStartDate &&
			plan.voluntaryPaymentPeriodEndDate &&
			plan.voluntaryPaymentPeriodEndDate < plan.voluntaryPaymentPeriodStartDate
		) {
			throw new ValidationError([
				{
					field: "voluntaryPaymentPeriodEndDate",
					message: "La date de fin doit être postérieure ou égale à la date de début.",
					rule: "afterOrEqual",
				},
			]);
		}
	}
}
