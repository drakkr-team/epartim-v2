import { DateTime } from "luxon";

import { POSA_FUNDS } from "#constants/posa";
import CommissionRate from "#models/commission_rate";
import Company from "#models/company";

export default class CommissionService {
	async compute(company: Company, date: DateTime<true>) {
		const commissionRate = await this.#getCommissionRate(company);

		const shortTermCommission = await this.#computeCommissionForTerm(
			company,
			date,
			"short",
			commissionRate,
		);
		const mediumTermCommission = await this.#computeCommissionForTerm(
			company,
			date,
			"medium",
			commissionRate,
		);
		const longTermCommission = await this.#computeCommissionForTerm(
			company,
			date,
			"long",
			commissionRate,
		);

		const total = shortTermCommission + mediumTermCommission + longTermCommission;

		return total === 0 ? null : total;
	}

	async #getCommissionRate(company: Company) {
		await company.load("subscription", (query) =>
			query.preload("creator", (query) =>
				query.preload("firm", (query) =>
					query
						.preload("commissionRate")
						.preload("network", (query) => query.preload("commissionRate")),
				),
			),
		);

		const firm = company.subscription.creator.firm;
		const network = firm.networkId ? firm.network : null;

		let commissionRate = firm.commissionRate;
		const firmCommissionRateSum =
			commissionRate.shortTermRatePercent +
			commissionRate.mediumTermRatePercent +
			commissionRate.longTermRatePercent;
		if (network && firmCommissionRateSum === 0) {
			commissionRate = network.commissionRate;
		}

		return commissionRate;
	}

	async #computeCommissionForTerm(
		company: Company,
		date: DateTime<true>,
		term: "short" | "medium" | "long",
		commissionRate: CommissionRate,
	) {
		const fundByterm = {
			short: [POSA_FUNDS.FR0013425030, POSA_FUNDS.FR0013344934],
			medium: [POSA_FUNDS.FR0013425063, POSA_FUNDS.FR0013344918],
			long: [POSA_FUNDS.FR0013344926, POSA_FUNDS.FR0013425048],
		};

		const commissionRateForTerm = () => {
			switch (term) {
				case "short":
					return commissionRate.shortTermRatePercent / 100;
				case "medium":
					return commissionRate.mediumTermRatePercent / 100;
				case "long":
					return commissionRate.longTermRatePercent / 100;
			}
		};

		const posas = await company
			.related("posas")
			.query()
			.where("valuation_date", date.toSQLDate())
			.whereIn("fund", fundByterm[term]);

		return (
			posas.reduce((sum, posa) => {
				const sharesSum = posa.availableShares + posa.unavailableShares;
				const total = sharesSum * posa.rate;
				const totalQuarter = total / 4;
				return sum + totalQuarter;
			}, 0) * commissionRateForTerm()
		);
	}
}
