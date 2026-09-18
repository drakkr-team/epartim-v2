import Role from "#models/role";

export default class RolePresenter {
	toJSON(role: Role) {
		return {
			id: role.id,

			authorizations: role.authorizations,
			isSuperAdmin: role.isSuperAdmin,

			createdAt: role.createdAt.toJSDate(),
			updatedAt: role.updatedAt.toJSDate(),
		};
	}
}
