import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription, { SubscriptionStatus } from "#models/subscription";

test.group("Features / Client / Subscriptions / Controllers / Create Controller", () => {
	test("it should create a draft subscription for the authenticated user", async ({
		client,
		assert,
	}) => {
		const user = await UserFactory.create();

		const response = await client
			.visit("client.subscriptions.create")
			.withGuard("client")
			.loginAs(user);

		response.assertCreated();
		response.assertBodyContains({
			createdBy: user.id,
			status: SubscriptionStatus.DRAFT,
			completedSteps: [],
		});

		const subscription = await Subscription.findOrFail(response.body().id);
		assert.equal(subscription.createdBy, user.id);
		assert.equal(subscription.status, SubscriptionStatus.DRAFT);
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		assert.equal(company.subscriptionId, subscription.id);

		const legalAgent = await Contact.findOrFail(company.companyLegalAgentId!);
		const signer = await Contact.findOrFail(company.companySignerId!);
		assert.equal(legalAgent.kind, ContactKind.PERSONNE_PHYSIQUE);
		assert.equal(signer.isSignatoryOnKbis, true);
	});

	test("it should reject an unauthenticated request", async ({ client }) => {
		const response = await client.visit("client.subscriptions.create");

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
