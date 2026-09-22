import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import ResendUserOnboardingPolicy from "#features/admin/users/policies/resend_onboarding.policy";
import Role from "#models/role";

test.group("Features / Admin / Users / Policies / Resend Onboarding Policy", () => {
	test("it should allow an authorized admin to resend onboarding", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const targetUser = await UserFactory.apply("unactive").create();

		const canResend = await new ResendUserOnboardingPolicy().handle(currentAdmin, targetUser);

		assert.isTrue(canResend);
	});

	test("it should deny an admin without create authorization", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = [];
		await role.save();
		const targetUser = await UserFactory.apply("unactive").create();

		const canResend = await new ResendUserOnboardingPolicy().handle(currentAdmin, targetUser);

		assert.isFalse(canResend);
	});

	test("it should deny onboarding for an active user", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const targetUser = await UserFactory.apply("active").create();

		const canResend = await new ResendUserOnboardingPolicy().handle(currentAdmin, targetUser);

		assert.isFalse(canResend);
	});

	test("it should deny a user", async ({ assert }) => {
		const user = await UserFactory.create();
		const targetUser = await UserFactory.apply("unactive").create();

		const canResend = await new ResendUserOnboardingPolicy().handle(user, targetUser);

		assert.isFalse(canResend);
	});
});
