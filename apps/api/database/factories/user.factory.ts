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
			name,
			email,
			password: faker.internet.password(),
			firstName,
			lastName,
			status: "active" as const,
		};
	})
	.state("invited", (user) => {
		user.status = "invited";
		user.password = null as unknown as string;
	})
	.state("disabled", (user) => {
		user.status = "disabled";
		user.disabledAt = DateTime.now();
	})
	.build();
