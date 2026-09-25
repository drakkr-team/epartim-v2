import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import type Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion, {
	type SubscriptionPlanAdhesionType,
} from "#models/subscription_plan_adhesion";
import { UpdateSubscriptionPlansSchema } from "#validators/subscription/plans.validator";

export type UpdateSubscriptionPlansPayload = Infer<typeof UpdateSubscriptionPlansSchema>;

export default class UpdateSubscriptionPlansService {
	async handle(subscription: Subscription, payload: UpdateSubscriptionPlansPayload) {
		return db.transaction(async (trx) => {
			const plan = await SubscriptionPlan.firstOrCreate(
				{ subscriptionId: subscription.id },
				{ existingDeviceTransfer: false },
				{ client: trx },
			);
			const { adhesionTypes, estimatedTransferAmount, existingDeviceTransfer } =
				payload.contractCharacteristics;

			plan.merge({
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
			await plan.useTransaction(trx).save();

			if (adhesionTypes !== undefined) {
				await this.#replaceAdhesions(plan, adhesionTypes, trx);
			}

			const adhesions = await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.orderBy("type");

			return { plan, adhesions };
		});
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
