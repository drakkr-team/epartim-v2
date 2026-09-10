import { test } from "@japa/runner";

import { RoleFactory } from "#database/factories/role.factory";
import ListRolesService from "#features/admin/roles/services/list.service";

test.group("Features / Admin / Roles / Services / List Service", () => {
	test("it should search by name and apply the requested alphabetical order", async ({
		assert,
	}) => {
		const alpha = await RoleFactory.merge({ name: "Alpha Support" }).create();
		const zulu = await RoleFactory.merge({ name: "Zulu Support" }).create();
		await RoleFactory.merge({ name: "Accounting" }).create();

		const roles = await new ListRolesService().handle({ q: "support", orderBy: "name_asc" });

		assert.deepEqual(
			roles.map((role) => role.id),
			[alpha.id, zulu.id],
		);
	});
});
