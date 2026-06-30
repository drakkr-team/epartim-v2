import type fr from "#/libs/i18n/build/fr.json";

declare module "i18next" {
	interface CustomTypeOptions {
		resources: typeof fr;
	}
}
