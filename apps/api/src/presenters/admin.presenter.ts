import Admin from "#models/admin";

export default class AdminPresenter {
	toJSON(admin: Admin) {
		return {
			id: admin.id,

			name: admin.name,
			email: admin.email,

			activatedAt: admin.activatedAt?.toJSDate() ?? null,
			createdAt: admin.createdAt.toJSDate(),
			updatedAt: admin.updatedAt.toJSDate(),
		};
	}
}
