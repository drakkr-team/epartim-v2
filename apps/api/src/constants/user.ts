export const USER_ROLES = {
	USER: 0,
	FIRM: 1,
	NETWORK: 2,
	ADMIN: 3,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
