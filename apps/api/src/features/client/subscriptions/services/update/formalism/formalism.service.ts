import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";
import { DateTime } from "luxon";

import {
	getActiveFormalismGroups,
	getAvailableFormalismMethods,
	type SubscriptionFormalismGroup,
	SubscriptionFormalismMethod,
} from "#constants/subscription_formalism";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Company from "#models/company";
import Subscription from "#models/subscription";
import SubscriptionCseMember from "#models/subscription_cse_member";
import SubscriptionFormalism from "#models/subscription_formalism";
import SubscriptionFormalismEmployee from "#models/subscription_formalism_employee";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import {
	presentFormalism,
	presentFormalismGroup,
} from "#presenters/subscription_formalism.presenter";
import type { UpdateFormalismGroupSchema } from "#validators/subscription/formalism.validator";

export type UpdateFormalismGroupPayload = Infer<typeof UpdateFormalismGroupSchema>;

export function formalismError(field: string, message: string): never {
	throw new ValidationError([{ field, message, rule: "formalism" }]);
}

@inject()
export default class SubscriptionFormalismService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async lock(subscription: Subscription, trx: TransactionClientContract) {
		await Subscription.query({ client: trx })
			.where("id", subscription.id)
			.forUpdate()
			.firstOrFail();
	}

	async context(subscriptionId: number, trx: TransactionClientContract) {
		const company = await Company.findBy("subscriptionId", subscriptionId, { client: trx });
		const adhesions = await SubscriptionPlanAdhesion.query({ client: trx }).whereHas(
			"subscriptionPlan",
			(query) => query.where("subscriptionId", subscriptionId),
		);
		return {
			headcount: company?.companyHeadcount ?? null,
			activeGroups: getActiveFormalismGroups(adhesions.map((adhesion) => adhesion.type)),
		};
	}

	async snapshot(subscriptionId: number) {
		const [groups, employees] = await Promise.all([
			SubscriptionFormalism.query()
				.where("subscriptionId", subscriptionId)
				.preload("members", (query) => query.orderBy("id")),
			SubscriptionFormalismEmployee.query().where("subscriptionId", subscriptionId).orderBy("id"),
		]);
		return presentFormalism(groups, employees);
	}

	async presentGroup(group: SubscriptionFormalism, trx: TransactionClientContract) {
		const members = await SubscriptionCseMember.query({ client: trx })
			.where("subscriptionFormalismId", group.id)
			.orderBy("id");
		return presentFormalismGroup(group.group, group, members);
	}

	async invalidate(subscription: Subscription, trx: TransactionClientContract) {
		await this.validateSubscriptionStepService.invalidate(
			subscription,
			trx,
			SubscriptionStep.FORMALISM,
		);
	}

	async requireCse(
		subscription: Subscription,
		group: SubscriptionFormalismGroup,
		trx: TransactionClientContract,
	) {
		const context = await this.context(subscription.id, trx);
		const record = await SubscriptionFormalism.query({ client: trx })
			.where("subscriptionId", subscription.id)
			.where("group", group)
			.firstOrFail();
		if (
			!context.activeGroups.includes(group) ||
			record.method !== SubscriptionFormalismMethod.CSE ||
			!context.headcount
		) {
			formalismError("method", "Sélectionnez le formalisme CSE pour ce dispositif.");
		}
		return record;
	}

	async requireRatification(subscription: Subscription, trx: TransactionClientContract) {
		const { activeGroups, headcount } = await this.context(subscription.id, trx);
		const record =
			activeGroups.length > 0 && headcount
				? await SubscriptionFormalism.query({ client: trx })
						.where("subscriptionId", subscription.id)
						.whereIn("group", activeGroups)
						.where("method", SubscriptionFormalismMethod.RATIFICATION)
						.first()
				: null;
		if (!record)
			formalismError("method", "Sélectionnez la ratification pour renseigner les salariés.");
	}

	async update(
		subscription: Subscription,
		group: SubscriptionFormalismGroup,
		payload: UpdateFormalismGroupPayload,
	) {
		return db.transaction(async (trx) => {
			await this.lock(subscription, trx);
			const { activeGroups, headcount } = await this.context(subscription.id, trx);
			if (!activeGroups.includes(group))
				formalismError("group", "Ce dispositif n’est pas sélectionné à l’étape 3.");
			const record = await SubscriptionFormalism.firstOrNew(
				{ subscriptionId: subscription.id, group },
				{},
				{ client: trx },
			);
			const method = payload.method === undefined ? (record.method ?? null) : payload.method;
			if (method !== null && !getAvailableFormalismMethods(group, headcount).includes(method)) {
				formalismError(
					"method",
					"Ce formalisme n’est pas disponible pour ce dispositif et cet effectif.",
				);
			}
			const { method: selectedMethod, meetingDate, mandatedMemberId, members, ...fields } = payload;
			if (members !== undefined && mandatedMemberId !== undefined) {
				formalismError(
					"mandatedMemberId",
					"Désignez le mandaté dans la nouvelle liste des membres.",
				);
			}
			if (
				method !== SubscriptionFormalismMethod.CSE &&
				(Object.keys(fields).length > 0 ||
					meetingDate !== undefined ||
					mandatedMemberId !== undefined ||
					members !== undefined)
			) {
				formalismError("method", "Les informations CSE nécessitent le choix du formalisme CSE.");
			}
			const enteringCse = method === SubscriptionFormalismMethod.CSE && record.method !== method;
			record.merge({
				...fields,
				method,
				...(selectedMethod === undefined ? {} : { methodInvalidated: false }),
				...(meetingDate === undefined
					? {}
					: { meetingDate: meetingDate ? DateTime.fromISO(meetingDate) : null }),
			});
			if (method !== SubscriptionFormalismMethod.CSE) this.clearCseFields(record);
			await record.useTransaction(trx).save();
			if (method !== SubscriptionFormalismMethod.CSE) {
				await SubscriptionCseMember.query({ client: trx })
					.where("subscriptionFormalismId", record.id)
					.delete();
			} else if (members !== undefined) {
				await SubscriptionCseMember.query({ client: trx })
					.where("subscriptionFormalismId", record.id)
					.delete();
				await SubscriptionCseMember.createMany(
					members.map((member) => ({ ...member, subscriptionFormalismId: record.id })),
					{ client: trx },
				);
			} else if (enteringCse) {
				await SubscriptionCseMember.create({ subscriptionFormalismId: record.id }, { client: trx });
			}
			if (mandatedMemberId !== undefined) {
				if (mandatedMemberId !== null) {
					await SubscriptionCseMember.query({ client: trx })
						.where("subscriptionFormalismId", record.id)
						.where("id", mandatedMemberId)
						.firstOrFail();
				}
				await SubscriptionCseMember.query({ client: trx })
					.where("subscriptionFormalismId", record.id)
					.update({ mandated: false });
				if (mandatedMemberId !== null)
					await SubscriptionCseMember.query({ client: trx })
						.where("subscriptionFormalismId", record.id)
						.where("id", mandatedMemberId)
						.update({ mandated: true });
			}
			await this.removeUnusedEmployees(subscription.id, trx);
			await this.invalidate(subscription, trx);
			return this.presentGroup(record, trx);
		});
	}

	/** Called within the upstream save transaction, only when its dependencies really change. */
	async synchronize(subscription: Subscription, trx: TransactionClientContract) {
		await this.lock(subscription, trx);
		const { activeGroups, headcount } = await this.context(subscription.id, trx);
		const records = await SubscriptionFormalism.query({ client: trx }).where(
			"subscriptionId",
			subscription.id,
		);
		for (const record of records) {
			if (!activeGroups.includes(record.group)) {
				await record.useTransaction(trx).delete();
			} else if (
				record.method !== null &&
				!getAvailableFormalismMethods(record.group, headcount).includes(record.method)
			) {
				record.merge({ method: null, methodInvalidated: true });
				this.clearCseFields(record);
				await record.useTransaction(trx).save();
				await SubscriptionCseMember.query({ client: trx })
					.where("subscriptionFormalismId", record.id)
					.delete();
			}
		}
		await this.removeUnusedEmployees(subscription.id, trx);
		await this.invalidate(subscription, trx);
	}

	private async removeUnusedEmployees(subscriptionId: number, trx: TransactionClientContract) {
		const remaining = await SubscriptionFormalism.query({ client: trx })
			.where("subscriptionId", subscriptionId)
			.where("method", SubscriptionFormalismMethod.RATIFICATION)
			.first();
		if (!remaining)
			await SubscriptionFormalismEmployee.query({ client: trx })
				.where("subscriptionId", subscriptionId)
				.delete();
	}

	private clearCseFields(record: SubscriptionFormalism) {
		record.merge({
			meetingDate: null,
			meetingCity: null,
			closingTime: null,
			votesFor: null,
			votesAgainst: null,
			votesAbstentions: null,
			presidentFirstName: null,
			presidentLastName: null,
			presidentEmail: null,
		});
	}
}
