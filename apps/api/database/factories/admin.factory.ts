import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

import { RoleFactory } from "#database/factories/role.factory";
import Admin from "#models/admin";

export const AdminFactory = factory
	.define(Admin, ({ faker }) => {
		const name = faker.person.fullName();
		const [firstName, lastName] = name.split(" ");

		return {
			name,
			email: faker.internet.exampleEmail({ firstName, lastName }),
			password: faker.internet.password(),
			activatedAt: faker.helpers.maybe(() => DateTime.fromJSDate(faker.date.past())),
		};
	})
	.before("create", async (_, admin, ctx) => {
		const role = await RoleFactory.useCtx(ctx).create();
		admin.roleId = role.id;
	})
	.state("active", (admin) => {
		admin.activatedAt = DateTime.now();
	})
	.state("unactive", (admin) => {
		admin.activatedAt = null;
	})
	.relation("role", () => RoleFactory)
	.build();
