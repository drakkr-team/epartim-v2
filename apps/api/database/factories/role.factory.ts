import factory from "@adonisjs/lucid/factories";

import { AUTHORIZATIONS_OPTIONS } from "#constants/role";
import Role from "#models/role";

export const RoleFactory = factory
	.define(Role, ({ faker }) => {
		return {
			name: `Role ${faker.person.jobTitle()} ${faker.string.uuid()}`,
			authorizations: faker.helpers.arrayElements(AUTHORIZATIONS_OPTIONS),
		};
	})
	.build();
