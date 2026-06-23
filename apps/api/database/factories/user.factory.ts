import factory from "@adonisjs/lucid/factories";

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
		};
	})
	.build();
