import {
	type SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
	SubscriptionMatchingPaymentType,
	SubscriptionMatchingRuleType,
} from "#constants/subscription_matching_rules";

export type MatchingValidationIssue = { field: string; message: string; rule: string };

function issue(field: string, message: string, rule: string): MatchingValidationIssue {
	return { field, message, rule };
}

export function matchingValidationIssues(
	device: SubscriptionMatchingDevice,
	matching: SubscriptionDeviceMatching,
	hasBonusAgreement: boolean,
	complete: boolean,
): MatchingValidationIssue[] {
	const base = `contractCharacteristics.matchingRules.${device}`;
	const errors: MatchingValidationIssue[] = [];
	const active = new Set(matching.ruleTypes);
	const allowedPayments = new Set<string>([
		SubscriptionMatchingPaymentType.VOLUNTARY,
		SubscriptionMatchingPaymentType.INCENTIVES,
		SubscriptionMatchingPaymentType.PARTICIPATION,
		SubscriptionMatchingPaymentType.PPV,
		...(device === SubscriptionMatchingDevice.PER
			? [SubscriptionMatchingPaymentType.PAID_LEAVE]
			: []),
	]);
	if (
		device === SubscriptionMatchingDevice.PEI &&
		active.has(SubscriptionMatchingRuleType.UNILATERAL)
	) {
		errors.push(
			issue(`${base}.ruleTypes`, "L’abondement unilatéral est réservé au PER.", "device"),
		);
	}

	const selectedPayments = new Set<string>();
	for (const [index, rule] of matching.uniformRules.entries()) {
		const path = `${base}.uniformRules.${index}`;
		if (!allowedPayments.has(rule.paymentType) || selectedPayments.has(rule.paymentType)) {
			errors.push(
				issue(
					`${path}.paymentType`,
					"Ce versement est déjà utilisé ou indisponible.",
					"paymentType",
				),
			);
		}
		selectedPayments.add(rule.paymentType);
		if (complete && active.has(SubscriptionMatchingRuleType.UNIFORM)) {
			if (rule.rate === null) errors.push(issue(`${path}.rate`, "Renseignez le taux.", "required"));
			if (rule.limitKind === null)
				errors.push(issue(`${path}.limitKind`, "Choisissez la nature de la limite.", "required"));
			if (rule.limitAmount === null)
				errors.push(issue(`${path}.limitAmount`, "Renseignez le montant du plafond.", "required"));
		}
	}
	for (const [index, rule] of matching.seniorityRules.entries()) {
		const path = `${base}.seniorityRules.${index}`;
		if (!allowedPayments.has(rule.paymentType) || selectedPayments.has(rule.paymentType)) {
			errors.push(
				issue(
					`${path}.paymentType`,
					"Ce versement est déjà utilisé ou indisponible.",
					"paymentType",
				),
			);
		}
		selectedPayments.add(rule.paymentType);
		for (const [periodIndex, period] of rule.periods.entries()) {
			const periodPath = `${path}.periods.${periodIndex}`;
			if (period.fromYears !== null && !Number.isInteger(period.fromYears)) {
				errors.push(
					issue(`${periodPath}.fromYears`, "Saisissez un nombre entier d’années.", "integer"),
				);
			}
			if (period.toYears !== null && !Number.isInteger(period.toYears)) {
				errors.push(
					issue(`${periodPath}.toYears`, "Saisissez un nombre entier d’années.", "integer"),
				);
			}
			if (periodIndex === 4 && period.toYears !== null) {
				errors.push(
					issue(`${periodPath}.toYears`, "La cinquième période est ouverte.", "openEnded"),
				);
			}
			if (
				period.fromYears !== null &&
				period.toYears !== null &&
				period.fromYears >= period.toYears
			) {
				errors.push(issue(`${periodPath}.toYears`, "La fin doit suivre le début.", "range"));
			}
			const previousEnd = rule.periods[periodIndex - 1]?.toYears;
			if (
				periodIndex > 0 &&
				previousEnd !== null &&
				period.fromYears !== null &&
				period.fromYears !== previousEnd
			) {
				errors.push(
					issue(
						`${periodPath}.fromYears`,
						"Reprenez la fin de la période précédente.",
						"contiguous",
					),
				);
			}
			if (complete) {
				if (period.fromYears === null)
					errors.push(issue(`${periodPath}.fromYears`, "Renseignez le début.", "required"));
				if (periodIndex < 4 && period.toYears === null)
					errors.push(issue(`${periodPath}.toYears`, "Renseignez la fin.", "required"));
				if (period.rate === null)
					errors.push(issue(`${periodPath}.rate`, "Renseignez le taux.", "required"));
				if (period.limitKind === null)
					errors.push(
						issue(`${periodPath}.limitKind`, "Choisissez la nature de la limite.", "required"),
					);
				if (period.limitAmount === null)
					errors.push(
						issue(`${periodPath}.limitAmount`, "Renseignez le montant du plafond.", "required"),
					);
			}
		}
	}
	if (
		complete &&
		active.has(SubscriptionMatchingRuleType.UNIFORM) &&
		matching.uniformRules.length === 0
	) {
		errors.push(issue(`${base}.uniformRules`, "Choisissez au moins un versement.", "required"));
	}
	if (
		complete &&
		active.has(SubscriptionMatchingRuleType.SENIORITY) &&
		matching.seniorityRules.length === 0
	) {
		errors.push(issue(`${base}.seniorityRules`, "Choisissez au moins un versement.", "required"));
	}
	if (active.has(SubscriptionMatchingRuleType.UNILATERAL)) {
		const maximum = hasBonusAgreement ? 6000 : 3000;
		if (
			matching.unilateralRule?.limitAmount !== null &&
			matching.unilateralRule?.limitAmount !== undefined &&
			matching.unilateralRule.limitAmount > maximum
		) {
			errors.push(
				issue(
					`${base}.unilateralRule.limitAmount`,
					`Le montant ne peut pas dépasser ${maximum} €.`,
					"max",
				),
			);
		}
		if (complete && matching.unilateralRule?.limitKind == null)
			errors.push(
				issue(`${base}.unilateralRule.limitKind`, "Choisissez la nature du plafond.", "required"),
			);
		if (complete && matching.unilateralRule?.limitAmount == null)
			errors.push(
				issue(
					`${base}.unilateralRule.limitAmount`,
					"Renseignez le montant du plafond.",
					"required",
				),
			);
	}
	if (complete && matching.specificRule && !matching.specificRuleDetails?.trim()) {
		errors.push(issue(`${base}.specificRuleDetails`, "Décrivez la règle spécifique.", "required"));
	}
	return errors;
}
