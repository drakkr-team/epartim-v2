import { INPI_COMPANY_FIELDS } from "#constants/inpi";
import type { SubscriptionInpiPreview } from "#features/client/subscriptions/services/inpi/preview.service";

export default class SubscriptionInpiPreviewPresenter {
	toJSON(preview: SubscriptionInpiPreview) {
		return {
			id: preview.id,
			siren: preview.siren,
			expiresAt: preview.expiresAt,
			currentSiren: preview.currentSiren,
			currentName: preview.currentName,
			companyChangeRequired: preview.companyChangeRequired,
			fields: INPI_COMPANY_FIELDS.map((key) => ({
				key,
				current: preview.currentValues[key],
				proposed: preview.values[key],
				selected: preview.values[key] !== null,
			})),
			people: preview.people,
			articles: preview.articles,
			warnings: preview.warnings,
		};
	}
}
