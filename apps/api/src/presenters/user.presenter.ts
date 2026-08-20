import type User from "#models/user";

export default class UserPresenter {
	toJSON(user: User) {
		return {
			id: user.id,

			name: `${user.firstName} ${user.lastName}`,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,

			createdAt: user.createdAt.toJSDate(),
			updatedAt: user.updatedAt.toJSDate(),
		};
	}
}
