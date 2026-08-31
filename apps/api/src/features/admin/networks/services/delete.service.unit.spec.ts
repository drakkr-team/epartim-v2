import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import NetworkHasFirmsException from "#exceptions/network_has_firms.exception";
import DeleteNetworkService from "#features/admin/networks/services/delete.service";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Networks / Services / Delete Service", () => {
	test("it should reject referenced networks without deleting any owned record", async ({
		assert,
	}) => {
		const network = await NetworkFactory.with("address").with("paymentDetails").create();
		await FirmFactory.merge({ networkId: network.id })
			.with("address")
			.with("paymentDetails")
			.create();

		await assert.rejects(
			() => new DeleteNetworkService().execute(network.id),
			NetworkHasFirmsException,
		);

		assert.isNotNull(await Network.find(network.id));
		assert.isNotNull(await Address.find(network.addressId));
		assert.isNotNull(await PaymentDetail.find(network.paymentDetailsId));
	});

	test("it should roll back the network deletion if owned child deletion fails", async ({
		assert,
	}) => {
		const network = await NetworkFactory.merge({ name: "Rollback Delete Target" })
			.with("address")
			.with("paymentDetails")
			.create();
		await NetworkFactory.merge({
			name: "Rollback Address Reference",
			amundiOrgId: "ROLLBACK-ADDRESS-REFERENCE",
			addressId: network.addressId,
		})
			.with("paymentDetails")
			.create();

		await assert.rejects(() => new DeleteNetworkService().execute(network.id));

		assert.isNotNull(await Network.find(network.id));
		assert.isNotNull(await Address.find(network.addressId));
		assert.isNotNull(await PaymentDetail.find(network.paymentDetailsId));
	});
});
