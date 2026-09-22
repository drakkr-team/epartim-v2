import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import CompanyKycProfile from "#models/company_kyc_profile";

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
});
