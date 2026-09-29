import { test } from "@japa/runner";
import { DateTime } from "luxon";

import type { PosaDeviceType } from "#constants/posa";
import { POSA_FUNDS } from "#constants/posa";
import { CompanyFactory } from "#database/factories/company.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import CommissionRate from "#models/commission_rate";
import type Company from "#models/company";
import Posa from "#models/posa";
import CommissionService from "#services/commission.service";

function validDate(value: string): DateTime<true> {
	const date = DateTime.fromISO(value);
	if (!date.isValid) {
		throw new TypeError(`Invalid closing date: ${value}`);
	}
	return date;
}

async function createCompany(
	withNetwork = false,
	firmRates: Partial<
		Pick<
			CommissionRate,
			"shortTermRatePercent" | "mediumTermRatePercent" | "longTermRatePercent"
		>
	> = {},
) {
	const firmRate = await CommissionRate.create({
		shortTermRatePercent: 0.2,
		mediumTermRatePercent: 0.8,
		longTermRatePercent: 0.4,
		...firmRates,
	});
	const network = withNetwork
		? await NetworkFactory.merge({
				commissionRateId: (
					await CommissionRate.create({
						shortTermRatePercent: 0.8,
						mediumTermRatePercent: 0.2,
						longTermRatePercent: 0.6,
					})
				).id,
			})
				.with("address")
				.with("paymentDetail")
				.create()
		: null;
	const firm = await FirmFactory.merge({
		commissionRateId: firmRate.id,
		networkId: network?.id ?? null,
	})
		.with("address")
		.with("paymentDetail")
		.create();
	const creator = await UserFactory.merge({ firmId: firm.id }).create();
	const subscription = await SubscriptionFactory.merge({ createdBy: creator.id }).create();
	return CompanyFactory.merge({
		subscriptionId: subscription.id,
		amundiId: `COMMISSION-${subscription.id}`,
	}).create();
}

async function addFund(
	company: Company,
	date: DateTime<true>,
	fund: (typeof POSA_FUNDS)[keyof typeof POSA_FUNDS],
	availableShares: number,
	unavailableShares: number,
	rate: number,
	deviceType: PosaDeviceType = 1,
	deviceCode: string = "DEFAULT_DEVICE_CODE",
) {
	const companyId = company.amundiId;
	if (companyId === null) {
		throw new TypeError("The test company must have an Amundi ID");
	}
	await Posa.create({
		companyId,
		deviceType,
		deviceCode,
		fund,
		availableShares,
		unavailableShares,
		rate,
		valuationDate: date,
	});
}

