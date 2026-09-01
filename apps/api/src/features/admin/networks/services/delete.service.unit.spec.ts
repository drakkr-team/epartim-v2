import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import DeleteNetworkService from "#features/admin/networks/services/delete.service";
import Address from "#models/address";
import Firm from "#models/firm";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Networks / Services / Delete Service", () => {
	test("it should delete referenced networks and clear the firm relation", async ({ assert }) => {
		const network = await NetworkFactory.with("address").with("paymentDetail").create();
		const firm = await FirmFactory.merge({ networkId: network.id })
			.with("address")
			.with("paymentDetail")
			.create();

		await new DeleteNetworkService().handle(network.id);

		assert.isNull(await Network.find(network.id));
		assert.isNull(await Address.find(network.addressId));
		assert.isNull(await PaymentDetail.find(network.paymentDetailId));
		assert.isNull((await Firm.findOrFail(firm.id)).networkId);
	});

	test("it should roll back the network deletion if owned child deletion fails", async ({
		assert,
	}) => {
		const network = await NetworkFactory.merge({ name: "Rollback Delete Target" })
			.with("address")
			.with("paymentDetail")
			.create();
		await NetworkFactory.merge({
			name: "Rollback Address Reference",
			amundiOrgId: "ROLLBACK-ADDRESS-REFERENCE",
			addressId: network.addressId,
		})
			.with("paymentDetail")
			.create();

		await assert.rejects(() => new DeleteNetworkService().handle(network.id));

		assert.isNotNull(await Network.find(network.id));
		assert.isNotNull(await Address.find(network.addressId));
		assert.isNotNull(await PaymentDetail.find(network.paymentDetailId));
	});
});
