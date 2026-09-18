import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import ResendAdminOnboardingPolicy from "#features/admin/admins/policies/resend_onboarding.policy";
import Role from "#models/role";

test.group("Features / Admin / Admins / Policies / Resend Onboarding Policy", () => {
	test("it should allow an authorized admin to resend onboarding", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:admin"];
		await role.save();
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const canResend = await new ResendAdminOnboardingPolicy().handle(currentAdmin, targetAdmin);

		assert.isTrue(canResend);
	});

	test("it should deny an admin without create authorization", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = [];
		await role.save();
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const canResend = await new ResendAdminOnboardingPolicy().handle(currentAdmin, targetAdmin);

		assert.isFalse(canResend);
	});

	test("it should deny onboarding for an active admin", async ({ assert }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:admin"];
		await role.save();
		const targetAdmin = await AdminFactory.apply("active").with("role").create();

		const canResend = await new ResendAdminOnboardingPolicy().handle(currentAdmin, targetAdmin);

		assert.isFalse(canResend);
	});

	test("it should deny a user", async ({ assert }) => {
		const user = await UserFactory.create();
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const canResend = await new ResendAdminOnboardingPolicy().handle(user, targetAdmin);

		assert.isFalse(canResend);
	});
});
