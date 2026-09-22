import { test } from "@japa/runner";

import { AddressFactory } from "#database/factories/address.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import { CompanyLegalForm } from "#models/company";
import CompanyBeneficialOwner, {
	CompanyBeneficialOwnerKind,
} from "#models/company_beneficial_owner";
import CompanyKycProfile from "#models/company_kyc_profile";
import File from "#models/file";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";

test.group("Features / Client / Subscriptions / Controllers / Steps / Validate Controller", () => {
	async function createKycSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({
			completedSteps: [],
			createdBy: user.id,
			status: SubscriptionStatus.DRAFT,
		}).create();
		const company = await CompanyFactory.merge({ subscriptionId: subscription.id }).create();
		await CompanyKycProfile.create({ companyId: company.id });

		return { company, subscription, user };
	}

	async function createCompleteSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({
			completedSteps: [],
			createdBy: user.id,
			status: SubscriptionStatus.DRAFT,
		}).create();
		const [address, paymentDetail, legalAgent, signer, correspondent] = await Promise.all([
			AddressFactory.merge({ city: "Paris", lineOne: "10 rue de la Paix", zip: "75002" }).create(),
			PaymentDetailFactory.merge({ bic: "AGRIFRPP", iban: "FR7630006000011234567890189" }).create(),
			ContactFactory.apply("legalEntity")
				.merge({ email: "legal@example.com", function: 1 })
				.create(),
			ContactFactory.merge({ isSignatoryOnKbis: true }).create(),
			ContactFactory.merge({
				email: "correspondent@example.com",
				phoneNumber: "+33612345678",
			}).create(),
		]);
		await CompanyFactory.merge({
			addressId: address.id,
			companyCorrespondentId: correspondent.id,
			companyLegalAgentId: legalAgent.id,
			companySignerId: signer.id,
			legalForm: CompanyLegalForm.SAS,
			paymentDetailId: paymentDetail.id,
			subscriptionId: subscription.id,
		}).create();

		for (const type of [
			SubscriptionDocumentType.BANK_DETAILS,
			SubscriptionDocumentType.LEGAL_AGENT_KBIS,
			SubscriptionDocumentType.EXISTENCE_PROOF,
			SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
		]) {
			const file = await File.create({
				key: `subscriptions/${subscription.id}/${type}.pdf`,
				name: `${type}.pdf`,
				size: 1_024,
				type: "application/pdf",
			});
			await SubscriptionDocument.create({ fileId: file.id, subscriptionId: subscription.id, type });
		}

		return { subscription, user };
	}

	test("it validates a complete step once and preserves the draft status", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createCompleteSubscription();

		const firstResponse = await client
			.visit("client.subscriptions.validate_step", { step: 1, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		firstResponse.assertOk();
		const firstValidatedSubscription = await Subscription.findOrFail(subscription.id);
		assert.deepEqual(firstValidatedSubscription.completedSteps, [1]);
		assert.equal(firstValidatedSubscription.status, SubscriptionStatus.DRAFT);

		const secondResponse = await client
			.visit("client.subscriptions.validate_step", { step: 1, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		secondResponse.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1]);
	});

	test("it rejects incomplete data and required documents without completing the step", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createCompleteSubscription();
		const document = await SubscriptionDocument.query()
			.where("subscriptionId", subscription.id)
			.where("type", SubscriptionDocumentType.BANK_DETAILS)
			.firstOrFail();
		await document.delete();

		const response = await client
			.visit("client.subscriptions.validate_step", { step: 1, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertStatus(422);
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);
	});

	test("it rejects access to another user's subscription", async ({ client }) => {
		const { subscription } = await createCompleteSubscription();
		const otherUser = await UserFactory.create();

		const response = await client
			.visit("client.subscriptions.validate_step", { step: 1, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(otherUser);

		response.assertStatus(403);
	});

	test("it validates KYC without documents or holders", async ({ client, assert }) => {
		const { subscription, user } = await createKycSubscription();

		const response = await client
			.visit("client.subscriptions.validate_step", { step: 2, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [2]);
	});

	test("it requires the BIC and one document for each KYC owner", async ({ client, assert }) => {
		const { company, subscription, user } = await createKycSubscription();
		const [physicalAddress, legalAddress] = await Promise.all([
			AddressFactory.create(),
			AddressFactory.create(),
		]);
		const [physicalOwner, legalOwner] = await Promise.all([
			CompanyBeneficialOwner.create({
				addressId: physicalAddress.id,
				companyId: company.id,
				firstName: "Jeanne",
				kind: CompanyBeneficialOwnerKind.PHYSICAL_PERSON,
				lastName: "Dupont",
			}),
			CompanyBeneficialOwner.create({
				addressId: legalAddress.id,
				companyId: company.id,
				kind: CompanyBeneficialOwnerKind.LEGAL_ENTITY,
				legalName: "Société Détentrice",
			}),
		]);
		const profile = await CompanyKycProfile.findByOrFail("companyId", company.id);
		await profile.merge({ bicId: true }).save();

		const incompleteResponse = await client
			.visit("client.subscriptions.validate_step", { step: 2, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		incompleteResponse.assertStatus(422);
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);

		for (const [type, ownerId] of [
			[SubscriptionDocumentType.BIC_IDENTIFICATION_CODE, null],
			[SubscriptionDocumentType.BENEFICIAL_OWNER_ID, physicalOwner.id],
			[SubscriptionDocumentType.BENEFICIAL_OWNER_RNE, legalOwner.id],
		] as const) {
			const file = await File.create({
				key: `subscriptions/${subscription.id}/${type}-${ownerId ?? "bic"}.pdf`,
				name: `${type}.pdf`,
				size: 1_024,
				type: "application/pdf",
			});
			await SubscriptionDocument.create({
				companyBeneficialOwnerId: ownerId,
				fileId: file.id,
				subscriptionId: subscription.id,
				type,
			});
		}

		const completeResponse = await client
			.visit("client.subscriptions.validate_step", { step: 2, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		completeResponse.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [2]);
	});

	test("it removes only the changed step after an automatic save", async ({ client, assert }) => {
		const { subscription, user } = await createCompleteSubscription();
		await subscription.merge({ completedSteps: [1, 2] }).save();

		const response = await client
			.visit("client.subscriptions.update_legal_identification", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ legalIdentification: { name: "Entreprise mise à jour" } });

		response.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [2]);
	});

	test("it removes only the invalidated step after a required document is deleted", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createCompleteSubscription();
		await subscription.merge({ completedSteps: [1, 2] }).save();

		const response = await client
			.visit("client.subscriptions.delete_document", {
				documentType: SubscriptionDocumentType.BANK_DETAILS,
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user);

		response.assertNoContent();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [2]);
	});
});
