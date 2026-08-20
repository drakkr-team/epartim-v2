import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

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
	.state("active", (admin) => {
		admin.activatedAt = DateTime.now();
	})
	.state("unactive", (admin) => {
		admin.activatedAt = null;
	})
	.build();
