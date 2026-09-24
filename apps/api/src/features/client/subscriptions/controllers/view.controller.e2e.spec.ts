import { test } from "@japa/runner";

import { COMPANY_LEGAL_FORMS } from "#constants/company";
import { CONTACT_KINDS } from "#constants/contact";
import { AddressFactory } from "#database/factories/address.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import File from "#models/file";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";

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

	test("it should return the company representatives and authorizations", async ({ client }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const legalAgent = await ContactFactory.create();
		const signer = await ContactFactory.create();
		const correspondent = await ContactFactory.create();
		const authorization = await ContactFactory.apply("withAuthorizations").create();
		const company = await CompanyFactory.merge({
			subscriptionId: subscription.id,
			companyLegalAgentId: legalAgent.id,
			companySignerId: signer.id,
			companyCorrespondentId: correspondent.id,
		}).create();
		await company.related("contacts").attach([authorization.id]);

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		response.assertBodyContains({
			representativesAndAuthorizations: {
				legalAgent: { id: legalAgent.id },
				signer: { id: signer.id },
				correspondent: { id: correspondent.id },
				authorizations: [{ id: authorization.id }],
			},
		});
	});

	test("it should return the documents required by the company and signer", async ({
		client,
		assert,
	}) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const legalAgent = await ContactFactory.merge({
			kind: CONTACT_KINDS.PERSONNE_PHYSIQUE,
		}).create();
		const signer = await ContactFactory.merge({ isSignatoryOnKbis: false }).create();
		await CompanyFactory.merge({
			subscriptionId: subscription.id,
			legalForm: COMPANY_LEGAL_FORMS.SAS,
			companyLegalAgentId: legalAgent.id,
			companySignerId: signer.id,
		}).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		assert.deepEqual(
			response.body().documents.map((document: { status: string; type: number }) => ({
				status: document.status,
				type: document.type,
			})),
			[
				{ type: SubscriptionDocumentType.BANK_DETAILS, status: "pending" },
				{ type: SubscriptionDocumentType.LEGAL_AGENT_ID, status: "pending" },
				{ type: SubscriptionDocumentType.EXISTENCE_PROOF, status: "pending" },
				{ type: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION, status: "pending" },
				{ type: SubscriptionDocumentType.SIGNER_ID, status: "pending" },
				{ type: SubscriptionDocumentType.SIGNER_POWER, status: "pending" },
			],
		);
		assert.include(response.body().documents[2].label, "Extrait RNE");
	});

	test("it should return a download URL for an attached document", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const file = await File.create({
			key: `subscriptions/${subscription.id}/bank-details.pdf`,
			name: "RIB de l'entreprise.pdf",
			size: 1024,
			type: "application/pdf",
		});
		await SubscriptionDocument.create({
			fileId: file.id,
			subscriptionId: subscription.id,
			type: SubscriptionDocumentType.BANK_DETAILS,
		});
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		const document = response
			.body()
			.documents.find(
				(item: { type: number }) => item.type === SubscriptionDocumentType.BANK_DETAILS,
			);
		if (!document?.file) throw new Error("Expected the bank details document to be attached");

		assert.deepInclude(document.file, { name: file.name });
		assert.match(document.file.url, /^https?:\/\//);
		assert.include(new URL(document.file.url).searchParams.get("contentDisposition"), "attachment");
	});

	test("it should not require an organization chart for an EPIC", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({
			subscriptionId: subscription.id,
			legalForm: COMPANY_LEGAL_FORMS.ETABLISSEMENT_PUBLIC_LOCAL_EPIC,
		}).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		assert.notInclude(
			response.body().documents.map((document: { type: number }) => document.type),
			SubscriptionDocumentType.ORGANIZATION_CHART,
		);
	});

	test("it should reject access to another user's subscription", async ({ client }) => {
		const owner = await UserFactory.create();
		const otherUser = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: owner.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(otherUser);

		response.assertStatus(403);
	});
});
