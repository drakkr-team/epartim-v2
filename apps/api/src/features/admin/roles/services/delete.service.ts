import Role from "#models/role";

export default class DeleteRoleService {
	async handle(roleId: bigint | number | string) {
		const role = await Role.findOrFail(roleId);

		await role.delete();
	}

	async canDelete(roleId: bigint | number | string) {
		const role = await Role.findOrFail(roleId);
		const admin = await role.related("admins").query().first();

		return admin === null;
	}
}
