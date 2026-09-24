import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import Role from "#models/role";

test.group("Features / Admin / Companies / Controllers / View Controller", () => {
	test("it should return a company and permitted actions", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:company"];
		await role.save();
		const company = await CompanyFactory.with("subscription").create();

		const response = await client
			.visit("admin.companies.view", { companyId: company.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		response.assertBodyContains({
			id: company.id,
			subscriptionId: company.subscriptionId,
			meta: { canUpdate: true },
		});
	});

	test("it should return not found for an unknown company", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const response = await client
			.visit("admin.companies.view", { companyId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});
});
