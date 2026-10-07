import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

import { USER_ROLES } from "#constants/user";
import { FirmFactory } from "#database/factories/firm.factory";
import User from "#models/user";

export const UserFactory = factory
	.define(User, ({ faker }) => {
		const name = faker.person.fullName();
		const [firstName, lastName] = name.split(" ");
		const email = faker.internet.exampleEmail({
			firstName,
			lastName,
		});

		return {
			role: USER_ROLES.USER,
			email,
			password: faker.internet.password(),
			firstName,
			lastName,
			activatedAt: faker.helpers.maybe(() => DateTime.fromJSDate(faker.date.past())),
		};
	})
	.state("active", (user) => {
		user.activatedAt = DateTime.now();
	})
	.state("unactive", (user) => {
		user.activatedAt = null;
	})
	.before("create", async (_builder, user, ctx) => {
		if (user.firmId !== undefined) return;
		const firm = await FirmFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.useCtx(ctx)
			.create();
		user.firmId = firm.id;
	})
	.build();
