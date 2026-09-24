import { test } from "@japa/runner";

import { USER_ROLES } from "#constants/user";
import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { UserFactory } from "#database/factories/user.factory";
import Role from "#models/role";

test.group("Features / Admin / Users / Controllers / Update Controller", () => {
	test("it should partially update and normalize a user", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["update:user"];
		await role.save();
		const targetUser = await UserFactory.create();
		const originalLastName = targetUser.lastName;

		const response = await client
			.visit("admin.users.update", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				firstName: "  Élodie  ",
			});

		response.assertOk();
		response.assertBodyContains({
			id: targetUser.id,
			firstName: "Élodie",
			lastName: originalLastName,
		});
		assert.notProperty(response.body(), "password");
		await targetUser.refresh();
		assert.equal(targetUser.firstName, "Élodie");
		assert.equal(targetUser.lastName, originalLastName);
	});

	test("it should update role and firm but ignore excluded fields", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["update:user"];
		await role.save();
		const targetUser = await UserFactory.create();
		const firm = await FirmFactory.with("address").with("paymentDetail").create();
		const originalEmail = targetUser.email;
		const originalPassword = targetUser.password;
		const payload = {
			firstName: "Allowed",
			lastName: "Name",
			role: USER_ROLES.FIRM,
			firmId: firm.id,
			email: "changed@example.com",
			password: "changed-password",
		};

		const response = await client
			.visit("admin.users.update", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload);

		response.assertOk();
		response.assertBodyContains({
			role: USER_ROLES.FIRM,
			firmId: firm.id,
		});
		await targetUser.refresh();
		assert.equal(targetUser.firstName, "Allowed");
		assert.equal(targetUser.lastName, "Name");
		assert.equal(targetUser.role, USER_ROLES.FIRM);
		assert.equal(targetUser.firmId, firm.id);
		assert.equal(targetUser.email, originalEmail);
		assert.equal(targetUser.password, originalPassword);
	});

	test("it should reject invalid payload values", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["update:user"];
		await role.save();
		const targetUser = await UserFactory.create();
		const statuses: number[] = [];

		for (const payload of [{ firstName: "A" }, { role: 999 }, { firmId: 2_147_483_647 }]) {
			const response = await client
				.visit("admin.users.update", { userId: targetUser.id })
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.unsafeJson(payload);

			statuses.push(response.status());
		}

		assert.deepEqual(statuses, [422, 422, 422]);
	});

	test("it should return not found for missing identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["update:user"];
		await role.save();

		for (const id of ["999999", "0", "-1"]) {
			const response = await client
				.visit("admin.users.update", { userId: id })
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.json({ firstName: "Updated", lastName: "User" });

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetUser = await UserFactory.create();
		const response = await client
			.visit("admin.users.update", { userId: targetUser.id })
			.json({ firstName: "Updated", lastName: "User" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
