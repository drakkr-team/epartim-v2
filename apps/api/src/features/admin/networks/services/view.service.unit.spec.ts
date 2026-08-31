import { test } from "@japa/runner";

import { NetworkFactory } from "#database/factories/network.factory";
import ViewNetworkService from "#features/admin/networks/services/view.service";

test.group("Features / Admin / Networks / Services / View Service", () => {
	test("it should load a network with its address and payment details", async ({ assert }) => {
		const created = await NetworkFactory.with("address").with("paymentDetails").create();

		const network = await new ViewNetworkService().handle(created.id);

		assert.equal(network.id, created.id);
		assert.equal(network.address.id, created.addressId);
		assert.equal(network.paymentDetails.id, created.paymentDetailsId);
	});

	test("it should reject an unknown network identifier", async ({ assert }) => {
		await assert.rejects(() => new ViewNetworkService().handle(999_999));
	});
});
