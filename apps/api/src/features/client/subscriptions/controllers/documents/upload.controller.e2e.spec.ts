import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import { CompanyLegalForm } from "#models/company";
import { ContactKind } from "#models/contact";
import File from "#models/file";
import SubscriptionDocument from "#models/subscription_document";

const pdf = Buffer.from("%PDF-1.4");

test.group(
	"Features / Client / Subscriptions / Controllers / Documents / Upload Controller",
	() => {
		async function createSubscriptionWithRequiredDocuments() {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			const legalAgent = await ContactFactory.merge({
				kind: ContactKind.PERSONNE_PHYSIQUE,
			}).create();
			const signer = await ContactFactory.merge({ isSignatoryOnKbis: true }).create();
			await CompanyFactory.merge({
				subscriptionId: subscription.id,
				legalForm: CompanyLegalForm.SAS,
				companyLegalAgentId: legalAgent.id,
				companySignerId: signer.id,
			}).create();

			return { subscription, user };
		}

		test("it should upload, replace, and delete a required document", async ({
			client,
			assert,
		}) => {
			const { subscription, user } = await createSubscriptionWithRequiredDocuments();

			const firstResponse = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType: "bank_details",
				})
				.withGuard("client")
				.loginAs(user)
				.header("x-superjson", "true")
				.file("file", pdf, {
					contentType: "application/pdf",
					filename: "acte_mariage (1).pdf",
				});

			firstResponse.assertCreated();
			const firstFileId = firstResponse.body().id;
			const firstFile = await File.findOrFail(firstFileId);
			assert.equal(firstFile.name, "acte_mariage (1).pdf");

			const secondResponse = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType: "bank_details",
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", pdf, { contentType: "application/pdf", filename: "rib-two.pdf" });

			secondResponse.assertCreated();
			assert.isNull(await File.find(firstFileId));

			const document = await SubscriptionDocument.query()
				.where("subscriptionId", subscription.id)
				.where("type", "bank_details")
				.firstOrFail();
			assert.equal(document.fileId, secondResponse.body().id);

			const deleteResponse = await client
				.visit("client.subscriptions.delete_document", {
					subscriptionId: subscription.id,
					documentType: "bank_details",
				})
				.withGuard("client")
				.loginAs(user);

			deleteResponse.assertNoContent();
			assert.isNull(await SubscriptionDocument.find(document.id));
			assert.isNull(await File.find(secondResponse.body().id));
		});

		test("it should reject an invalid file and access by another user", async ({
			client,
			assert,
		}) => {
			const { subscription, user } = await createSubscriptionWithRequiredDocuments();
			const otherUser = await UserFactory.create();

			const invalidFileResponse = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType: "bank_details",
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", Buffer.from("invalid"), {
					contentType: "application/octet-stream",
					filename: "rib.exe",
				});

			invalidFileResponse.assertStatus(422);
			const documents = await SubscriptionDocument.query().where("subscriptionId", subscription.id);
			assert.lengthOf(documents, 0);

			const unauthorizedResponse = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType: "bank_details",
				})
				.withGuard("client")
				.loginAs(otherUser)
				.file("file", pdf, { contentType: "application/pdf", filename: "rib.pdf" });

			unauthorizedResponse.assertStatus(403);
		});
	},
);
