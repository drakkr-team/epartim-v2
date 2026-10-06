import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionFormalismMembersService from "#features/client/subscriptions/services/update/formalism/members.service";
import Subscription from "#models/subscription";
import {
	UpdateFormalismMemberSchema,
	validateFormalismGroup,
	validateFormalismPersonId,
} from "#validators/subscription/formalism.validator";

@inject()
export default class UpdateFormalismMemberController {
	constructor(protected subscriptionFormalismMembersService: SubscriptionFormalismMembersService) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const group = validateFormalismGroup(params.group);
		const payload = await request.validateUsing(UpdateFormalismMemberController.payloadSchema);
		return this.subscriptionFormalismMembersService.update(
			subscription,
			group,
			validateFormalismPersonId(params.memberId),
			payload,
		);
	}

	static payloadSchema = vine.create(UpdateFormalismMemberSchema);
}
