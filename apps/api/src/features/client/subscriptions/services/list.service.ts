import Subscription from "#models/subscription";

export default class ListSubscriptionsService {
	handle() {
		return Subscription.query()
			.preload("company")
			.orderBy("created_at", "desc")
			.orderBy("id", "desc");
	}
}
