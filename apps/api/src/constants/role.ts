export const AUTHORIZATIONS_RESOURCES = [
	"admin",
	"role",
	"user",
	"firm",
	"network",
	"company",
] as const;
export type AuthorizationResources = (typeof AUTHORIZATIONS_RESOURCES)[number];

export const AUTHORIZATIONS_ACTIONS = ["create", "update", "delete"] as const;
export type AuthorizationActions = (typeof AUTHORIZATIONS_ACTIONS)[number];

export type AuthorizationOption = `${AuthorizationActions}:${AuthorizationResources}`;

export const AUTHORIZATIONS_OPTIONS: AuthorizationOption[] = AUTHORIZATIONS_ACTIONS.flatMap(
	(action) =>
		AUTHORIZATIONS_RESOURCES.map((resource) => `${action}:${resource}` as AuthorizationOption),
);
