import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";
import { DateTime } from "luxon";

import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Address from "#models/address";
import Company from "#models/company";
import CompanyBeneficialOwner, {
	CompanyBeneficialOwnerKind,
} from "#models/company_beneficial_owner";
import CompanyBeneficialOwnerRole from "#models/company_beneficial_owner_role";
import Subscription from "#models/subscription";
import { UpdateKycOwnerSchema } from "#validators/subscription/kyc.validator";

export type UpdateKycOwnerPayload = Infer<typeof UpdateKycOwnerSchema>;

type OwnerChanges = UpdateKycOwnerPayload["owner"];

@inject()
export default class KycOwnersService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async create(subscription: Subscription) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const address = await Address.create({}, { client: trx });
			const owner = await CompanyBeneficialOwner.create(
				{
					companyId: company.id,
					addressId: address.id,
					kind: CompanyBeneficialOwnerKind.PHYSICAL_PERSON,
				},
				{ client: trx },
			);
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.KYC,
			);

			return owner;
		});
	}

	async update(subscription: Subscription, ownerId: number, payload: UpdateKycOwnerPayload) {
		return db.transaction(async (trx) => {
			const owner = await this.#findOwner(subscription.id, ownerId, trx);
			const { address, roles, ...ownerChanges } = payload.owner;
			const { birthDate, shareholdingPercentage, ...ownerFields } = ownerChanges;
			owner.merge({
				...ownerFields,
				...(birthDate === undefined
					? {}
					: { birthDate: birthDate ? DateTime.fromISO(birthDate) : null }),
				...(shareholdingPercentage === undefined
					? {}
					: {
							shareholdingPercentage:
								shareholdingPercentage === null ? null : String(shareholdingPercentage),
						}),
			});
			this.#clearIncompatibleValues(owner);
			await owner.useTransaction(trx).save();

			if (address) await this.#updateAddress(owner, address, trx);
			if (roles !== undefined && roles !== null) await this.#replaceRoles(owner, roles, trx);
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.KYC,
			);

			return owner;
		});
	}

	async delete(subscription: Subscription, ownerId: number) {
		return db.transaction(async (trx) => {
			const owner = await this.#findOwner(subscription.id, ownerId, trx);
			const addressId = owner.addressId;
			await owner.useTransaction(trx).delete();
			await Address.query({ client: trx }).where("id", addressId).delete();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.KYC,
			);
		});
	}

	async #findOwner(subscriptionId: number, ownerId: number, trx: TransactionClientContract) {
		return CompanyBeneficialOwner.query({ client: trx })
			.where("id", ownerId)
			.whereHas("company", (companyQuery) => companyQuery.where("subscriptionId", subscriptionId))
			.forUpdate()
			.firstOrFail();
	}

	async #updateAddress(
		owner: CompanyBeneficialOwner,
		addressChanges: NonNullable<OwnerChanges["address"]>,
		trx: TransactionClientContract,
	) {
		const address = await Address.findOrFail(owner.addressId, { client: trx });
		await address.useTransaction(trx).merge(addressChanges).save();
	}

	async #replaceRoles(
		owner: CompanyBeneficialOwner,
		roles: NonNullable<OwnerChanges["roles"]>,
		trx: TransactionClientContract,
	) {
		await owner.useTransaction(trx).related("roles").query().delete();
		if (roles.length === 0) return;

		await CompanyBeneficialOwnerRole.createMany(
			roles.map((role) => ({ companyBeneficialOwnerId: owner.id, role })),
			{ client: trx },
		);
	}

	#clearIncompatibleValues(owner: CompanyBeneficialOwner) {
		if (owner.kind === CompanyBeneficialOwnerKind.PHYSICAL_PERSON) {
			owner.legalName = null;
			owner.siren = null;
			return;
		}

		owner.firstName = null;
		owner.lastName = null;
		owner.birthDate = null;
		owner.birthCity = null;
	}
}
