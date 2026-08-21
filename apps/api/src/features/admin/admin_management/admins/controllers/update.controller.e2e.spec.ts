import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admin Management / Admins / Controllers / Update Controller", () => {
	test("it should update and normalize an administrator name", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.update", { id: targetAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				name: "  Élodie 管理者  ",
			});

		response.assertOk();
		response.assertBodyContains({
			id: targetAdmin.id,
			name: "Élodie 管理者",
		});
		assert.notProperty(response.body(), "password");
		await targetAdmin.refresh();
		assert.equal(targetAdmin.name, "Élodie 管理者");
	});

	test("it should allow an administrator to update their own name", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.update", { id: authenticatedAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				name: "Updated Self",
			});

		response.assertOk();
		response.assertBodyContains({
			id: authenticatedAdmin.id,
			name: "Updated Self",
		});
	});

	test("it should ignore every field except name", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const activatedAt = DateTime.fromISO("2024-01-01T00:00:00Z");
		const targetAdmin = await AdminFactory.merge({ activatedAt }).create();
		const originalEmail = targetAdmin.email;
		const originalPassword = targetAdmin.password;
		const payload = {
			name: "Allowed Name",
			email: "changed@example.com",
			password: "changed-password",
			activatedAt: null,
			role: "super-admin",
		};

		const response = await client
			.patch(`/admin/admin-management/admins/${targetAdmin.id}`)
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload as Pick<typeof payload, "name">);

		response.assertOk();
		await targetAdmin.refresh();
		assert.equal(targetAdmin.name, "Allowed Name");
		assert.equal(targetAdmin.email, originalEmail);
		assert.equal(targetAdmin.password, originalPassword);
		assert.equal(targetAdmin.activatedAt?.toISO(), activatedAt.toISO());
	});

	test("it should reject empty, ignored-only, and invalid payloads", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetAdmin = await AdminFactory.create();

		for (const payload of [{}, { email: "ignored@example.com" }, { name: " " }]) {
			const response = await client
				.patch(`/admin/admin-management/admins/${targetAdmin.id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.patch(`/admin/admin-management/admins/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.json({ name: "Updated Name" });

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetAdmin = await AdminFactory.create();
		const response = await client
			.visit("admin.admin_management.admins.update", { id: targetAdmin.id })
			.json({ name: "Updated Name" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
