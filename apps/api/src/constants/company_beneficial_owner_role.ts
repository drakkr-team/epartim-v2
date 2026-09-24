export const CompanyBeneficialOwnerRoleCode = {
	DIRECTOR: 1,
	BENEFICIAL_OWNER: 2,
	PROXY: 3,
	SHAREHOLDER: 4,
} as const;

export type CompanyBeneficialOwnerRoleCode =
	(typeof CompanyBeneficialOwnerRoleCode)[keyof typeof CompanyBeneficialOwnerRoleCode];
