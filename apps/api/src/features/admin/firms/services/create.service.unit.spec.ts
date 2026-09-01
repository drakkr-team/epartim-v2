import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import CreateFirmService from "#features/admin/firms/services/create.service";
import Address from "#models/address";
import PaymentDetail from "#models/payment_detail";

const ownedRecords = {
	address: {
		lineOne: "12 rue de la Transaction",
		zip: "75001",
		city: "Paris",
	},
	paymentDetails: {
		iban: "FR7630006000011234567890189",
		bic: "AGRIFRPP",
	},
};

test.group("Features / Admin / Firms / Services / Create Service", () => {
	test("it should rollback owned records when firm creation fails", async ({ assert }) => {
		const existing = await FirmFactory.merge({
			name: "Existing Firm",
			orias: "61000001",
		})
			.with("address")
			.with("paymentDetails")
			.create();
		const addressesBefore = await Address.query().count("* as total").firstOrFail();
		const paymentDetailsBefore = await PaymentDetail.query().count("* as total").firstOrFail();

		await assert.rejects(() =>
			new CreateFirmService().handle({
				...ownedRecords,
				name: existing.name,
				amundiOrgId: null,
				orias: "61000002",
				networkId: null,
			}),
		);

		const addressesAfter = await Address.query().count("* as total").firstOrFail();
		const paymentDetailsAfter = await PaymentDetail.query().count("* as total").firstOrFail();
		assert.equal(addressesAfter.$extras.total, addressesBefore.$extras.total);
		assert.equal(paymentDetailsAfter.$extras.total, paymentDetailsBefore.$extras.total);
	});
});
