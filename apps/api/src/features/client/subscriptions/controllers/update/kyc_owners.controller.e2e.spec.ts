import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Address from "#models/address";
import Company from "#models/company";
import CompanyBeneficialOwner, {
	CompanyBeneficialOwnerKind,
} from "#models/company_beneficial_owner";

test.group("Features / Client / Subscriptions / Controllers / Update KYC Owners", () => {
	async function createSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		return { subscription, user };
	}

	test("it creates, updates, and deletes an owner with its address", async ({ client, assert }) => {
		const { subscription, user } = await createSubscription();

		const createResponse = await client
			.visit("client.subscriptions.create_kyc_owner", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		createResponse.assertOk();
		createResponse.assertBodyContains({ shareholdingPercentage: null });
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const owner = await CompanyBeneficialOwner.query().where("companyId", company.id).firstOrFail();
		const addressId = owner.addressId;

		const updateResponse = await client
			.visit("client.subscriptions.update_kyc_owner", {
				ownerId: owner.id,
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				owner: {
					address: { city: "Paris", lineOne: "10 rue de la Paix", zip: "75002" },
					kind: CompanyBeneficialOwnerKind.LEGAL_ENTITY,
					legalName: "Société Exemple",
					nationality: "FR",
					roles: [4],
					shareholdingPercentage: 0,
				},
			});

		updateResponse.assertOk();
		const updatedOwner = await CompanyBeneficialOwner.findOrFail(owner.id);
		assert.equal(updatedOwner.kind, CompanyBeneficialOwnerKind.LEGAL_ENTITY);
		assert.equal(updatedOwner.legalName, "Société Exemple");
		assert.isNull(updatedOwner.firstName);
		assert.isNull(updatedOwner.birthDate);

		const deleteResponse = await client
			.visit("client.subscriptions.delete_kyc_owner", {
				ownerId: owner.id,
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user);

		deleteResponse.assertNoContent();
		assert.isNull(await CompanyBeneficialOwner.find(owner.id));
		assert.isNull(await Address.find(addressId));
	});
});
