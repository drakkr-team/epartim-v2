import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import CompanyKycProfile from "#models/company_kyc_profile";
import File from "#models/file";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";

test.group("Features / Client / Subscriptions / Controllers / Update KYC", () => {
	async function createSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({
			completedSteps: [2],
			createdBy: user.id,
		}).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		return { subscription, user };
	}

	test("it persists country data and clears inactive conditional values", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();

		const enabledResponse = await client
			.visit("client.subscriptions.update_kyc_profile", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				kycProfile: {
					countryOfActivity: "other",
					countryOfActivityBreakdown: [
						{ country: "FR", percentage: 20 },
						{ country: "MA", percentage: 80 },
					],
					countryProvider: "other",
					countryProviderCountries: ["DE", "MA"],
					mainMarkets: "other",
					mainMarketsCountries: ["FR", "ES"],
					regulatedActivity: true,
					regulatedActivityReference: "AMF 123",
				},
			});

		enabledResponse.assertOk();
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const enabledProfile = await CompanyKycProfile.findByOrFail("companyId", company.id);
		assert.deepEqual(enabledProfile.countryOfActivityBreakdown, [
			{ country: "FR", percentage: 20 },
			{ country: "MA", percentage: 80 },
		]);
		assert.deepEqual(enabledProfile.countryProviderCountries, ["DE", "MA"]);
		assert.deepEqual(enabledProfile.mainMarketsCountries, ["FR", "ES"]);

		const disabledResponse = await client
			.visit("client.subscriptions.update_kyc_profile", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				kycProfile: {
					countryOfActivityBreakdown: null,
					countryProviderCountries: null,
					mainMarketsCountries: null,
					regulatedActivity: false,
				},
			});

		disabledResponse.assertOk();
		const profile = await CompanyKycProfile.findByOrFail("companyId", company.id);
		assert.isNull(profile.countryOfActivityReference);
		assert.isNull(profile.countryOfActivityBreakdown);
		assert.isNull(profile.countryProviderCountries);
		assert.isNull(profile.mainMarketsCountries);
		assert.isNull(profile.regulatedActivityReference);
	});

	test("it removes the BIC document when the company no longer has a BIC", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		await CompanyKycProfile.create({ bicId: true, companyId: company.id });
		const file = await File.create({
			key: `subscriptions/${subscription.id}/bic.pdf`,
			name: "bic.pdf",
			size: 1_024,
			type: "application/pdf",
		});
		const document = await SubscriptionDocument.create({
			companyBeneficialOwnerId: null,
			fileId: file.id,
			subscriptionId: subscription.id,
			type: SubscriptionDocumentType.BIC_IDENTIFICATION_CODE,
		});

		const response = await client
			.visit("client.subscriptions.update_kyc_profile", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ kycProfile: { bicId: false } });

		response.assertOk();
		assert.isNull(await SubscriptionDocument.find(document.id));
		assert.isNull(await File.find(file.id));
	});
});
