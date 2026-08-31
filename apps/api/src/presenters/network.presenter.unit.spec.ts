import assert from "node:assert/strict";

import { test } from "@japa/runner";

import { NetworkFactory } from "#database/factories/network.factory";
import AddressPresenter from "#presenters/address.presenter";
import NetworkPresenter from "#presenters/network.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

test.group("Presenters / Network Presenter", () => {
	test("it should preserve relation IDs and expand the owned relations", async () => {
		const network = await NetworkFactory.with("address").with("paymentDetails").create();
		await network.load("address");
		await network.load("paymentDetails");
		const presenter = new NetworkPresenter(new AddressPresenter(), new PaymentDetailPresenter());

		const result = presenter.toJSON(network);

		assert.equal(result.addressId, network.addressId);
		assert.equal(result.paymentDetailsId, network.paymentDetailsId);
		assert.deepEqual(result.address, new AddressPresenter().toJSON(network.address));
		assert.deepEqual(
			result.paymentDetails,
			new PaymentDetailPresenter().toJSON(network.paymentDetails),
		);
	});
});
