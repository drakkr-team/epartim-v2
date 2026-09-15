import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import Address from "#models/address";
import Company from "#models/company";
import PaymentDetail from "#models/payment_detail";
import Subscription from "#models/subscription";
import { UpdateAddressAndBankDetailsSchema } from "#validators/subscription/address_and_bank_details.validator";

export type UpdateAddressAndBankDetailsPayload = Infer<typeof UpdateAddressAndBankDetailsSchema>;

type AddressChanges = NonNullable<UpdateAddressAndBankDetailsPayload["address"]>;
type PaymentDetailChanges = NonNullable<UpdateAddressAndBankDetailsPayload["paymentDetail"]>;

export default class UpdateAddressAndBankDetailsService {
	async handle(subscription: Subscription, payload: UpdateAddressAndBankDetailsPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});

			if (payload.address) {
				await this.#updateAddress(company, payload.address, trx);
			}

			if (payload.paymentDetail) {
				await this.#updatePaymentDetail(company, payload.paymentDetail, trx);
			}

			return company;
		});
	}

	async #updateAddress(
		company: Company,
		addressPayload: AddressChanges,
		trx: TransactionClientContract,
	) {
		if (company.addressId) {
			const address = await Address.findOrFail(company.addressId, { client: trx });
			await address.useTransaction(trx).merge(addressPayload).save();
			return;
		}

		if (Object.values(addressPayload).every((value) => value === null || value === undefined)) {
			return;
		}

		const address = await Address.create(addressPayload, { client: trx });
		await company.useTransaction(trx).merge({ addressId: address.id }).save();
	}

	async #updatePaymentDetail(
		company: Company,
		paymentDetailPayload: PaymentDetailChanges,
		trx: TransactionClientContract,
	) {
		if (company.paymentDetailId) {
			const paymentDetail = await PaymentDetail.findOrFail(company.paymentDetailId, {
				client: trx,
			});
			await paymentDetail.useTransaction(trx).merge(paymentDetailPayload).save();
			return;
		}

		if (
			Object.values(paymentDetailPayload).every((value) => value === null || value === undefined)
		) {
			return;
		}

		const paymentDetail = await PaymentDetail.create(paymentDetailPayload, { client: trx });
		await company.useTransaction(trx).merge({ paymentDetailId: paymentDetail.id }).save();
	}
}
