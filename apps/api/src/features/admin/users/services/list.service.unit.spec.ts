import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import ListUsersService from "#features/admin/users/services/list.service";
import User from "#models/user";

test.group("Features / Admin / Users / Services / List Service", () => {
	test("it should order users by creation date descending by default", async ({ assert }) => {
		const olderUser = await UserFactory.merge({ firstName: "DefaultOrder Older" }).create();
		const newerUser = await UserFactory.merge({ firstName: "DefaultOrder Newer" }).create();
		await User.query()
			.where("id", olderUser.id)
			.update({ createdAt: DateTime.fromISO("2025-01-01T00:00:00.000Z") });
		await User.query()
			.where("id", newerUser.id)
			.update({ createdAt: DateTime.fromISO("2025-02-01T00:00:00.000Z") });

		const users = await new ListUsersService().handle({ q: "DefaultOrder" });

		assert.deepEqual(
			users.map((user) => user.id),
			[newerUser.id, olderUser.id],
		);
	});

	test("it should search case-insensitively by first name, last name and email", async ({
		assert,
	}) => {
		const firstNameMatch = await UserFactory.merge({
			firstName: "Alice",
			lastName: "Martin",
			email: "alice@example.com",
		}).create();
		const lastNameMatch = await UserFactory.merge({
			firstName: "Bob",
			lastName: "Acme",
			email: "bob@example.com",
		}).create();
		await UserFactory.merge({
			firstName: "Charlie",
			lastName: "Durand",
			email: "charlie@example.com",
		}).create();

		const users = await new ListUsersService().handle({ q: "ALICE acme" });

		assert.sameMembers(
			users.map((user) => user.id),
			[firstNameMatch.id, lastNameMatch.id],
		);
	});

	test("it should order users by the requested field and direction", async ({ assert }) => {
		const firstUser = await UserFactory.merge({
			firstName: "SortOrder Alpha",
			lastName: "Same",
		}).create();
		const secondUser = await UserFactory.merge({
			firstName: "SortOrder Zulu",
			lastName: "Same",
		}).create();
		const service = new ListUsersService();

		const ascending = await service.handle({ q: "SortOrder", orderBy: "firstName_asc" });
		const descending = await service.handle({ q: "SortOrder", orderBy: "firstName_desc" });

		assert.deepEqual(
			ascending.map((user) => user.id),
			[firstUser.id, secondUser.id],
		);
		assert.deepEqual(
			descending.map((user) => user.id),
			[secondUser.id, firstUser.id],
		);
	});
});
