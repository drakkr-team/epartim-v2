export const SubscriptionMatchingDevice = {
	PEI: "pei",
	PER: "per",
} as const;

export type SubscriptionMatchingDevice =
	(typeof SubscriptionMatchingDevice)[keyof typeof SubscriptionMatchingDevice];

export const SubscriptionMatchingRuleType = {
	UNIFORM: "uniform",
	SENIORITY: "seniority",
	UNILATERAL: "unilateral",
} as const;

export type SubscriptionMatchingRuleType =
	(typeof SubscriptionMatchingRuleType)[keyof typeof SubscriptionMatchingRuleType];

export const SubscriptionMatchingRecordType = {
	...SubscriptionMatchingRuleType,
	SPECIFIC: "specific",
} as const;

export type SubscriptionMatchingRecordType =
	(typeof SubscriptionMatchingRecordType)[keyof typeof SubscriptionMatchingRecordType];

export const SubscriptionMatchingPaymentType = {
	VOLUNTARY: "voluntary",
	INCENTIVES: "incentives",
	PARTICIPATION: "participation",
	PPV: "ppv",
	PAID_LEAVE: "paid_leave",
} as const;

export type SubscriptionMatchingPaymentType =
	(typeof SubscriptionMatchingPaymentType)[keyof typeof SubscriptionMatchingPaymentType];

export const SubscriptionMatchingLimitKind = {
	LEGAL: "legal",
	AMOUNT: "amount",
} as const;

export type SubscriptionMatchingLimitKind =
	(typeof SubscriptionMatchingLimitKind)[keyof typeof SubscriptionMatchingLimitKind];

export type SubscriptionMatchingPeriod = {
	fromYears: number | null;
	toYears: number | null;
	rate: number | null;
	limitKind: SubscriptionMatchingLimitKind | null;
	limitAmount: number | null;
};

export type SubscriptionUniformRule = Omit<SubscriptionMatchingPeriod, "fromYears" | "toYears"> & {
	paymentType: SubscriptionMatchingPaymentType;
};

export type SubscriptionSeniorityRule = {
	paymentType: SubscriptionMatchingPaymentType;
	periods: SubscriptionMatchingPeriod[];
};

export type SubscriptionUnilateralRule = {
	limitKind: SubscriptionMatchingLimitKind | null;
	limitAmount: number | null;
};

export type SubscriptionDeviceMatching = {
	ruleTypes: SubscriptionMatchingRuleType[];
	uniformRules: SubscriptionUniformRule[];
	seniorityRules: SubscriptionSeniorityRule[];
	unilateralRule: SubscriptionUnilateralRule | null;
	specificRule: boolean;
	specificRuleDetails: string | null;
};

export type SubscriptionMatchingRules = Record<
	SubscriptionMatchingDevice,
	SubscriptionDeviceMatching
>;

export function emptySubscriptionDeviceMatching(): SubscriptionDeviceMatching {
	return {
		ruleTypes: [],
		uniformRules: [],
		seniorityRules: [],
		unilateralRule: null,
		specificRule: false,
		specificRuleDetails: null,
	};
}

export function emptySubscriptionMatchingRules(): SubscriptionMatchingRules {
	return {
		pei: emptySubscriptionDeviceMatching(),
		per: emptySubscriptionDeviceMatching(),
	};
}
