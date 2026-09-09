import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Address from "#models/address";
import Company from "#models/company";
import PaymentDetail from "#models/payment_detail";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Address And Bank Details Controller",
	() => {
		test("it should create address and payment detail drafts from the first non-empty value", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_address_and_bank_details", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					address: { lineOne: "10 rue de la Paix" },
					paymentDetail: { iban: "FR76 3000 6000 0112 3456 7890 189" },
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.isNotNull(company.addressId);
			assert.isNotNull(company.paymentDetailId);
			assert.equal((await Address.findOrFail(company.addressId)).lineOne, "10 rue de la Paix");
			assert.isNull((await Address.findOrFail(company.addressId)).zip);
			assert.equal(
				(await PaymentDetail.findOrFail(company.paymentDetailId)).iban,
				"FR76 3000 6000 0112 3456 7890 189",
			);
			assert.isNull((await PaymentDetail.findOrFail(company.paymentDetailId)).bic);
		});

		test("it should persist cleared values without creating empty related records", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			const company = await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_address_and_bank_details", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					address: { lineOne: null },
					paymentDetail: { iban: null },
				});

			response.assertOk();

			const persistedCompany = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.equal(persistedCompany.id, company.id);
			assert.isNull(persistedCompany.addressId);
			assert.isNull(persistedCompany.paymentDetailId);
		});

		test("it should reject invalid values without overwriting saved details", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			const address = await Address.create({
				lineOne: "10 rue de la Paix",
				zip: "75002",
				city: "Paris",
			});
			const paymentDetail = await PaymentDetail.create({
				iban: "FR76 3000 6000 0112 3456 7890 189",
				bic: "AGRIFRPP",
			});
			await CompanyFactory.merge({
				subscriptionId: subscription.id,
				addressId: address.id,
				paymentDetailId: paymentDetail.id,
			}).create();

			const response = await client
				.visit("client.subscriptions.update_address_and_bank_details", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ paymentDetail: { iban: "invalid" } });

			response.assertStatus(422);
			assert.equal((await PaymentDetail.findOrFail(paymentDetail.id)).iban, paymentDetail.iban);
		});
	},
);
