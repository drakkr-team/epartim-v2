import { test } from "@japa/runner";

import CreateNetworkService from "#features/admin/networks/services/create.service";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

const servicePayload = {
	name: "Transactional Network",
	amundiOrgId: null,
	goCode: 900_719,
	address: {
		lineOne: "1 Transaction Street",
		lineTwo: null,
		zip: "75001",
		city: "Paris",
		coordinates: null,
	},
	paymentDetails: {
		iban: "FR76 3000 6000 0112 3456 7890 189",
		bic: "AGRI FR PP",
	},
};

test.group("Features / Admin / Networks / Services / Create Service", () => {
	test("it should create the network and its normalized owned records in one operation", async ({
		assert,
	}) => {
		const service = new CreateNetworkService();

		const network = await service.execute(servicePayload);

		assert.equal(network.addressId, network.address.id);
		assert.equal(network.paymentDetailsId, network.paymentDetails.id);
		assert.equal(network.paymentDetails.iban, "FR7630006000011234567890189");
		assert.equal(network.paymentDetails.bic, "AGRIFRPP");
	});

	test("it should roll back both owned records when network persistence fails", async ({
		assert,
	}) => {
		const service = new CreateNetworkService();
		const countsBefore = {
			networks: (await Network.all()).length,
			addresses: (await Address.all()).length,
			paymentDetails: (await PaymentDetail.all()).length,
		};

		await assert.rejects(() =>
			service.execute({
				...servicePayload,
				name: "x".repeat(255),
			}),
		);

		assert.lengthOf(await Network.all(), countsBefore.networks);
		assert.lengthOf(await Address.all(), countsBefore.addresses);
		assert.lengthOf(await PaymentDetail.all(), countsBefore.paymentDetails);
	});
});
