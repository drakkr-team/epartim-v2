import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { SubscriptionDocumentSchema } from "#database/schema";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";
import File from "#models/file";
import Subscription from "#models/subscription";

export const SubscriptionDocumentType = {
	BANK_DETAILS: 1,
	EXISTENCE_PROOF: 2,
	ORGANIZATION_CHART: 3,
	ARTICLES_OF_ASSOCIATION: 4,
	LEGAL_AGENT_ID: 5,
	LEGAL_AGENT_KBIS: 6,
	SIGNER_ID: 7,
	SIGNER_POWER: 8,
	BIC_IDENTIFICATION_CODE: 9,
	BENEFICIAL_OWNER_ID: 10,
	BENEFICIAL_OWNER_RNE: 11,
} as const;

export type SubscriptionDocumentType =
	(typeof SubscriptionDocumentType)[keyof typeof SubscriptionDocumentType];

export const SubscriptionDocumentTypes = Object.values(SubscriptionDocumentType);

export function isSubscriptionDocumentType(value: unknown): value is SubscriptionDocumentType {
	return (
		typeof value === "number" &&
		SubscriptionDocumentTypes.includes(value as SubscriptionDocumentType)
	);
}

export default class SubscriptionDocument extends SubscriptionDocumentSchema {
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@belongsTo(() => CompanyBeneficialOwner)
	declare companyBeneficialOwner: BelongsTo<typeof CompanyBeneficialOwner>;

	@belongsTo(() => File)
	declare file: BelongsTo<typeof File>;
}
