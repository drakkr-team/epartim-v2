import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import Contact, { ContactCivility, ContactKind } from "#models/contact";

test.group("Features / Client / Subscriptions / Update Legal Agent", () => {
	test("it persists a legal entity and keeps a distinct correspondent when it becomes a person", async ({
		client,
		assert,
	}) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const legalEntityResponse = await client
			.visit("client.subscriptions.update_legal_agent", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ kind: ContactKind.PERSONNE_MORALE, legalName: "Holding" });

		legalEntityResponse.assertOk();
		assert.isNull(
			(await Company.findByOrFail("subscriptionId", subscription.id)).companyCorrespondentId,
		);

		const correspondentResponse = await client
			.visit("client.subscriptions.update_correspondent", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				firstName: "Louise",
				lastName: "Durand",
				email: "louise@example.test",
				phoneNumber: "+33612345678",
			});

		correspondentResponse.assertOk();

		const physicalPersonResponse = await client
			.visit("client.subscriptions.update_legal_agent", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				kind: ContactKind.PERSONNE_PHYSIQUE,
				civility: ContactCivility.MADAME,
				firstName: "Alice",
				lastName: "Martin",
			});

		physicalPersonResponse.assertOk();

		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const legalAgent = await Contact.findOrFail(company.companyLegalAgentId!);
		const correspondent = await Contact.findOrFail(company.companyCorrespondentId!);
		assert.equal(legalAgent.kind, ContactKind.PERSONNE_PHYSIQUE);
		assert.isNull(legalAgent.legalName);
		assert.isFalse(legalAgent.isSameAsLegal!);
		assert.equal(correspondent.firstName, "Louise");
	});
});
