import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";

export const SubscriptionFormalismGroup = { PEI_PER: 1, PARTICIPATION: 2 } as const;
export type SubscriptionFormalismGroup =
	(typeof SubscriptionFormalismGroup)[keyof typeof SubscriptionFormalismGroup];
export const SubscriptionFormalismMethod = { CSE: 1, RATIFICATION: 2, DUE: 3 } as const;
export type SubscriptionFormalismMethod =
	(typeof SubscriptionFormalismMethod)[keyof typeof SubscriptionFormalismMethod];
export const SubscriptionCseFunction = { SECRETARY: 1, OTHER: 2 } as const;
export type SubscriptionCseFunction =
	(typeof SubscriptionCseFunction)[keyof typeof SubscriptionCseFunction];

export function getActiveFormalismGroups(
	adhesionTypes: readonly number[],
): SubscriptionFormalismGroup[] {
	return [
		...(adhesionTypes.some(
			(type) =>
				type === SubscriptionPlanAdhesionType.PEI_EPARTIM ||
				type === SubscriptionPlanAdhesionType.PER_COLI_EPARTIM,
		)
			? [SubscriptionFormalismGroup.PEI_PER]
			: []),
		...(adhesionTypes.includes(SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT)
			? [SubscriptionFormalismGroup.PARTICIPATION]
			: []),
	];
}

export function getAvailableFormalismMethods(
	group: SubscriptionFormalismGroup,
	headcount: string | null,
): SubscriptionFormalismMethod[] {
	if (!headcount || Number(headcount) < 1) return [];
	return [
		SubscriptionFormalismMethod.CSE,
		SubscriptionFormalismMethod.RATIFICATION,
		...(group === SubscriptionFormalismGroup.PEI_PER && Number(headcount) < 50
			? [SubscriptionFormalismMethod.DUE]
			: []),
	];
}
