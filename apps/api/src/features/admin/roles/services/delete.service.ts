import Role from "#models/role";

export default class DeleteRoleService {
	async handle(role: Role) {
		await role.delete();
	}

	async canDelete(role: Role) {
		if (role.isSuperAdmin) return false;

		const admin = await role.related("admins").query().first();

		return admin === null;
	}
}
