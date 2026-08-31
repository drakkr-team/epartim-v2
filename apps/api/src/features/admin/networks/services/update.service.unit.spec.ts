import { test } from "@japa/runner";

import { NetworkFactory } from "#database/factories/network.factory";
import UpdateNetworkService from "#features/admin/networks/services/update.service";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

let fixtureIndex = 0;

async function createServiceFixture() {
	fixtureIndex += 1;
	const network = await NetworkFactory.merge({
		name: `Service Original ${fixtureIndex}`,
		amundiOrgId: `SERVICE-ORIGINAL-${fixtureIndex}`,
		goCode: 112,
	})
		.with("address")
		.with("paymentDetails")
		.create();
	await Address.query().where("id", String(network.addressId)).update({ city: "Paris" });
	await PaymentDetail.query().where("id", String(network.paymentDetailsId)).update({
		iban: "FR7630006000011234567890189",
		bic: "AGRIFRPP",
	});
	return network;
}

test.group("Features / Admin / Networks / Services / Update Service", () => {
	test("it should update only provided fields and normalize partial payment details", async ({
		assert,
	}) => {
		const network = await createServiceFixture();

		const updated = await new UpdateNetworkService().execute(network.id, {
			address: { city: "Lyon" },
			paymentDetails: { bic: "agri fr pp" },
		});

		assert.equal(updated.name, network.name);
		assert.equal(updated.amundiOrgId, network.amundiOrgId);
		assert.equal(updated.goCode, network.goCode);
		assert.equal(updated.address.city, "Lyon");
		assert.equal(updated.paymentDetails.iban, "FR7630006000011234567890189");
		assert.equal(updated.paymentDetails.bic, "AGRIFRPP");
	});

	test("it should roll back owned changes when network persistence fails", async ({ assert }) => {
		const network = await createServiceFixture();

		await assert.rejects(() =>
			new UpdateNetworkService().execute(network.id, {
				name: "x".repeat(255),
				address: { city: "Rollback City" },
				paymentDetails: { bic: "BNPAFRPP" },
			}),
		);

		const persistedNetwork = await Network.findOrFail(network.id);
		const persistedAddress = await Address.findOrFail(network.addressId);
		const persistedPayment = await PaymentDetail.findOrFail(network.paymentDetailsId);
		assert.equal(persistedNetwork.name, network.name);
		assert.equal(persistedAddress.city, "Paris");
		assert.equal(persistedPayment.bic, "AGRIFRPP");
	});
});
