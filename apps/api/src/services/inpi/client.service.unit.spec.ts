import redis from "@adonisjs/redis/services/main";
import { test } from "@japa/runner";

import config from "#config/inpi";
import InpiClientService from "#services/inpi/client.service";

class TestInpiClient extends InpiClientService {
	constructor(fetch: typeof globalThis.fetch) {
		super();
		this.client = this.client.extend({ fetch });
	}
}

test.group("Services / INPI client", (group) => {
	group.each.setup(async () => {
		const previous = { username: config.username, password: config.password };
		config.username = "synthetic@example.test";
		config.password = "synthetic-password";
		await redis.del("inpi:authentication");
		return async () => {
			Object.assign(config, previous);
			await redis.del("inpi:authentication");
		};
	});

	test("caches the token and refreshes only once after unauthorized", async ({ assert }) => {
		let logins = 0;
		let companies = 0;
		const client = new TestInpiClient(async (input) => {
			const request = new Request(input);
			if (request.url.endsWith("/sso/login")) {
				logins++;
				return Response.json({ token: `token-${logins}` });
			}
			companies++;
			if (companies === 2) return new Response(null, { status: 401 });
			assert.equal(request.headers.get("authorization"), `Bearer token-${logins}`);
			return Response.json({ siren: "123456789" });
		});
		await client.company("123456789");
		await client.company("123456789");
		await client.company("123456789");
		assert.equal(logins, 2);
		assert.equal(companies, 4);
	});

	test("does not loop on repeated authentication failure", async ({ assert }) => {
		let calls = 0;
		const client = new TestInpiClient(async (input) => {
			calls++;
			return new Request(input).url.endsWith("/sso/login")
				? Response.json({ token: "token" })
				: new Response(null, { status: 401 });
		});
		await assert.rejects(() => client.company("123456789"), /INPI is temporarily unavailable/);
		assert.equal(calls, 4);
	});

	test("preserves quotas and does not retry upstream rate limits", async ({ assert }) => {
		await redis.setex("inpi:authentication", 60, "token");
		let calls = 0;
		const client = new TestInpiClient(async () => {
			calls++;
			return new Response(null, { status: 429 });
		});
		await assert.rejects(() => client.company("123456789"));
		assert.equal(calls, 1);
	});

	test("rejects invalid JSON without exposing upstream content", async ({ assert }) => {
		await redis.setex("inpi:authentication", 60, "token");
		const client = new TestInpiClient(async () => new Response("upstream details"));
		await assert.rejects(() => client.company("123456789"), /INPI is temporarily unavailable/);
	});

	test("rejects oversized and non-PDF documents and accepts a valid PDF", async ({ assert }) => {
		await redis.setex("inpi:authentication", 60, "token");
		const oversized = new TestInpiClient(
			async () =>
				new Response("%PDF-1.4", {
					headers: { "content-length": String(config.maxDocumentSize + 1) },
				}),
		);
		await assert.rejects(() => oversized.download("synthetic"));
		const invalid = new TestInpiClient(async () => new Response("<html>not a PDF</html>"));
		await assert.rejects(() => invalid.download("synthetic"));
		const valid = new TestInpiClient(async () => new Response("%PDF-1.4"));
		assert.equal((await valid.download("synthetic")).toString(), "%PDF-1.4");
	});
});
