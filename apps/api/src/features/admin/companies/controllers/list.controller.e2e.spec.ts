import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import Role from "#models/role";

test.group("Features / Admin / Companies / Controllers / List Controller", () => {
	test("it should search, filter, paginate and return action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:company"];
		await role.save();
		const first = await CompanyFactory.merge({ name: "Alpha Company" })
			.with("subscription")
			.create();
		await CompanyFactory.merge({ name: "Beta Company" }).with("subscription").create();

		const response = await client
			.visit("admin.companies.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "Alpha", orderBy: "name_asc" });

		response.assertOk();
		response.assertBodyContains({
			meta: { currentPage: 1, total: 1 },
			data: [{ id: first.id }],
		});
		assert.deepEqual(response.body().data[0].meta, { canUpdate: true });
		assert.notProperty(response.body().meta, "canCreate");
	});

	test("it should reject invalid pagination and unauthenticated access", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const invalid = await client
			.visit("admin.companies.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ page: 0 });
		invalid.assertStatus(422);

		const unauthorized = await client.visit("admin.companies.list");
		unauthorized.assertUnauthorized();
	});
});
