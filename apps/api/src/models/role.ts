import { column } from "@adonisjs/lucid/orm";

import { RoleSchema } from "#database/schema";

const AUTHORIZATIONS_RESOURCES = ["user", "firm", "network"] as const;
const AUTHORIZATIONS_ACTIONS = ["create", "update", "delete"] as const;

type AuthorizationResources = (typeof AUTHORIZATIONS_RESOURCES)[number];
type AuthorizationActions = (typeof AUTHORIZATIONS_ACTIONS)[number];

type AuthorizationOption = `${AuthorizationResources}:${AuthorizationActions}`;
export const AUTHORIZATIONS_OPTIONS: AuthorizationOption[] = AUTHORIZATIONS_RESOURCES.flatMap(
	(resource) =>
		AUTHORIZATIONS_ACTIONS.map((action) => `${resource}:${action}` as AuthorizationOption),
);

export default class Role extends RoleSchema {
	@column()
	declare authorizations: AuthorizationOption[];
}
