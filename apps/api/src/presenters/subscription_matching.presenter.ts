import {
	SubscriptionMatchingDevice,
	SubscriptionMatchingRecordType,
	type SubscriptionMatchingRuleType,
} from "#constants/subscription_matching";
import type SubscriptionMatchingRule from "#models/subscription_matching_rule";
import type {
	SubscriptionSeniorityRule,
	SubscriptionUniformRule,
	SubscriptionUnilateralRule,
} from "#models/subscription_matching_rule";

type SubscriptionDeviceMatching = {
	ruleTypes: SubscriptionMatchingRuleType[];
	uniformRules: SubscriptionUniformRule[];
	seniorityRules: SubscriptionSeniorityRule[];
	unilateralRule: SubscriptionUnilateralRule | null;
	specificRule: boolean;
	specificRuleDetails: string | null;
};

type SubscriptionMatchingRules = {
	pei: SubscriptionDeviceMatching;
	per: SubscriptionDeviceMatching;
};

function emptyDeviceMatching(): SubscriptionDeviceMatching {
	return {
		ruleTypes: [],
		uniformRules: [],
		seniorityRules: [],
		unilateralRule: null,
		specificRule: false,
		specificRuleDetails: null,
	};
}

export function presentSubscriptionMatchingRules(
	rules: SubscriptionMatchingRule[],
): SubscriptionMatchingRules {
	const result: SubscriptionMatchingRules = {
		pei: emptyDeviceMatching(),
		per: emptyDeviceMatching(),
	};
	for (const rule of rules) {
		const matching =
			rule.device === SubscriptionMatchingDevice.PEI
				? result.pei
				: rule.device === SubscriptionMatchingDevice.PER
					? result.per
					: null;
		if (!matching) continue;
		switch (rule.type) {
			case SubscriptionMatchingRecordType.UNIFORM:
				matching.ruleTypes.push(rule.type);
				matching.uniformRules =
					(rule.details as { payments: SubscriptionUniformRule[] }).payments ?? [];
				break;
			case SubscriptionMatchingRecordType.SENIORITY:
				matching.ruleTypes.push(rule.type);
				matching.seniorityRules =
					(rule.details as { payments: SubscriptionSeniorityRule[] }).payments ?? [];
				break;
			case SubscriptionMatchingRecordType.UNILATERAL:
				matching.ruleTypes.push(rule.type);
				matching.unilateralRule = rule.details as SubscriptionUnilateralRule;
				break;
			case SubscriptionMatchingRecordType.SPECIFIC:
				matching.specificRule = true;
				matching.specificRuleDetails =
					(rule.details as { description: string | null }).description ?? null;
				break;
		}
	}
	for (const matching of Object.values(result)) {
		matching.ruleTypes = [
			SubscriptionMatchingRecordType.UNIFORM,
			SubscriptionMatchingRecordType.SENIORITY,
			SubscriptionMatchingRecordType.UNILATERAL,
		].filter((type) => matching.ruleTypes.includes(type));
	}
	return result;
}
