import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { NetworkFactory } from "#database/factories/network.factory";
import ListNetworksService from "#features/admin/networks/services/list.service";
import Network from "#models/network";

async function createNetwork(name: string, values: Partial<Network> = {}) {
	return NetworkFactory.merge({ name, ...values })
		.with("address")
		.with("paymentDetail")
		.create();
}

test.group("Features / Admin / Networks / Services / List Service", () => {
	test("it should order by creation date descending by default", async ({ assert }) => {
		const first = await createNetwork("Default Tie First");
		const second = await createNetwork("Default Tie Second");
		await Network.query()
			.where("id", Number(first.id))
			.update({ createdAt: DateTime.fromISO("2026-01-01T00:00:00.000Z") });
		await Network.query()
			.where("id", Number(second.id))
			.update({ createdAt: DateTime.fromISO("2026-02-01T00:00:00.000Z") });

		const networks = await new ListNetworksService().handle({ q: "Default Tie" });

		assert.deepEqual(
			networks.map((network) => network.id),
			[second.id, first.id],
		);
	});

	test("it should search only the network name", async ({ assert }) => {
		const nameMatch = await createNetwork("Exclusive Search Token", {
			amundiOrgId: "OTHER-VALUE",
		});
		await createNetwork("Unrelated Network", {
			amundiOrgId: "Exclusive Search Token",
			goCode: 880_110,
		});

		const networks = await new ListNetworksService().handle({ q: "exclusive search" });

		assert.deepEqual(
			networks.map((network) => network.id),
			[nameMatch.id],
		);
	});

	test("it should support both directions for every whitelisted sort field", async ({ assert }) => {
		const first = await createNetwork("Sort Matrix Alpha", {
			amundiOrgId: "AMUNDI-A",
			goCode: 10,
		});
		const second = await createNetwork("Sort Matrix Zulu", {
			amundiOrgId: "AMUNDI-Z",
			goCode: 20,
		});
		await Network.query()
			.where("id", Number(first.id))
			.update({
				createdAt: DateTime.fromISO("2026-01-01T00:00:00.000Z"),
				updatedAt: DateTime.fromISO("2026-01-01T00:00:00.000Z"),
			});
		await Network.query()
			.where("id", Number(second.id))
			.update({
				createdAt: DateTime.fromISO("2026-02-01T00:00:00.000Z"),
				updatedAt: DateTime.fromISO("2026-02-01T00:00:00.000Z"),
			});
		const service = new ListNetworksService();
		const fields = ["id", "name", "amundiOrgId", "goCode", "createdAt", "updatedAt"] as const;

		for (const field of fields) {
			const ascending = await service.handle({
				q: "Sort Matrix",
				orderBy: `${field}_asc`,
			});
			const descending = await service.handle({
				q: "Sort Matrix",
				orderBy: `${field}_desc`,
			});

			assert.deepEqual(
				ascending.map((network) => network.id),
				[first.id, second.id],
				`${field}_asc`,
			);
			assert.deepEqual(
				descending.map((network) => network.id),
				[second.id, first.id],
				`${field}_desc`,
			);
		}
	});

	test("it should return relation identifiers without preloading relations", async ({ assert }) => {
		const created = await createNetwork("Preloaded Relations");

		const [network] = await new ListNetworksService().handle({ q: "Preloaded Relations" });

		assert.equal(network.addressId, created.addressId);
		assert.equal(network.paymentDetailId, created.paymentDetailId);
		assert.isUndefined(network.address);
		assert.isUndefined(network.paymentDetail);
	});
});
