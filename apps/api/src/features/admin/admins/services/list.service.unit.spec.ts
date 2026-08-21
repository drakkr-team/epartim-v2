import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { AdminFactory } from "#database/factories/admin.factory";
import ListAdminsService from "#features/admin/admins/services/list.service";
import Admin from "#models/admin";

test.group("Features / Admin / Admins / Services / List Service", () => {
	test("it should order admins by creation date descending by default", async ({ assert }) => {
		const olderAdmin = await AdminFactory.merge({ name: "DefaultOrder Older" }).create();
		const newerAdmin = await AdminFactory.merge({ name: "DefaultOrder Newer" }).create();
		await Admin.query()
			.where("id", olderAdmin.id)
			.update({ createdAt: DateTime.fromISO("2025-01-01T00:00:00.000Z") });
		await Admin.query()
			.where("id", newerAdmin.id)
			.update({ createdAt: DateTime.fromISO("2025-02-01T00:00:00.000Z") });

		const admins = await new ListAdminsService().handle({ q: "DefaultOrder" });

		assert.deepEqual(
			admins.map((admin) => admin.id),
			[newerAdmin.id, olderAdmin.id],
		);
	});

	test("it should search case-insensitively by name and email", async ({ assert }) => {
		const nameMatch = await AdminFactory.merge({
			name: "Alice Martin",
			email: "alice@example.com",
		}).create();
		const emailMatch = await AdminFactory.merge({
			name: "Bob Dupont",
			email: "support@acme.example",
		}).create();
		await AdminFactory.merge({
			name: "Charlie Durand",
			email: "charlie@example.com",
		}).create();

		const admins = await new ListAdminsService().handle({ q: "ALICE acme" });

		assert.sameMembers(
			admins.map((admin) => admin.id),
			[nameMatch.id, emailMatch.id],
		);
	});

	test("it should ignore extra spaces in the search query", async ({ assert }) => {
		const matchingAdmin = await AdminFactory.merge({ name: "WhitespaceAliceUnique" }).create();
		await AdminFactory.merge({ name: "WhitespaceBobUnique" }).create();

		const admins = await new ListAdminsService().handle({ q: "  WhitespaceAliceUnique   " });

		assert.deepEqual(
			admins.map((admin) => admin.id),
			[matchingAdmin.id],
		);
	});

	const textOrderScenarios = [
		{ orderBy: "name", first: "Alpha", second: "Zulu" },
		{ orderBy: "email", first: "alpha@example.com", second: "zulu@example.com" },
	] as const;

	for (const scenario of textOrderScenarios) {
		test(`it should order admins by ${scenario.orderBy}`, async ({ assert }) => {
			const marker = `TextOrder${scenario.orderBy}`;
			const firstAdmin = await AdminFactory.merge({
				name: scenario.orderBy === "name" ? `${marker} ${scenario.first}` : `${marker} First`,
				email:
					scenario.orderBy === "email"
						? `${marker.toLowerCase()}.${scenario.first}`
						: `${marker.toLowerCase()}.first@example.com`,
			}).create();
			const secondAdmin = await AdminFactory.merge({
				name: scenario.orderBy === "name" ? `${marker} ${scenario.second}` : `${marker} Second`,
				email:
					scenario.orderBy === "email"
						? `${marker.toLowerCase()}.${scenario.second}`
						: `${marker.toLowerCase()}.second@example.com`,
			}).create();
			const service = new ListAdminsService();

			const ascending = await service.handle({
				q: marker,
				orderBy: `${scenario.orderBy}_asc`,
			});
			const descending = await service.handle({
				q: marker,
				orderBy: `${scenario.orderBy}_desc`,
			});

			assert.deepEqual(
				ascending.map((admin) => admin.id),
				[firstAdmin.id, secondAdmin.id],
			);
			assert.deepEqual(
				descending.map((admin) => admin.id),
				[secondAdmin.id, firstAdmin.id],
			);
		});
	}

	test("it should order admins by id", async ({ assert }) => {
		const firstAdmin = await AdminFactory.merge({ name: "IdOrder First" }).create();
		const secondAdmin = await AdminFactory.merge({ name: "IdOrder Second" }).create();
		const service = new ListAdminsService();

		const ascending = await service.handle({ q: "IdOrder", orderBy: "id_asc" });
		const descending = await service.handle({ q: "IdOrder", orderBy: "id_desc" });

		assert.deepEqual(
			ascending.map((admin) => admin.id),
			[firstAdmin.id, secondAdmin.id],
		);
		assert.deepEqual(
			descending.map((admin) => admin.id),
			[secondAdmin.id, firstAdmin.id],
		);
	});

	test("it should order admins by activation date", async ({ assert }) => {
		const firstAdmin = await AdminFactory.merge({
			name: "ActivationOrder First",
			activatedAt: DateTime.fromISO("2025-01-01T00:00:00.000Z"),
		}).create();
		const secondAdmin = await AdminFactory.merge({
			name: "ActivationOrder Second",
			activatedAt: DateTime.fromISO("2025-02-01T00:00:00.000Z"),
		}).create();
		const service = new ListAdminsService();

		const ascending = await service.handle({
			q: "ActivationOrder",
			orderBy: "activatedAt_asc",
		});
		const descending = await service.handle({
			q: "ActivationOrder",
			orderBy: "activatedAt_desc",
		});

		assert.deepEqual(
			ascending.map((admin) => admin.id),
			[firstAdmin.id, secondAdmin.id],
		);
		assert.deepEqual(
			descending.map((admin) => admin.id),
			[secondAdmin.id, firstAdmin.id],
		);
	});

	for (const column of ["createdAt", "updatedAt"] as const) {
		test(`it should order admins by ${column}`, async ({ assert }) => {
			const marker = `${column}Order`;
			const firstAdmin = await AdminFactory.merge({ name: `${marker} First` }).create();
			const secondAdmin = await AdminFactory.merge({ name: `${marker} Second` }).create();
			const databaseColumn = column === "createdAt" ? "createdAt" : "updatedAt";
			await Admin.query()
				.where("id", firstAdmin.id)
				.update({ [databaseColumn]: DateTime.fromISO("2025-01-01T00:00:00.000Z") });
			await Admin.query()
				.where("id", secondAdmin.id)
				.update({ [databaseColumn]: DateTime.fromISO("2025-02-01T00:00:00.000Z") });
			const service = new ListAdminsService();

			const ascending = await service.handle({ q: marker, orderBy: `${column}_asc` });
			const descending = await service.handle({ q: marker, orderBy: `${column}_desc` });

			assert.deepEqual(
				ascending.map((admin) => admin.id),
				[firstAdmin.id, secondAdmin.id],
			);
			assert.deepEqual(
				descending.map((admin) => admin.id),
				[secondAdmin.id, firstAdmin.id],
			);
		});
	}

	test("it should preserve the default order for an unknown order option", async ({ assert }) => {
		const olderAdmin = await AdminFactory.merge({ name: "UnknownOrder Older" }).create();
		const newerAdmin = await AdminFactory.merge({ name: "UnknownOrder Newer" }).create();
		await Admin.query()
			.where("id", olderAdmin.id)
			.update({ createdAt: DateTime.fromISO("2025-01-01T00:00:00.000Z") });
		await Admin.query()
			.where("id", newerAdmin.id)
			.update({ createdAt: DateTime.fromISO("2025-02-01T00:00:00.000Z") });

		const admins = await new ListAdminsService().handle({
			q: "UnknownOrder",
			orderBy: "unknown",
		});

		assert.deepEqual(
			admins.map((admin) => admin.id),
			[newerAdmin.id, olderAdmin.id],
		);
	});
});
