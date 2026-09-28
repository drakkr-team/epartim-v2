import vine from "@vinejs/vine";

import { SubscriptionAgreement } from "#constants/subscription_agreement";

export const UpdateSubscriptionAgreementsSchema = vine
	.object({
		existingAgreements: vine.array(vine.enum(SubscriptionAgreement)).distinct().optional(),
		otherAgreementDetails: vine.string().trim().nullable().optional(),
	})
	.partial();