test.group("Services / Commission Service", () => {
	for (const closingDate of ["2026-03-31", "2026-06-30", "2026-09-30", "2026-12-31"]) {
		test(`it should calculate 140 euros for two funds on ${closingDate}`, async ({ assert }) => {
			const company = await createCompany();
			const date = validDate(closingDate);
			await addFund(company, date, POSA_FUNDS.FR0013425030, 320.25, 319.75, 62.5);
			await addFund(company, date, POSA_FUNDS.FR0013425063, 480.25, 479.75, 62.5);

			const commission = await new CommissionService().compute(company, date);

			assert.equal(commission, 140);
		});
	}

	test("it should preserve a fractional commission without rounding", async ({ assert }) => {
		const company = await createCompany();
		const date = validDate("2026-06-30");
		await addFund(company, date, POSA_FUNDS.FR0013425030, 320.25, 323.75, 62.5);

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 20.125);
	});

	test("it should prefer the firm rates when a network also has rates", async ({ assert }) => {
		const company = await createCompany(true);
		const date = validDate("2026-09-30");
		await addFund(company, date, POSA_FUNDS.FR0013425030, 639.75, 0.25, 62.5);
		await addFund(company, date, POSA_FUNDS.FR0013425063, 959.75, 0.25, 62.5);

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 140);
	});

	test("it should fall back to network rates when firm rates are zero", async ({ assert }) => {
		const company = await createCompany(true, {
			shortTermRatePercent: 0,
			mediumTermRatePercent: 0,
			longTermRatePercent: 0,
		});
		const date = validDate("2026-09-30");
		await addFund(company, date, POSA_FUNDS.FR0013425030, 639.75, 0.25, 62.5);
		await addFund(company, date, POSA_FUNDS.FR0013425063, 959.75, 0.25, 62.5);

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 110);
	});

	test("it should keep the firm rates when only one firm rate is zero", async ({ assert }) => {
		const company = await createCompany(true, { mediumTermRatePercent: 0 });
		const date = validDate("2026-09-30");
		await addFund(company, date, POSA_FUNDS.FR0013425030, 639.75, 0.25, 62.5);
		await addFund(company, date, POSA_FUNDS.FR0013425063, 959.75, 0.25, 62.5);

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 20);
	});

	test("it should ignore other valuation dates and other companies", async ({ assert }) => {
		const company = await createCompany();
		const otherCompany = await createCompany();
		const date = validDate("2026-12-31");
		await addFund(company, date, POSA_FUNDS.FR0013425030, 639.75, 0.25, 62.5);
		await addFund(company, validDate("2026-09-30"), POSA_FUNDS.FR0013425030, 799.75, 0.25, 100);
		await addFund(otherCompany, date, POSA_FUNDS.FR0013425063, 959.75, 0.25, 62.5);

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 20);
	});

	test("it should return null when the company has no funds on the closing date", async ({
		assert,
	}) => {
		const company = await createCompany();
		const date = validDate("2026-03-31");

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, null);
	});

	test("real data test", async ({ assert }) => {
		const firm = await FirmFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (record) =>
				record.merge({
					shortTermRatePercent: 0.9,
					mediumTermRatePercent: 0.9,
					longTermRatePercent: 0.2,
				}),
			)
			.create();
		const company = await CompanyFactory.with("address")
			.with("paymentDetail")
			.with("subscription", 1, (record) =>
				record.with("creator", 1, (record) => record.merge({ firmId: firm.id })),
			)
			.create();
		const date = validDate("2026-06-30");

		

		const commission = await new CommissionService().compute(company, date);

		console.log(commission);
	});
});

const bidule = [
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "84.0445",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "17.0993",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "260.9135",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6774",
		ISIN_FCPE: "LU1303940784",
		DT_VAL: "30/06/2026",
		COURS: "28.28",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "7.8025",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "84.0445",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "251.578",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162833",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "272.646",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "85.9869",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "623.4491",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "17.0993",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "24.7868",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "260.9135",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6774",
		ISIN_FCPE: "LU1303940784",
		DT_VAL: "30/06/2026",
		COURS: "28.28",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "7.9751",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "26.1572",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "84.0445",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "17.0993",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "260.9135",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6774",
		ISIN_FCPE: "LU1303940784",
		DT_VAL: "30/06/2026",
		COURS: "28.28",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "7.8025",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "84.0445",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "251.578",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162833",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "272.646",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001164583",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "85.9869",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "623.4491",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "17.0993",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6525",
		ISIN_FCPE: "FR0013425048",
		DT_VAL: "30/06/2026",
		COURS: "146.65",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "24.7868",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162832",
		TYPE_DISPO: "PEI",
		CD_FONDS: "6521",
		ISIN_FCPE: "FR0013425030",
		DT_VAL: "30/06/2026",
		COURS: "109.06",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "260.9135",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6774",
		ISIN_FCPE: "LU1303940784",
		DT_VAL: "30/06/2026",
		COURS: "28.28",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "7.9751",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "6523",
		ISIN_FCPE: "FR0013425063",
		DT_VAL: "30/06/2026",
		COURS: "111.26",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": "26.1572",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
	{
		CD_ENT: "1162832",
		CD_DISPO: "0001162838",
		TYPE_DISPO: "PERCOLI",
		CD_FONDS: "9551",
		ISIN_FCPE: "FR0010106500",
		DT_VAL: "30/06/2026",
		COURS: "543.92",
		"SUM(NB_PARTS_DISPO)": "0",
		"SUM(NB_PARTS_INDISPO)": ".439",
	},
];
