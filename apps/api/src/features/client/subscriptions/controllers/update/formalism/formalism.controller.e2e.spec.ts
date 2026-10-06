import { test } from "@japa/runner";

import type { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import SubscriptionCseMember from "#models/subscription_cse_member";
import SubscriptionFormalism from "#models/subscription_formalism";
import SubscriptionFormalismEmployee from "#models/subscription_formalism_employee";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

test.group("Features / Client / Subscriptions / Formalism", () => {
	async function setup(
		headcount: string | null = "24",
		types: SubscriptionPlanAdhesionType[] = [1, 3],
	) {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.apply("draft")
			.merge({ createdBy: user.id })
			.create();
		const company = await CompanyFactory.merge({
			subscriptionId: subscription.id,
			companyHeadcount: headcount,
		}).create();
		const plan = await SubscriptionPlan.create({ subscriptionId: subscription.id });
		await SubscriptionPlanAdhesion.createMany(
			types.map((type) => ({ subscriptionPlanId: plan.id, type })),
		);
		return { user, subscription, company, plan };
	}

	test("it exposes empty formalism without writing and uses classic step validation", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		const view = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		view.assertOk();
		assert.lengthOf(view.body().formalism.groups, 2);
		assert.deepEqual(view.body().formalism.employees, []);
		assert.isNull(await SubscriptionFormalism.findBy("subscriptionId", subscription.id));
		const validated = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: "5" })
			.withGuard("client")
			.loginAs(user);
		validated.assertOk();
		assert.deepEqual(validated.body().completedSteps, [5]);
		assert.equal(validated.body().status, SubscriptionStatus.DRAFT);
	});

	test("it enforces allowed methods at the boundary and respects independent devices", async ({
		client,
		assert,
	}) => {
		for (const headcount of [null, "10", "11", "49", "50", "51"]) {
			const { user, subscription } = await setup(headcount, [3]);
			const inactive = await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 1 });
			inactive.assertStatus(422);
			for (const method of [1, 2, 3] as const) {
				const response = await client
					.visit("client.subscriptions.update_formalism_group", {
						subscriptionId: subscription.id,
						group: "2",
					})
					.withGuard("client")
					.loginAs(user)
					.json({ method });
				response.assertStatus(headcount !== null && method !== 3 ? 200 : 422);
			}
			const pei = await setup(headcount, [1]);
			const due = await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: pei.subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(pei.user)
				.json({ method: 3 });
			due.assertStatus(headcount !== null && Number(headcount) < 50 ? 200 : 422);
			assert.isNull(
				await SubscriptionFormalism.findBy("subscriptionId", subscription.id).then((record) =>
					record?.group === 1 ? record : null,
				),
			);
		}
	});

	test("it persists CSE drafts, checks formats and isolates members and the mandated signer", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		const params = { subscriptionId: subscription.id, group: "1" };
		const initial = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({ method: 1 });
		initial.assertOk();
		assert.lengthOf(initial.body().members, 1);
		const memberId = String(initial.body().members[0].id);
		const updated = await client
			.visit("client.subscriptions.update_formalism_member", { ...params, memberId })
			.withGuard("client")
			.loginAs(user)
			.json({ firstName: "  Alice ", email: " ALICE@EXAMPLE.COM ", attending: false });
		updated.assertOk();
		assert.equal(updated.body().firstName, "Alice");
		assert.equal(updated.body().email, "alice@example.com");
		assert.isFalse(updated.body().attending);
		const meeting = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({
				meetingDate: "2026-10-05",
				closingTime: "09:05",
				votesFor: 0,
				presidentFirstName: "Jean",
				mandatedMemberId: Number(memberId),
			});
		meeting.assertOk();
		const partial = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({ meetingCity: null });
		partial.assertOk();
		assert.equal(partial.body().meetingDate, "2026-10-05");
		assert.equal(partial.body().mandatedMemberId, Number(memberId));
		for (const payload of [
			{ meetingDate: "2026-02-30" },
			{ closingTime: "24:00" },
			{ votesFor: -1 },
			{ votesFor: 1.2 },
			{ presidentEmail: "invalid" },
			{ meetingCity: "a".repeat(121) },
		]) {
			const response = await client
				.visit("client.subscriptions.update_formalism_group", params)
				.withGuard("client")
				.loginAs(user)
				.unsafeJson(payload);
			response.assertStatus(422);
		}
		const second = await client
			.visit("client.subscriptions.update_formalism_group", { ...params, group: "2" })
			.withGuard("client")
			.loginAs(user)
			.json({ method: 1 });
		second.assertOk();
		const foreignMember = String(second.body().members[0].id);
		const crossGroup = await client
			.visit("client.subscriptions.update_formalism_member", { ...params, memberId: foreignMember })
			.withGuard("client")
			.loginAs(user)
			.json({ firstName: "Wrong" });
		crossGroup.assertStatus(404);
		const crossSigner = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({ mandatedMemberId: Number(foreignMember) });
		crossSigner.assertStatus(404);
		const invalidId = await client
			.visit("client.subscriptions.update_formalism_member", { ...params, memberId: "abc" })
			.withGuard("client")
			.loginAs(user)
			.json({ firstName: "Wrong" });
		invalidId.assertStatus(422);
	});

	test("it replaces CSE people through group updates and preserves the destination meeting and votes", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		const source = await client
			.visit("client.subscriptions.update_formalism_group", {
				subscriptionId: subscription.id,
				group: "1",
			})
			.withGuard("client")
			.loginAs(user)
			.json({ method: 1, presidentFirstName: "Jean", meetingCity: "Lyon" });
		source.assertOk();
		const memberId = String(source.body().members[0].id);
		(
			await client
				.visit("client.subscriptions.update_formalism_member", {
					subscriptionId: subscription.id,
					group: "1",
					memberId,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ firstName: "Alice", attending: true, function: 1 })
		).assertOk();
		const sourcePeople = await client
			.visit("client.subscriptions.update_formalism_group", {
				subscriptionId: subscription.id,
				group: "1",
			})
			.withGuard("client")
			.loginAs(user)
			.json({ mandatedMemberId: Number(memberId) });
		sourcePeople.assertOk();
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "2",
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					method: 1,
					meetingCity: "Paris",
					meetingDate: "2026-10-06",
					closingTime: "18:15",
					votesFor: 2,
					votesAgainst: 1,
					votesAbstentions: 0,
				})
		).assertOk();
		const copied = await client
			.visit("client.subscriptions.update_formalism_group", {
				subscriptionId: subscription.id,
				group: "2",
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				presidentFirstName: sourcePeople.body().presidentFirstName,
				presidentLastName: sourcePeople.body().presidentLastName,
				presidentEmail: sourcePeople.body().presidentEmail,
				members: sourcePeople.body().members.map((member) => ({
					firstName: member.firstName,
					lastName: member.lastName,
					email: member.email,
					function: member.function,
					attending: member.attending,
					mandated: member.id === sourcePeople.body().mandatedMemberId,
				})),
			});
		copied.assertOk();
		assert.equal(copied.body().meetingCity, "Paris");
		assert.equal(copied.body().meetingDate, "2026-10-06");
		assert.equal(copied.body().closingTime, "18:15");
		assert.equal(copied.body().votesFor, 2);
		assert.equal(copied.body().votesAgainst, 1);
		assert.equal(copied.body().votesAbstentions, 0);
		assert.lengthOf(copied.body().members, 1);
		assert.equal(copied.body().members[0].function, 1);
		assert.isTrue(copied.body().members[0].attending);
		assert.equal(copied.body().presidentFirstName, "Jean");
		assert.notEqual(copied.body().members[0].id, Number(memberId));
		assert.equal(copied.body().mandatedMemberId, copied.body().members[0].id);
		(
			await client
				.visit("client.subscriptions.update_formalism_member", {
					subscriptionId: subscription.id,
					group: "1",
					memberId,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ firstName: "Changed" })
		).assertOk();
		assert.equal(
			(await SubscriptionCseMember.findOrFail(copied.body().members[0].id)).firstName,
			"Alice",
		);
	});

	test("it rejects invalid member replacements without overwriting the saved CSE", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		const params = { subscriptionId: subscription.id, group: "2" };
		const initial = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({ method: 1, presidentFirstName: "Jean", meetingCity: "Paris" });
		initial.assertOk();
		const memberId = initial.body().members[0].id;
		for (const payload of [
			{ members: [{ email: "invalid", mandated: false }] },
			{ members: [{ mandated: true }, { mandated: true }] },
			{ members: [{ mandated: true }], mandatedMemberId: memberId },
			{ members: [{ mandated: false, function: 99 }] },
			{ method: 2, members: [{ mandated: false }] },
		]) {
			const response = await client
				.visit("client.subscriptions.update_formalism_group", params)
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ ...payload, presidentFirstName: "Changed" });
			response.assertStatus(422);
			const group = await SubscriptionFormalism.query()
				.where("subscriptionId", subscription.id)
				.where("group", 2)
				.firstOrFail();
			assert.equal(group.presidentFirstName, "Jean");
			assert.equal(group.method, 1);
			const members = await SubscriptionCseMember.query().where(
				"subscriptionFormalismId",
				group.id,
			);
			assert.deepEqual(
				members.map((member) => member.id),
				[memberId],
			);
		}
		const draft = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({
				members: [
					{ firstName: " Alice ", email: " ALICE@EXAMPLE.COM ", mandated: false },
					{ mandated: false },
				],
			});
		draft.assertOk();
		assert.lengthOf(draft.body().members, 2);
		assert.equal(draft.body().members[0].firstName, "Alice");
		assert.equal(draft.body().members[0].email, "alice@example.com");
		assert.isNull(draft.body().members[1].firstName);
		assert.isNull(draft.body().mandatedMemberId);
		assert.equal(draft.body().meetingCity, "Paris");
		const partial = await client
			.visit("client.subscriptions.update_formalism_group", params)
			.withGuard("client")
			.loginAs(user)
			.json({ meetingCity: "Lyon" });
		partial.assertOk();
		assert.deepEqual(partial.body().members, draft.body().members);
	});

	test("it preserves common employees until the last ratification is removed and clears CSE data", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		for (const group of ["1", "2"])
			(
				await client
					.visit("client.subscriptions.update_formalism_group", {
						subscriptionId: subscription.id,
						group,
					})
					.withGuard("client")
					.loginAs(user)
					.json({ method: 2 })
			).assertOk();
		const created = await client
			.visit("client.subscriptions.create_formalism_employee", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		created.assertOk();
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 1, meetingCity: "Paris" })
		).assertOk();
		assert.isNotNull(await SubscriptionFormalismEmployee.find(created.body().id));
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "2",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 1 })
		).assertOk();
		assert.isNull(await SubscriptionFormalismEmployee.find(created.body().id));
		const due = await client
			.visit("client.subscriptions.update_formalism_group", {
				subscriptionId: subscription.id,
				group: "1",
			})
			.withGuard("client")
			.loginAs(user)
			.json({ method: 3 });
		due.assertOk();
		assert.isNull(due.body().meetingCity);
		assert.deepEqual(due.body().members, []);
	});

	test("it imports CSV atomically, appends rows, ignores exact duplicates and reports conflicts by line", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup();
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 2 })
		).assertOk();
		const initial = await client
			.visit("client.subscriptions.import_formalism_employees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.file(
				"file",
				Buffer.from(
					'\ufeffnom;prénom;email\nDupont;Alice;ALICE@EXAMPLE.COM\n"Durand, Martin";Bob;bob@example.com\n',
				),
				{ filename: "employees.csv", contentType: "text/csv" },
			);
		initial.assertOk();
		assert.equal(initial.body().added, 2);
		const repeated = await client
			.visit("client.subscriptions.import_formalism_employees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.file(
				"file",
				Buffer.from(
					"nom,prénom,email\nDupont,Alice,alice@example.com\nPetit,Chloé,chloe@example.com\nPetit,Chloé,chloe@example.com",
				),
				{ filename: "employees.csv", contentType: "text/csv" },
			);
		repeated.assertOk();
		assert.equal(repeated.body().added, 1);
		assert.equal(repeated.body().skipped, 2);
		for (const invalid of [
			"nom,prénom,email\nNew,Person,new@example.com\nOther,Alice,alice@example.com",
			"nom,prénom,email\nNew,Person,new@example.com\nInvalid,Person,not-email",
			'nom,prénom,email\nNew,Person,new@example.com\n"Unclosed,Person,invalid@example.com',
		]) {
			const response = await client
				.visit("client.subscriptions.import_formalism_employees", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.file("file", Buffer.from(invalid), { filename: "employees.csv", contentType: "text/csv" });
			response.assertStatus(422);
			assert.include(JSON.stringify(response.body()), "Ligne 3");
			assert.lengthOf(
				await SubscriptionFormalismEmployee.query().where("subscriptionId", subscription.id),
				3,
			);
		}
	});

	test("it invalidates formalism only on actual dependency changes and clears unavailable choices", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup("49");
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 3 })
		).assertOk();
		await subscription.merge({ completedSteps: [1, 2, 3, 4, 5] }).save();
		(
			await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ legalIdentification: { companyHeadcount: 49 } })
		).assertOk();
		assert.include((await Subscription.findOrFail(subscription.id)).completedSteps, 5);
		(
			await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ legalIdentification: { companyHeadcount: 50 } })
		).assertOk();
		assert.notInclude((await Subscription.findOrFail(subscription.id)).completedSteps, 5);
		const formalism = await SubscriptionFormalism.findByOrFail("subscriptionId", subscription.id);
		assert.isNull(formalism.method);
		assert.isTrue(formalism.methodInvalidated);
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 1 })
		).assertOk();
		await subscription.refresh();
		await subscription.merge({ completedSteps: [3, 4, 5] }).save();
		(
			await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ adhesionTypes: [3, 1] })
		).assertOk();
		assert.include((await Subscription.findOrFail(subscription.id)).completedSteps, 5);
		(
			await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ adhesionTypes: [3] })
		).assertOk();
		assert.isNull(await SubscriptionFormalism.find(formalism.id));
		assert.deepEqual(
			await SubscriptionCseMember.query().where("subscriptionFormalismId", formalism.id),
			[],
		);
		assert.notInclude((await Subscription.findOrFail(subscription.id)).completedSteps, 5);
	});

	test("it requires the creator and isolates employees between subscriptions", async ({
		client,
	}) => {
		const { user, subscription } = await setup();
		const other = await setup();
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.json({ method: 2 })
		).assertStatus(401);
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: subscription.id,
					group: "1",
				})
				.withGuard("client")
				.loginAs(other.user)
				.json({ method: 2 })
		).assertStatus(403);
		(
			await client
				.visit("client.subscriptions.update_formalism_group", {
					subscriptionId: 2147483647,
					group: "1",
				})
				.withGuard("client")
				.loginAs(user)
				.json({ method: 2 })
		).assertStatus(404);
		for (const item of [{ user, subscription }, other])
			(
				await client
					.visit("client.subscriptions.update_formalism_group", {
						subscriptionId: item.subscription.id,
						group: "1",
					})
					.withGuard("client")
					.loginAs(item.user)
					.json({ method: 2 })
			).assertOk();
		const person = await client
			.visit("client.subscriptions.create_formalism_employee", {
				subscriptionId: other.subscription.id,
			})
			.withGuard("client")
			.loginAs(other.user);
		person.assertOk();
		(
			await client
				.visit("client.subscriptions.update_formalism_employee", {
					subscriptionId: subscription.id,
					employeeId: String(person.body().id),
				})
				.withGuard("client")
				.loginAs(user)
				.json({ firstName: "Wrong" })
		).assertStatus(404);
	});
});
