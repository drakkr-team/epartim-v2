import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismMembersService from "#features/client/subscriptions/services/update/formalism/members.service";
import Subscription from "#models/subscription";
import {
	validateFormalismGroup,
	validateFormalismPersonId,
} from "#validators/subscription/formalism.validator";

@inject()
export default class DeleteFormalismMemberController {
	constructor(protected service: SubscriptionFormalismMembersService) {}
	async handle({ bouncer, params, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const group = await validateFormalismGroup(params.group);
		await this.service.delete(
			subscription,
			group,
			await validateFormalismPersonId(params.memberId),
		);
		return response.noContent();
	}
}
