import { test } from "@japa/runner";

import { USER_ROLES, type UserRole } from "#constants/user";
import { AdminFactory } from "#database/factories/admin.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import CreateSubscriptionPolicy from "#features/client/subscriptions/policies/create.policy";
import ListSubscriptionsPolicy from "#features/client/subscriptions/policies/list.policy";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import { SubscriptionDocumentType } from "#models/subscription_document";

async function createFirm(networkId: number | null = null) {
	return FirmFactory.merge({ networkId })
		.with("address")
		.with("paymentDetail")
		.with("commissionRate")
		.create();
}

async function createAccessFixture(role: UserRole) {
	const network = await NetworkFactory.with("address")
		.with("paymentDetail")
		.with("commissionRate")
		.create();
	const firm = await createFirm(network.id);
	const networkFirm = await createFirm(network.id);
	const otherNetwork = await NetworkFactory.with("address")
		.with("paymentDetail")
		.with("commissionRate")
		.create();
	const outsideFirm = await createFirm(otherNetwork.id);
	const user = await UserFactory.merge({ role, firmId: firm.id }).create();
	const colleague = await UserFactory.merge({ firmId: firm.id }).create();
	const networkColleague = await UserFactory.merge({ firmId: networkFirm.id }).create();
	const outsider = await UserFactory.merge({ firmId: outsideFirm.id }).create();
	const search = `access-scope-${user.id}`;
	const subscriptions = [];
	const owners = [user, colleague, networkColleague, outsider, null];
	const statuses = [
		SubscriptionStatus.DRAFT,
		SubscriptionStatus.WAITING_FOR_EPARTIM_VALIDATION,
		SubscriptionStatus.COMPLETE,
		SubscriptionStatus.DRAFT,
		SubscriptionStatus.COMPLETE,
	];
	for (const [index, owner] of owners.entries()) {
		const subscription = await SubscriptionFactory.merge({
			createdBy: owner?.id ?? null,
			status: statuses[index],
		}).create();
		const company = await CompanyFactory.merge({
			subscriptionId: subscription.id,
			name: `${search}-${index}`,
		}).create();
		subscriptions.push({ subscription, company });
	}
	return {
		user,
		colleague,
		networkColleague,
		firm,
		networkFirm,
		outsideFirm,
		subscriptions,
		search,
	};
}

