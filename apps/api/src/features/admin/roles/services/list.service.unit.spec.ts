import { test } from "@japa/runner";

import { RoleFactory } from "#database/factories/role.factory";
import ListRolesService from "#features/admin/roles/services/list.service";

test.group("Features / Admin / Roles / Services / List Service", () => {
	test("it should search by name and apply the requested alphabetical order", async ({
		assert,
	}) => {
		const alpha = await RoleFactory.merge({ name: "Role Service Search Alpha" }).create();
		const zulu = await RoleFactory.merge({ name: "Role Service Search Zulu" }).create();
		await RoleFactory.merge({ name: "Accounting" }).create();

		const roles = await new ListRolesService().handle({
			currentUserRole: alpha,
			q: "role service search",
			orderBy: "name_asc",
		});

		assert.deepEqual(
			roles.map((role) => role.id),
			[alpha.id, zulu.id],
		);
	});

	test("it should hide super-admin roles from custom roles but include them for super-admins", async ({
		assert,
	}) => {
		const customRole = await RoleFactory.merge({ name: "Role Visibility Custom" }).create();
		const superAdminRole = await RoleFactory.merge({
			name: "Role Visibility Super Admin",
			isSuperAdmin: true,
		}).create();
		const service = new ListRolesService();

		const customRoles = await service.handle({
			currentUserRole: customRole,
			q: "Role Visibility",
			orderBy: "name_asc",
		});
		assert.deepEqual(
			customRoles.map((role) => role.id),
			[customRole.id],
		);

		const superAdminRoles = await service.handle({
			currentUserRole: superAdminRole,
			q: "Role Visibility",
			orderBy: "name_asc",
		});
		assert.deepEqual(
			superAdminRoles.map((role) => role.id),
			[customRole.id, superAdminRole.id],
		);
	});
});
