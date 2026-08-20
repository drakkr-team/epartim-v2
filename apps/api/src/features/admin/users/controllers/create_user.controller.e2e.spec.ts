import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendAccountInvitation from "#features/admin/users/jobs/send_account_invitation.job";
import Role from "#models/role";
import User from "#models/user";
import UserInvitation from "#models/user_invitation";

async function createAdministrator() {
	const user = await UserFactory.create();
	const role = await Role.firstOrCreate(
		{ code: "administrator" },
		{ code: "administrator", name: "Administrateur" },
	);
	await user.related("roles").sync([role.id]);
	return user;
}

test.group("Features / User Management / Administration / Controllers / Create User", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it creates an invited user and queues an activation email", async ({ client, assert }) => {
		const fakeQueueManager = QueueManager.fake();
		const administrator = await createAdministrator();

		const response = await client.visit("admin.create_user").loginAs(administrator).json({
			email: "new-user@example.com",
			firstName: "Jane",
			lastName: "Doe",
			roleCode: "commercial",
			firmId: null,
			networkId: null,
		});

		response.assertOk();
		const user = await User.findByOrFail("email", "new-user@example.com");
		assert.equal(user.status, "invited");
		assert.isNotNull(await UserInvitation.findBy("userId", user.id));
		fakeQueueManager.assertPushed(SendAccountInvitation);
	});

	test("it refuses user creation for a non administrator", async ({ client }) => {
		const user = await UserFactory.create();

		const response = await client.visit("admin.create_user").loginAs(user).json({
			email: "new-user@example.com",
			firstName: "Jane",
			lastName: "Doe",
			roleCode: "commercial",
		});

		response.assertUnauthorized();
	});
});
