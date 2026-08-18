import type AdminUser from "#models/admin_user";

export default class AdminUserPresenter {
	toJSON(user: AdminUser) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt.toJSDate(),
			updatedAt: user.updatedAt.toJSDate(),
		};
	}
}
