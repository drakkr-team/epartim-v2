import { test } from "@japa/runner";

import { AddressFactory } from "#database/factories/address.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";

test.group("Features / Client / Subscriptions / Controllers / View Controller", () => {
	test("it should return the legal identification and address and bank details", async ({
		client,
	}) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const address = await AddressFactory.create();
		const paymentDetail = await PaymentDetailFactory.create();
		const company = await CompanyFactory.merge({
			subscriptionId: subscription.id,
			addressId: address.id,
			paymentDetailId: paymentDetail.id,
		}).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		response.assertBodyContains({
			id: subscription.id,
			legalIdentification: {
				siren: company.siren,
				name: company.name,
			},
			addressAndBankDetails: {
				address: { id: address.id },
				paymentDetail: { id: paymentDetail.id },
			},
		});
	});
});
