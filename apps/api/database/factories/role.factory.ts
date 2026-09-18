import factory from "@adonisjs/lucid/factories";

import Role, { AUTHORIZATIONS_OPTIONS } from "#models/role";

export const RoleFactory = factory
	.define(Role, ({ faker }) => {
		return {
			name: `Role ${faker.string.uuid()}`,
			authorizations: faker.helpers.arrayElements(AUTHORIZATIONS_OPTIONS),
		};
	})
	.build();
