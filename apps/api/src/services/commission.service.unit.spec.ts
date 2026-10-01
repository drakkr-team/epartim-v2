import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { POSA_FUNDS, type PosaDeviceType } from "#constants/posa";
import { CommissionRateFactory } from "#database/factories/commission_rate.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import { PosaFactory } from "#database/factories/posa.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import type CommissionRate from "#models/commission_rate";
import type Company from "#models/company";
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
		Pick<CommissionRate, "shortTermRatePercent" | "mediumTermRatePercent" | "longTermRatePercent">
	> = {},
) {
	const firmRate = await CommissionRateFactory.merge({
		shortTermRatePercent: 0.2,
		mediumTermRatePercent: 0.8,
		longTermRatePercent: 0.4,
		...firmRates,
	}).create();
	const network = withNetwork
		? await NetworkFactory.merge({
				commissionRateId: (
					await CommissionRateFactory.merge({
						shortTermRatePercent: 0.8,
						mediumTermRatePercent: 0.2,
						longTermRatePercent: 0.6,
					}).create()
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
	await PosaFactory.merge({
		companyId,
		deviceType,
		deviceCode,
		fund,
		availableShares,
		unavailableShares,
		rate,
		valuationDate: date,
	}).create();
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

	test("it should return 0 when the company has no funds on the closing date", async ({
		assert,
	}) => {
		const company = await createCompany();
		const date = validDate("2026-03-31");

		const commission = await new CommissionService().compute(company, date);

		assert.equal(commission, 0);
	});
});
