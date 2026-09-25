import { test } from "@japa/runner";

import { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import File from "#models/file";
import Subscription from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";
import SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

const agreementTypes = [12, 13, 14, 15, 16];
const pdf = Buffer.from("%PDF-1.4");

test.group("Features / Client / Subscriptions / Controllers / Agreement Documents", () => {
	async function createSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.apply("draft")
			.merge({ createdBy: user.id, completedSteps: [1, 2] })
			.create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();
		const plan = await SubscriptionPlan.create({ subscriptionId: subscription.id });
		await SubscriptionPlanAdhesion.create({
			subscriptionPlanId: plan.id,
			type: SubscriptionPlanAdhesionType.PEI_EPARTIM,
		});
		return { subscription, user, plan };
	}

	test("it requires an explicit seniority but accepts all four choices without agreements", async ({
		client,
		assert,
	}) => {
		const { subscription, user, plan } = await createSubscription();
		const incomplete = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
			.withGuard("client")
			.loginAs(user);
		incomplete.assertStatus(422);
		assert.include(incomplete.text(), "contractCharacteristics.minimumSeniorityMonths");
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1, 2]);

		for (const months of [0, 1, 2, 3]) {
			await plan.merge({ minimumSeniorityMonths: months }).save();
			const response = await client
				.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
				.withGuard("client")
				.loginAs(user);
			response.assertOk();
		}
		const view = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		view.assertOk();
		assert.deepEqual(view.body().contractDocuments, []);
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1, 2, 3]);
	});

	test("it requires the details and all five documents, then revalidates after a deletion", async ({
		client,
		assert,
	}) => {
		const { subscription, user, plan } = await createSubscription();
		await plan
			.merge({
				minimumSeniorityMonths: 0,
				otherAgreementDetails: "   ",
			})
			.save();
		await SubscriptionExistingAgreement.createMany(
			Object.values(SubscriptionAgreement).map((type) => ({
				subscriptionId: subscription.id,
				type,
			})),
		);
		const missingDetails = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
			.withGuard("client")
			.loginAs(user);
		missingDetails.assertStatus(422);
		assert.include(missingDetails.text(), "contractCharacteristics.otherAgreementDetails");
		await plan.merge({ otherAgreementDetails: "CET" }).save();
		const missingDocuments = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
			.withGuard("client")
			.loginAs(user);
		missingDocuments.assertStatus(422);
		for (const type of agreementTypes)
			assert.include(missingDocuments.text(), `documents.${type}.subscription`);

		for (const documentType of agreementTypes) {
			const upload = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType,
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", pdf, {
					contentType: "application/pdf",
					filename: `agreement-${documentType}.pdf`,
				});
			upload.assertCreated();
		}
		const view = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		view.assertOk();
		assert.deepEqual(
			view.body().contractDocuments.map((document: { type: number }) => document.type),
			agreementTypes,
		);
		assert.isTrue(
			view
				.body()
				.contractDocuments.every(
					(document) => document.status === "attached" && Boolean(document.file?.url),
				),
		);
		view.assertBodyContains({
			contractCharacteristics: {
				existingAgreements: Object.values(SubscriptionAgreement),
				otherAgreementDetails: "CET",
				minimumSeniorityMonths: 0,
			},
		});
		const complete = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
			.withGuard("client")
			.loginAs(user);
		complete.assertOk();

		const remove = await client
			.visit("client.subscriptions.delete_document", {
				subscriptionId: subscription.id,
				documentType: 12,
			})
			.withGuard("client")
			.loginAs(user);
		remove.assertNoContent();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1, 2]);
		const incomplete = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: 3 })
			.withGuard("client")
			.loginAs(user);
		incomplete.assertStatus(422);
	});

	test("it removes only deselected agreement documents and never restores them on reselection", async ({
		client,
		assert,
	}) => {
		const { subscription, user, plan } = await createSubscription();
		await plan.merge({ otherAgreementDetails: "CET" }).save();
		await SubscriptionExistingAgreement.createMany(
			[SubscriptionAgreement.PARTICIPATION, SubscriptionAgreement.OTHER].map((type) => ({
				subscriptionId: subscription.id,
				type,
			})),
		);
		const uploadedIds = [];
		for (const documentType of [12, 16]) {
			const upload = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType,
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", pdf, { contentType: "application/pdf", filename: `${documentType}.pdf` });
			upload.assertCreated();
			uploadedIds.push(upload.body().id);
		}
		await subscription.merge({ completedSteps: [1, 2, 3] }).save();
		const deselect = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				contractCharacteristics: { existingAgreements: [SubscriptionAgreement.PARTICIPATION] },
			});
		deselect.assertOk();
		assert.isNull(deselect.body().otherAgreementDetails);
		assert.isNull(await File.find(uploadedIds[1]));
		assert.isNotNull(await File.find(uploadedIds[0]));
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1, 2]);

		const reselect = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				contractCharacteristics: {
					existingAgreements: [SubscriptionAgreement.PARTICIPATION, SubscriptionAgreement.OTHER],
				},
			});
		reselect.assertOk();
		assert.isNull(reselect.body().otherAgreementDetails);
		assert.isNull(
			await SubscriptionDocument.query()
				.where("subscriptionId", subscription.id)
				.where("type", SubscriptionDocumentType.OTHER_AGREEMENT)
				.first(),
		);
	});

	test("it rejects unselected agreements, wrong owners, invalid formats and oversized files", async ({
		client,
	}) => {
		const { subscription, user } = await createSubscription();
		const unselected = await client
			.visit("client.subscriptions.upload_document", {
				subscriptionId: subscription.id,
				documentType: 12,
			})
			.withGuard("client")
			.loginAs(user)
			.file("file", pdf, { contentType: "application/pdf", filename: "agreement.pdf" });
		unselected.assertStatus(422);
		await SubscriptionExistingAgreement.create({
			subscriptionId: subscription.id,
			type: SubscriptionAgreement.PARTICIPATION,
		});
		const wrongOwner = await client
			.visit("client.subscriptions.upload_document", {
				subscriptionId: subscription.id,
				documentType: 12,
			})
			.withGuard("client")
			.loginAs(user)
			.qs({ ownerId: 1 })
			.file("file", pdf, { contentType: "application/pdf", filename: "agreement.pdf" });
		wrongOwner.assertStatus(422);
		for (const [file, filename, contentType] of [
			[Buffer.from("invalid"), "agreement.exe", "application/octet-stream"],
			[Buffer.concat([pdf, Buffer.alloc(10 * 1024 * 1024)]), "agreement.pdf", "application/pdf"],
		] as const) {
			const response = await client
				.visit("client.subscriptions.upload_document", {
					subscriptionId: subscription.id,
					documentType: 12,
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", file, { contentType, filename });
			response.assertStatus(422);
		}
	});
});
