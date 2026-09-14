import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import Contact, {
	ContactAuthorization,
	ContactCivility,
	ContactFunction,
	ContactKind,
} from "#models/contact";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Representatives And Authorizations Controller",
	() => {
		test("it should persist contacts through the subscription company", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_representatives_and_authorizations", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					legalAgent: {
						kind: ContactKind.PERSONNE_MORALE,
						legalName: "Société de gestion",
						email: "representant@example.test",
						function: ContactFunction.PRESIDENT,
					},
					signer: {
						civility: ContactCivility.MADAME,
						firstName: "Claire",
						lastName: "Martin",
						email: "claire.martin@example.test",
						phoneNumber: "+33612345678",
						isSignatoryOnKbis: true,
					},
					correspondent: {
						civility: ContactCivility.MONSIEUR,
						firstName: "Hugo",
						lastName: "Dupont",
						email: "hugo.dupont@example.test",
						phoneNumber: "+33698765432",
						function: ContactFunction.DRH,
						amundiPortalId: "AMUNDI-42",
					},
					authorizations: [
						{
							civility: ContactCivility.MADAME,
							firstName: "Nora",
							lastName: "Petit",
							email: "nora.petit@example.test",
							function: ContactFunction.DAF,
							authorizations: [ContactAuthorization.COMPTABLE, ContactAuthorization.ADMINISTRER],
						},
					],
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.isNotNull(company.companyLegalAgentId);
			assert.isNotNull(company.companyCorrespondentId);
			assert.isNotNull(company.companySignerId);

			const legalAgent = await Contact.findOrFail(company.companyLegalAgentId!);
			assert.equal(legalAgent.kind, ContactKind.PERSONNE_MORALE);
			assert.equal(legalAgent.legalName, "Société de gestion");
			assert.isNull(legalAgent.firstName);
			assert.isFalse(legalAgent.isSameAsLegal!);

			const signer = await Contact.findOrFail(company.companySignerId!);
			assert.equal(signer.firstName, "Claire");
			assert.isTrue(signer.isSignatoryOnKbis!);

			const correspondent = await Contact.findOrFail(company.companyCorrespondentId!);
			assert.equal(correspondent.email, "hugo.dupont@example.test");
			assert.equal(correspondent.amundiPortalId, "AMUNDI-42");

			const authorizations = await company.related("contacts").query();
			assert.lengthOf(authorizations, 1);
			assert.deepEqual(authorizations[0].authorizations, [
				ContactAuthorization.COMPTABLE,
				ContactAuthorization.ADMINISTRER,
			]);
		});

		test("it should keep a distinct correspondent when a legal entity becomes a physical person", async ({
			client,
			assert,
		}) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			await client
				.visit("client.subscriptions.update_representatives_and_authorizations", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					legalAgent: { kind: ContactKind.PERSONNE_MORALE, legalName: "Holding" },
					correspondent: { firstName: "Louise", email: "louise@example.test" },
				});

			const response = await client
				.visit("client.subscriptions.update_representatives_and_authorizations", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					legalAgent: {
						kind: ContactKind.PERSONNE_PHYSIQUE,
						firstName: "Alice",
						lastName: "Durand",
					},
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			const legalAgent = await Contact.findOrFail(company.companyLegalAgentId!);
			const correspondent = await Contact.findOrFail(company.companyCorrespondentId!);
			assert.equal(legalAgent.kind, ContactKind.PERSONNE_PHYSIQUE);
			assert.isFalse(legalAgent.isSameAsLegal!);
			assert.equal(correspondent.firstName, "Louise");
		});

		test("it should reject duplicate authorization emails", async ({ client }) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

			const response = await client
				.visit("client.subscriptions.update_representatives_and_authorizations", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					authorizations: [{ email: "doublon@example.test" }, { email: "doublon@example.test" }],
				});

			response.assertStatus(422);
		});
	},
);
