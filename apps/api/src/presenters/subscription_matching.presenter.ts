import {
	emptySubscriptionMatchingRules,
	SubscriptionMatchingRecordType,
	type SubscriptionMatchingRules,
	type SubscriptionSeniorityRule,
	type SubscriptionUniformRule,
	type SubscriptionUnilateralRule,
} from "#constants/subscription_matching_rules";
import type SubscriptionMatchingRule from "#models/subscription_matching_rule";

export function presentSubscriptionMatchingRules(
	rules: SubscriptionMatchingRule[],
): SubscriptionMatchingRules {
	const result = emptySubscriptionMatchingRules();
	for (const rule of rules) {
		const matching = result[rule.device];
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
