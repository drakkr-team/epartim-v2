import { randomUUID } from "node:crypto";

import app from "@adonisjs/core/services/app";
import redis from "@adonisjs/redis/services/main";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import {
	article,
	dossier,
	FakeInpiClient,
	SIREN,
} from "#features/client/subscriptions/controllers/inpi/test_helpers";
import SubscriptionInpiArticlesService from "#features/client/subscriptions/services/inpi/articles.service";
import Address from "#models/address";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";
import Contact from "#models/contact";
import File from "#models/file";
import { SubscriptionStatus } from "#models/subscription";
import SubscriptionDocument, { SubscriptionDocumentType } from "#models/subscription_document";
import InpiClientService from "#services/inpi/client.service";

test.group("Features / Client / Subscriptions / INPI prefill", (group) => {
	let fake: FakeInpiClient;
	group.each.setup(() => {
		fake = new FakeInpiClient();
		app.container.swap(InpiClientService, () => fake);
		return () => app.container.restore(InpiClientService);
	});

	test("selective apply preserves absent values, contacts, files, and prevents replay duplicates", async ({
		client,
		assert,
	}) => {
		const { user, subscription, company, params } = await dossier();
		await company
			.merge({
				siren: SIREN,
				name: "Nom saisi",
				naf: "6201Z",
				vatNumber: "FR123",
				companyHeadcount: "12",
			})
			.save();
		const contact = await Contact.findOrFail(company.companyLegalAgentId);
		await contact.merge({ email: "synthetic@example.test", lastName: "Ancien" }).save();
		const file = await File.create({
			key: `tests/${randomUUID()}.pdf`,
			name: "identity.pdf",
			size: 10,
			type: "application/pdf",
		});
		const document = await SubscriptionDocument.create({
			subscriptionId: subscription.id,
			fileId: file.id,
			type: SubscriptionDocumentType.LEGAL_AGENT_ID,
		});
		await subscription
			.merge({
				completedSteps: [1, 2, 3, 4, 5],
				status: SubscriptionStatus.WAITING_FOR_EPARTIM_VALIDATION,
			})
			.save();
		const previewResponse = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		previewResponse.assertOk();
		const preview = previewResponse.body();
		assert.isTrue(preview.fields.find((field: { key: string }) => field.key === "name")?.selected);
		assert.isFalse(preview.fields.find((field: { key: string }) => field.key === "naf")?.selected);
		const payload = {
			previewId: preview.id,
			fields: ["siret" as const],
			ownerIds: [preview.people[0].id],
			legalAgentId: preview.people[0].id,
		};
		const first = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json(payload);
		first.assertOk();
		const replay = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json(payload);
		replay.assertOk();
		assert.deepEqual(replay.body(), first.body());
		await company.refresh();
		await subscription.refresh();
		await contact.refresh();
		assert.equal(company.name, "Nom saisi");
		assert.equal(company.naf, "6201Z");
		assert.equal(company.siret, `${SIREN}00012`);
		assert.equal(company.vatNumber, "FR123");
		assert.equal(contact.lastName, "Exemple");
		assert.equal(contact.email, "synthetic@example.test");
		assert.exists(await SubscriptionDocument.find(document.id));
		assert.exists(await File.find(file.id));
		const owners = await CompanyBeneficialOwner.query().where("companyId", company.id);
		assert.lengthOf(owners, 1);
		assert.isNull(owners[0].birthDate);
		assert.isNull(owners[0].shareholdingPercentage);
		assert.deepEqual(subscription.completedSteps, [3, 4, 5]);
		assert.equal(subscription.status, SubscriptionStatus.DRAFT);
	});

	test("a confirmed company change preserves unselected fields and invalidates all steps", async ({
		client,
		assert,
	}) => {
		const { user, subscription, company, params } = await dossier();
		const address = await Address.create({
			lineOne: "10 RUE EXISTANTE",
			lineTwo: "BATIMENT B",
			zip: "44000",
			city: "NANTES",
		});
		await address.refresh();
		const addressBefore = address.toJSON();
		await company
			.merge({
				siren: "987654321",
				siret: "98765432100019",
				name: "Ancienne",
				naf: "6201Z",
				legalForm: 6,
				financialYearClosingDay: "31/12",
				addressId: address.id,
				vatNumber: "FR987",
				companyHeadcount: "12",
			})
			.save();
		await subscription
			.merge({
				completedSteps: [1, 2, 3, 4, 5],
				status: SubscriptionStatus.WAITING_FOR_EPARTIM_VALIDATION,
			})
			.save();
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		assert.isTrue(preview.body().companyChangeRequired);
		assert.isTrue(
			preview
				.body()
				.fields.every(
					(field: { proposed: unknown; selected: boolean }) =>
						field.selected === (field.proposed !== null),
				),
		);
		const rejected = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, fields: ["name"], ownerIds: [] });
		rejected.assertStatus(409);
		await company.refresh();
		assert.equal(company.siren, "987654321");
		const fresh = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		fresh.assertOk();
		const applied = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json({
				previewId: fresh.body().id,
				fields: ["name"],
				ownerIds: [],
				confirmCompanyChange: true,
			});
		applied.assertOk();
		await company.refresh();
		await subscription.refresh();
		assert.equal(company.siren, SIREN);
		assert.equal(company.name, "Entreprise de test");
		assert.equal(company.naf, "6201Z");
		assert.equal(company.siret, "98765432100019");
		assert.equal(company.legalForm, 6);
		assert.equal(company.financialYearClosingDay, "31/12");
		assert.equal(company.addressId, address.id);
		await address.refresh();
		assert.deepEqual(address.toJSON(), addressBefore);
		assert.equal(company.vatNumber, "FR987");
		assert.equal(company.companyHeadcount, "12");
		assert.deepEqual(subscription.completedSteps, []);
		assert.equal(subscription.status, SubscriptionStatus.DRAFT);
	});

	test("an intervening autosave expires the preview and stale autosaves are rejected", async ({
		client,
		assert,
	}) => {
		const { user, company, params } = await dossier();
		await company.merge({ siren: SIREN }).save();
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		const updated = await client
			.visit("client.subscriptions.update_legal_identification", params)
			.withGuard("client")
			.loginAs(user)
			.header("x-subscription-revision", "0")
			.json({ legalIdentification: { name: "Sauvegarde récente" } });
		updated.assertOk();
		updated.assertHeader("x-subscription-revision", "1");
		const stale = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, fields: ["name"], ownerIds: [] });
		stale.assertStatus(409);
		const oldSave = await client
			.visit("client.subscriptions.update_legal_identification", params)
			.withGuard("client")
			.loginAs(user)
			.header("x-subscription-revision", "0")
			.json({ legalIdentification: { name: "Ancienne sauvegarde" } });
		oldSave.assertStatus(409);
		await company.refresh();
		assert.equal(company.name, "Sauvegarde récente");
	});

	test("a consumed preview cannot be replayed after an uncertain outcome", async ({
		client,
		assert,
	}) => {
		const { user, company, params } = await dossier();
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		await redis.hset(`inpi:preview:${preview.body().id}`, "state", "applying");
		const retry = await client
			.visit("client.subscriptions.inpi.apply", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, fields: ["name"], ownerIds: [] });
		retry.assertStatus(409);
		await company.refresh();
		assert.isNull(company.name);
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
		(
			await client
				.visit("client.subscriptions.inpi.apply", params)
				.withGuard("client")
				.loginAs(user)
				.json({ previewId: randomUUID(), fields: [], ownerIds: [] })
		).assertStatus(409);
	});

	test("manual SIREN changes remain available after INPI failure and cannot bypass confirmation", async ({
		client,
		assert,
	}) => {
		const { user, company, params } = await dossier();
		await company.merge({ siren: SIREN, name: "Saisie" }).save();
		fake.unavailable = true;
		(
			await client
				.visit("client.subscriptions.inpi.preview", params)
				.withGuard("client")
				.loginAs(user)
				.json({ siren: SIREN })
		).assertStatus(503);
		(
			await client
				.visit("client.subscriptions.update_legal_identification", params)
				.withGuard("client")
				.loginAs(user)
				.json({ legalIdentification: { siren: null } })
		).assertStatus(409);
		(
			await client
				.visit("client.subscriptions.update_legal_identification", params)
				.withGuard("client")
				.loginAs(user)
				.json({ legalIdentification: { siren: "987654321" }, confirmCompanyChange: true })
		).assertOk();
		await company.refresh();
		assert.equal(company.siren, "987654321");
		assert.equal(company.name, "Saisie");
	});

	test("PDF preview writes nothing and a failed attachment does not undo applied fields", async ({
		client,
		assert,
	}) => {
		const { user, subscription, company, params } = await dossier();
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
		(
			await client
				.visit("client.subscriptions.inpi.apply", params)
				.withGuard("client")
				.loginAs(user)
				.json({ previewId: preview.body().id, fields: ["name", "legalForm"], ownerIds: [] })
		).assertOk();
		fake.pdfUnavailable = true;
		(
			await client
				.visit("client.subscriptions.inpi.import_articles", params)
				.withGuard("client")
				.loginAs(user)
				.json({ previewId: preview.body().id, actId: article.id })
		).assertStatus(503);
		await company.refresh();
		assert.equal(company.name, "Entreprise de test");
		fake.pdfUnavailable = false;
		const imported = await client
			.visit("client.subscriptions.inpi.import_articles", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, actId: article.id });
		imported.assertCreated();
		const document = await SubscriptionDocument.query()
			.where("subscriptionId", subscription.id)
			.firstOrFail();
		assert.equal(document.inpiActId, article.id);
		assert.equal(document.type, SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION);
		const replay = await client
			.visit("client.subscriptions.inpi.import_articles", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, actId: article.id });
		replay.assertCreated();
		assert.equal(replay.body().id, imported.body().id);
	});
	test("PDF replacement is explicit and manual replacement clears INPI origin", async ({
		client,
		assert,
	}) => {
		const { user, subscription, company, params } = await dossier();
		await company.merge({ siren: SIREN, legalForm: 7 }).save();
		const old = await File.create({
			key: `tests/${randomUUID()}.pdf`,
			name: "manual.pdf",
			size: 10,
			type: "application/pdf",
		});
		const document = await SubscriptionDocument.create({
			subscriptionId: subscription.id,
			fileId: old.id,
			type: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
		});
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		const payload = { previewId: preview.body().id, actId: article.id };
		(
			await client
				.visit("client.subscriptions.inpi.import_articles", params)
				.withGuard("client")
				.loginAs(user)
				.json(payload)
		).assertStatus(409);
		const imported = await client
			.visit("client.subscriptions.inpi.import_articles", params)
			.withGuard("client")
			.loginAs(user)
			.json({ ...payload, replaceExisting: true });
		imported.assertCreated();
		assert.isNull(await File.find(old.id));
		const uploaded = await client
			.visit("client.subscriptions.upload_document", {
				...params,
				documentType: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
			})
			.withGuard("client")
			.loginAs(user)
			.file("file", Buffer.from("%PDF-1.4"), {
				contentType: "application/pdf",
				filename: "manual.pdf",
			});
		uploaded.assertCreated();
		await document.refresh();
		assert.isNull(document.inpiActId);
		assert.isNull(document.inpiSiren);
	});

	test("only an explicit INPI withdrawal removes an imported copy", async ({ client, assert }) => {
		const { user, subscription, company, params } = await dossier();
		await company.merge({ siren: SIREN }).save();
		const preview = await client
			.visit("client.subscriptions.inpi.preview", params)
			.withGuard("client")
			.loginAs(user)
			.json({ siren: SIREN });
		preview.assertOk();
		const imported = await client
			.visit("client.subscriptions.inpi.import_articles", params)
			.withGuard("client")
			.loginAs(user)
			.json({ previewId: preview.body().id, actId: article.id });
		imported.assertCreated();
		const service = await app.container.make(SubscriptionInpiArticlesService);
		assert.equal(await service.removeWithdrawnCopies(), 0);
		fake.withdrawn = true;
		await service.removeWithdrawnCopies();
		assert.isNull(await File.find(imported.body().id));
		assert.lengthOf(await SubscriptionDocument.query().where("subscriptionId", subscription.id), 0);
	});
});
