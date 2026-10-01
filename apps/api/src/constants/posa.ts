export const POSA_CONTRACT_TYPES = {
	PEI: 1,
	PERCOLI: 2,
	PERCOL: 2,
} as const;

export type PosaContractType = (typeof POSA_CONTRACT_TYPES)[keyof typeof POSA_CONTRACT_TYPES];

export const POSA_FUNDS = {
	FR0013425030: 0, // GO Court Terme D
	FR0013344934: 1, // GO Court Terme E
	FR0013425063: 2, // GO Moyen Terme D
	FR0013344918: 3, // GO Moyen Terme E
	FR0013344926: 4, // GO Long Terme E
	FR0013425048: 5, // GO Long Terme D
	// 990000202479: 6, // Sienna
	// FR0010106500: 7, // Échiquier Excelsior A
	// LU1303940784: 8, // Mandarine Europe Microcap R EUR
} as const;

export type PosaFund = (typeof POSA_FUNDS)[keyof typeof POSA_FUNDS];
