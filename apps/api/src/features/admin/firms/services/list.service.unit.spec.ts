import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import ListFirmsService from "#features/admin/firms/services/list.service";
import Firm from "#models/firm";

async function createFirm(name: string, values: Partial<Firm> = {}) {
	return FirmFactory.merge({ name, ...values })
		.with("address")
		.with("paymentDetail")
		.create();
}

test.group("Features / Admin / Firms / Services / List Service", () => {
	test("it should order by creation date descending by default", async ({ assert }) => {
		const first = await createFirm("Default Firm First", { orias: "20000001" });
		const second = await createFirm("Default Firm Second", { orias: "20000002" });
		await Firm.query()
			.where("id", Number(first.id))
			.update({ createdAt: DateTime.fromISO("2026-01-01T00:00:00.000Z") });
		await Firm.query()
			.where("id", Number(second.id))
			.update({ createdAt: DateTime.fromISO("2026-02-01T00:00:00.000Z") });

		const firms = await new ListFirmsService().handle({ q: "Default Firm" });

		assert.deepEqual(
			firms.map((firm) => firm.id),
			[second.id, first.id],
		);
	});

	test("it should search only the firm name", async ({ assert }) => {
		const nameMatch = await createFirm("Exclusive Firm Search", {
			amundiOrgId: "OTHER-FIRM-VALUE",
			orias: "20000003",
		});
		await createFirm("Unrelated Firm", {
			amundiOrgId: "Exclusive Firm Search",
			orias: "20000004",
		});

		const firms = await new ListFirmsService().handle({ q: "exclusive firm search" });

		assert.deepEqual(
			firms.map((firm) => firm.id),
			[nameMatch.id],
		);
	});

	test("it should filter by network identifier", async ({ assert }) => {
		const network = await NetworkFactory.with("address").with("paymentDetail").create();
		const matching = await createFirm("Matching Network Firm", {
			networkId: network.id,
			orias: "20000005",
		});
		await createFirm("Detached Network Firm", { orias: "20000006" });

		const firms = await new ListFirmsService().handle({ networkId: Number(network.id) });

		assert.deepEqual(
			firms.map((firm) => firm.id),
			[matching.id],
		);
	});

	test("it should support both directions for every whitelisted sort field", async ({ assert }) => {
		const firstNetwork = await NetworkFactory.with("address").with("paymentDetail").create();
		const secondNetwork = await NetworkFactory.with("address").with("paymentDetail").create();
		const first = await createFirm("Sort Firm Alpha", {
			amundiOrgId: "FIRM-AMUNDI-A",
			orias: "30000001",
			networkId: firstNetwork.id,
		});
		const second = await createFirm("Sort Firm Zulu", {
			amundiOrgId: "FIRM-AMUNDI-Z",
			orias: "30000002",
			networkId: secondNetwork.id,
		});
		await Firm.query()
			.where("id", Number(first.id))
			.update({
				createdAt: DateTime.fromISO("2026-01-01T00:00:00.000Z"),
				updatedAt: DateTime.fromISO("2026-01-01T00:00:00.000Z"),
			});
		await Firm.query()
			.where("id", Number(second.id))
			.update({
				createdAt: DateTime.fromISO("2026-02-01T00:00:00.000Z"),
				updatedAt: DateTime.fromISO("2026-02-01T00:00:00.000Z"),
			});
		const service = new ListFirmsService();
		const fields = [
			"id",
			"name",
			"amundiOrgId",
			"orias",
			"networkId",
			"createdAt",
			"updatedAt",
		] as const;

		for (const field of fields) {
			const ascending = await service.handle({
				q: "Sort Firm",
				orderBy: `${field}_asc`,
			});
			const descending = await service.handle({
				q: "Sort Firm",
				orderBy: `${field}_desc`,
			});

			assert.deepEqual(
				ascending.map((firm) => firm.id),
				[first.id, second.id],
				`${field}_asc`,
			);
			assert.deepEqual(
				descending.map((firm) => firm.id),
				[second.id, first.id],
				`${field}_desc`,
			);
		}
	});

	test("it should return firms without preloading relations", async ({ assert }) => {
		const network = await NetworkFactory.with("address").with("paymentDetail").create();
		const created = await createFirm("Preloaded Firm Relations", {
			networkId: network.id,
			orias: "40000001",
		});

		const [firm] = await new ListFirmsService().handle({ q: "Preloaded Firm Relations" });

		assert.equal(firm.addressId, created.addressId);
		assert.equal(firm.paymentDetailId, created.paymentDetailId);
		assert.isUndefined(firm.address);
		assert.isUndefined(firm.paymentDetail);
		assert.isUndefined(firm.network);
	});
});
