import factory from "@adonisjs/lucid/factories";

import Role, { AUTHORIZATIONS_OPTIONS } from "#models/role";

export const RoleFactory = factory
	.define(Role, ({ faker }) => {
		return {
			name: faker.person.jobTitle(),
			authorizations: faker.helpers.arrayElements(AUTHORIZATIONS_OPTIONS),
		};
	})
	.build();
