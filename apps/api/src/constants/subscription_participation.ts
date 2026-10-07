export const SubscriptionParticipationDuration = {
	INDEFINITE: 0,
	ONE_YEAR: 1,
	TWO_YEARS: 2,
	THREE_YEARS: 3,
} as const;
export type SubscriptionParticipationDuration =
	(typeof SubscriptionParticipationDuration)[keyof typeof SubscriptionParticipationDuration];

export const SubscriptionParticipationFormula = {
	LEGAL: 1,
	DEROGATORY_ONE: 2,
	DEROGATORY_TWO: 3,
	DEROGATORY_THREE: 4,
	DEROGATORY_FOUR: 5,
} as const;
export type SubscriptionParticipationFormula =
	(typeof SubscriptionParticipationFormula)[keyof typeof SubscriptionParticipationFormula];

export function canSelectVoluntaryParticipation(headcount: string | number | null | undefined) {
	return (
		headcount !== null &&
		headcount !== undefined &&
		headcount !== "" &&
		Number.isInteger(Number(headcount)) &&
		Number(headcount) >= 0 &&
		Number(headcount) <= 50
	);
}
