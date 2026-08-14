import type User from "#models/user";

export default class UserPresenter {
	async toJSON(user: User) {
		await user.load("roles");
		await user.load("firm", (query) => query.preload("network"));
		await user.load("network");
		const network = user.network || user.firm?.network;

		return {
			id: user.id,

			name: user.name,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			mobilePhone: user.mobilePhone,
			status: user.status,
			roles: user.roles.map((role) => role.code),
			firm: user.firm
				? {
						id: user.firm.id,
						name: user.firm.name,
					}
				: null,
			network: network
				? {
						id: network.id,
						name: network.name,
					}
				: null,

			createdAt: user.createdAt.toJSDate(),
			updatedAt: user.updatedAt.toJSDate(),
		};
	}
}
