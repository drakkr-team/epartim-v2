import app from "@adonisjs/core/services/app";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import {
	article,
	dossier,
	FakeInpiClient,
	SIREN,
} from "#features/client/subscriptions/controllers/inpi/test_helpers";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";
import { SubscriptionStatus } from "#models/subscription";
import SubscriptionDocument from "#models/subscription_document";
import InpiClientService from "#services/inpi/client.service";

test.group("Features / Client / Subscriptions / INPI preview", (group) => {
	group.each.setup(() => {
		app.container.swap(InpiClientService, () => new FakeInpiClient());
		return () => app.container.restore(InpiClientService);
	});

	test("preview leaves the dossier untouched and ignores technical defaults", async ({
		client,
		assert,
	}) => {
		const { user, subscription, company, params } = await dossier();
		await company.merge({ siren: "987654321" }).save();
		const before = company.toJSON();
		const response = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		response.assertOk();
		assert.isFalse(response.body().companyChangeRequired);
		assert.isAbove(response.body().fields.length, 0);
		await company.refresh();
		await subscription.refresh();
		assert.deepEqual(company.toJSON(), before);
		assert.equal(subscription.editRevision, 0);
		assert.lengthOf(await CompanyBeneficialOwner.query().where("companyId", company.id), 0);
	});

	test("enforces session, ownership, status, and SIREN validation", async ({ client }) => {
		const { user, subscription, params } = await dossier();
		const other = await UserFactory.create();
		(
			await client.visit("client.subscriptions.inpi.preview", params).json({ siren: SIREN })
		).assertStatus(401);
		(
			await client
				.visit("client.subscriptions.inpi.preview", params)
				.withGuard("client")
				.loginAs(other)
				.json({ siren: SIREN })
		).assertStatus(403);
		(
			await client
				.visit("client.subscriptions.inpi.preview", params)
				.withGuard("client")
				.loginAs(user)
				.json({ siren: "abc" })
		).assertStatus(422);
		await subscription.merge({ status: SubscriptionStatus.COMPLETE }).save();
		(
			await client
				.visit("client.subscriptions.inpi.preview", params)
				.withGuard("client")
				.loginAs(user)
				.json({ siren: SIREN })
		).assertStatus(409);
	});

	test("PDF preview does not attach a document", async ({ client, assert }) => {
		const { user, subscription, params } = await dossier();
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		const pdf = await client
			.visit("client.subscriptions.inpi.preview_articles", {
				...params,
				previewId: preview.body().id,
				actId: article.id,
			})
			.withGuard("client")
			.loginAs(user);
		pdf.assertOk();
		pdf.assertHeader("content-type", "application/pdf");
		assert.lengthOf(await SubscriptionDocument.query().where("subscriptionId", subscription.id), 0);
	});

	test("an autosave advances the revision and stale autosaves are rejected", async ({
		client,
		assert,
	}) => {
		const { user, company, params } = await dossier();
		const updated = await client
			.visit("client.subscriptions.update_legal_identification", params)
			.withGuard("client")
			.loginAs(user)
			.header("x-subscription-revision", "0")
			.json({ legalIdentification: { name: "Sauvegarde récente" } });
		updated.assertOk();
		updated.assertHeader("x-subscription-revision", "1");
		const stale = await client
			.visit("client.subscriptions.update_legal_identification", params)
			.withGuard("client")
			.loginAs(user)
			.header("x-subscription-revision", "0")
			.json({ legalIdentification: { name: "Ancienne sauvegarde" } });
		stale.assertStatus(409);
		await company.refresh();
		assert.equal(company.name, "Sauvegarde récente");
	});
});