test.group("Features / Client / Subscriptions / Controllers / Access", () => {
	for (const role of Object.values(USER_ROLES)) {
		test(`it scopes lists, counts, reads and writes for role ${role}`, async ({
			client,
			assert,
		}) => {
			const { user, subscriptions, search } = await createAccessFixture(role);
			const allowedCount = {
				[USER_ROLES.USER]: 1,
				[USER_ROLES.FIRM]: 2,
				[USER_ROLES.NETWORK]: 3,
				[USER_ROLES.ADMIN]: 5,
			}[role];
			const allowed = subscriptions.slice(0, allowedCount);
			const counts = {
				draft: role === USER_ROLES.ADMIN ? 2 : 1,
				validating: role === USER_ROLES.USER ? 0 : 1,
				finalized: role === USER_ROLES.ADMIN ? 2 : role === USER_ROLES.NETWORK ? 1 : 0,
			};
			const list = await client
				.visit("client.subscriptions.list")
				.withGuard("client")
				.loginAs(user)
				.qs({ q: search });
			list.assertOk();
			assert.sameMembers(
				list.body().data.map((item) => item.id),
				allowed.map(({ subscription }) => subscription.id),
			);
			list.assertBodyContains({
				meta: { total: allowedCount, canCreate: true, statusCounts: counts },
			});

			const page = await client
				.visit("client.subscriptions.list")
				.withGuard("client")
				.loginAs(user)
				.qs({ q: search, status: "draft", perPage: 1 });
			page.assertOk();
			assert.lengthOf(page.body().data, 1);
			page.assertBodyContains({ meta: { total: counts.draft, statusCounts: counts } });

			for (const [index, { subscription, company }] of subscriptions.entries()) {
				const canAccess = index < allowedCount;
				const params = { subscriptionId: subscription.id };
				const view = await client
					.visit("client.subscriptions.view", params)
					.withGuard("client")
					.loginAs(user);
				view.assertStatus(canAccess ? 200 : 403);
				if (canAccess) {
					view.assertBodyContains({ meta: { canUpdate: true } });
					if (subscription.createdBy === null) view.assertBodyContains({ creator: { name: null } });
				}

				const updatedName = `Updated ${company.name}`;
				const update = await client
					.visit("client.subscriptions.update_legal_identification", params)
					.withGuard("client")
					.loginAs(user)
					.json({ legalIdentification: { name: updatedName } });
				update.assertStatus(canAccess ? 200 : 403);
				await company.refresh();
				assert.equal(company.name, canAccess ? updatedName : `${search}-${index}`);
				await subscription.refresh();
				assert.equal(subscription.editRevision, canAccess ? 1 : 0);

				const validate = await client
					.visit("client.subscriptions.validate_step", { ...params, step: 4 })
					.withGuard("client")
					.loginAs(user);
				validate.assertStatus(canAccess ? 200 : 403);

				const documentParams = { ...params, documentType: SubscriptionDocumentType.BANK_DETAILS };
				const upload = await client
					.visit("client.subscriptions.upload_document", documentParams)
					.withGuard("client")
					.loginAs(user)
					.file("file", Buffer.from("%PDF-1.4"), {
						filename: "bank-details.pdf",
						contentType: "application/pdf",
					});
				upload.assertStatus(canAccess ? 201 : 403);
				const remove = await client
					.visit("client.subscriptions.delete_document", documentParams)
					.withGuard("client")
					.loginAs(user);
				remove.assertStatus(canAccess ? 204 : 403);

				if (!canAccess) {
					const reference = `BSE-${subscription.createdAt.year}-${String(subscription.id).padStart(4, "0")}`;
					const searchByReference = await client
						.visit("client.subscriptions.list")
						.withGuard("client")
						.loginAs(user)
						.qs({ q: reference });
					searchByReference.assertOk();
					searchByReference.assertBodyContains({
						data: [],
						meta: { total: 0, statusCounts: { draft: 0, validating: 0, finalized: 0 } },
					});
					const preview = await client
						.visit("client.subscriptions.inpi.preview", params)
						.withGuard("client")
						.loginAs(user)
						.json({ siren: "843912906" });
					preview.assertStatus(403);
				}
			}

			const create = await client
				.visit("client.subscriptions.create")
				.withGuard("client")
				.loginAs(user);
			create.assertCreated();
			assert.equal((await Subscription.findOrFail(create.body().id)).createdBy, user.id);
		});
	}

	test("it follows the current firm and network without changing the creator", async ({
		client,
		assert,
	}) => {
		const { user, colleague, networkColleague, firm, outsideFirm, subscriptions } =
			await createAccessFixture(USER_ROLES.FIRM);
		const subscription = subscriptions[1].subscription;
		const newFirmUser = await UserFactory.merge({
			role: USER_ROLES.FIRM,
			firmId: outsideFirm.id,
		}).create();
		await networkColleague.merge({ role: USER_ROLES.NETWORK }).save();
		assert.isTrue(await user.can("access:subscription", subscription));
		assert.isTrue(await networkColleague.can("access:subscription", subscription));
		await colleague.merge({ firmId: outsideFirm.id }).save();
		assert.isFalse(await user.can("access:subscription", subscription));
		assert.isFalse(await networkColleague.can("access:subscription", subscription));
		assert.isTrue(await newFirmUser.can("access:subscription", subscription));
		await subscription.refresh();
		assert.equal(subscription.createdBy, colleague.id);
		const list = await client.visit("client.subscriptions.list").withGuard("client").loginAs(user);
		list.assertOk();
		assert.notInclude(
			list.body().data.map((item) => item.id),
			subscription.id,
		);

		await outsideFirm.merge({ networkId: firm.networkId }).save();
		assert.isTrue(await networkColleague.can("access:subscription", subscription));
	});

	test("a network user without a network only accesses personal subscriptions", async ({
		client,
		assert,
	}) => {
		const { user, firm, subscriptions, search } = await createAccessFixture(USER_ROLES.NETWORK);
		await firm.merge({ networkId: null }).save();
		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(user)
			.qs({ q: search });
		response.assertOk();
		assert.deepEqual(
			response.body().data.map((item) => item.id),
			[subscriptions[0].subscription.id],
		);
		assert.isFalse(await user.can("access:subscription", subscriptions[1].subscription));
		assert.isFalse(await user.can("access:subscription", subscriptions[3].subscription));
	});

	test("it limits a missing firm to personal dossiers and denies an unknown role", async ({
		client,
		assert,
	}) => {
		const { user, firm, subscriptions } = await createAccessFixture(USER_ROLES.FIRM);
		user.$setAttribute("firmId", null);
		assert.isTrue(await user.can("access:subscription", subscriptions[0].subscription));
		assert.isFalse(await user.can("access:subscription", subscriptions[1].subscription));
		const personal = await Subscription.query().apply((scopes) => scopes.accessibleTo(user));
		assert.deepEqual(
			personal.map((subscription) => subscription.id),
			[subscriptions[0].subscription.id],
		);

		user.$setAttribute("role", -1);
		assert.isFalse(await user.can("list:subscription"));
		assert.isFalse(await user.can("create:subscription"));
		assert.isFalse(await user.can("access:subscription", subscriptions[0].subscription));
		assert.isEmpty(await Subscription.query().apply((scopes) => scopes.accessibleTo(user)));

		await user.merge({ firmId: firm.id }).save();
		const list = await client.visit("client.subscriptions.list").withGuard("client").loginAs(user);
		list.assertStatus(403);
		const create = await client
			.visit("client.subscriptions.create")
			.withGuard("client")
			.loginAs(user);
		create.assertStatus(403);
		const view = await client
			.visit("client.subscriptions.view", {
				subscriptionId: subscriptions[0].subscription.id,
			})
			.withGuard("client")
			.loginAs(user);
		view.assertStatus(403);
	});

	test("it rejects back-office admins even when their ID matches the creator", async ({
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const subscription = new Subscription();
		subscription.createdBy = admin.id;
		assert.isFalse(await new AccessSubscriptionPolicy().handle(admin, subscription));
		assert.isFalse(await new ListSubscriptionsPolicy().handle(admin));
		assert.isFalse(await new CreateSubscriptionPolicy().handle(admin));
	});
});
