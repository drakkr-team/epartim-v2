import CommissionRate from "#models/commission_rate";

export default class CommissionRatePresenter {
	toJSON(commissionRate: CommissionRate) {
		return {
			id: commissionRate.id,

			shortTermRatePercent: commissionRate.shortTermRatePercent,
			mediumTermRatePercent: commissionRate.mediumTermRatePercent,
			longTermRatePercent: commissionRate.longTermRatePercent,

			createdAt: commissionRate.createdAt.toJSDate(),
			updatedAt: commissionRate.updatedAt.toJSDate(),
		};
	}
}
