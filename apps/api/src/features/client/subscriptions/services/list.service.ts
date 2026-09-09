import Subscription from "#models/subscription";

export default class ListSubscriptionsService {
	handle() {
		return Subscription.query().orderBy("created_at", "desc").orderBy("id", "desc");
	}
}
