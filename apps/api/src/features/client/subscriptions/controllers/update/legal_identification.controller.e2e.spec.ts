import { test } from "@japa/runner";

import { AddressFactory } from "#database/factories/address.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import { SubscriptionStatus } from "#models/subscription";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Legal Identification Controller",
	() => {
		test("it should persist a valid legal identification", async ({ client, assert }) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.DRAFT,
			}).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					confirmCompanyChange: true,
					legalIdentification: {
						siren: "123456789",
						companyHeadcount: 12,
					},
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.equal(company.siren, "123456789");
			assert.equal(company.companyHeadcount, "12");
		});

		test("a confirmed SIREN correction preserves every other company and address field", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.WAITING_FOR_EPARTIM_VALIDATION,
				completedSteps: [1, 2, 3, 4, 5],
			}).create();
			const address = await AddressFactory.create();
			const company = await CompanyFactory.merge({
				subscriptionId: subscription.id,
				addressId: address.id,
				siren: "843912906",
			}).create();
			await company.refresh();
			await address.refresh();
			const before = company.toJSON();
			const addressBefore = address.toJSON();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					confirmCompanyChange: true,
					legalIdentification: { siren: "843912908" },
				});

			response.assertOk();
			await company.refresh();
			await address.refresh();
			await subscription.refresh();
			assert.deepEqual(company.toJSON(), {
				...before,
				siren: "843912908",
				updatedAt: company.toJSON().updatedAt,
			});
			assert.deepEqual(address.toJSON(), addressBefore);
			assert.deepEqual(subscription.completedSteps, []);
			assert.equal(subscription.status, SubscriptionStatus.DRAFT);
		});

		test("it should reject invalid data without updating the company", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.DRAFT,
			}).create();
			const company = await CompanyFactory.merge({
				subscriptionId: subscription.id,
				siren: "987654321",
			}).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					confirmCompanyChange: true,
					legalIdentification: { siren: "invalid" },
				});

			response.assertStatus(422);
			assert.equal(
				(await Company.findByOrFail("subscriptionId", subscription.id)).siren,
				company.siren,
			);
		});

		test("it should persist cleared legal identification values", async ({ client, assert }) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.DRAFT,
			}).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					confirmCompanyChange: true,
					legalIdentification: {
						siren: null,
						siret: null,
						naf: null,
						name: null,
						legalForm: null,
						companyHeadcount: null,
						vatNumber: null,
						financialYearClosingDay: null,
					},
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.isNull(company.siren);
			assert.isNull(company.siret);
			assert.isNull(company.naf);
			assert.isNull(company.name);
			assert.isNull(company.legalForm);
			assert.isNull(company.companyHeadcount);
			assert.isNull(company.vatNumber);
			assert.isNull(company.financialYearClosingDay);
		});
	},
);
