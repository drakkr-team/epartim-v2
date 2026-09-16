import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { SubscriptionDocumentSchema } from "#database/schema";
import File from "#models/file";
import Subscription from "#models/subscription";

export const SubscriptionDocumentType = {
	BANK_DETAILS: "bank_details",
	EXISTENCE_PROOF: "existence_proof",
	ORGANIZATION_CHART: "organization_chart",
	ARTICLES_OF_ASSOCIATION: "articles_of_association",
	LEGAL_AGENT_ID: "legal_agent_id",
	LEGAL_AGENT_KBIS: "legal_agent_kbis",
	SIGNER_ID: "signer_id",
	SIGNER_POWER: "signer_power",
} as const;

export type SubscriptionDocumentType =
	(typeof SubscriptionDocumentType)[keyof typeof SubscriptionDocumentType];

export const SubscriptionDocumentTypes = Object.values(SubscriptionDocumentType);

export function isSubscriptionDocumentType(value: string): value is SubscriptionDocumentType {
	return SubscriptionDocumentTypes.includes(value as SubscriptionDocumentType);
}

export default class SubscriptionDocument extends SubscriptionDocumentSchema {
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@belongsTo(() => File)
	declare file: BelongsTo<typeof File>;
}
