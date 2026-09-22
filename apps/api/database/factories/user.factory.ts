import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

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
	.build();
