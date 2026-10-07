import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";

import redis from "@adonisjs/redis/services/main";

import SubscriptionEditConflictException from "#exceptions/subscription_edit_conflict.exception";

/** Serializes HTTP reads and writes across the subscription's existing transaction boundaries. */
export default class SubscriptionEditLockService {
	async handle<T>(subscriptionId: number, action: () => Promise<T>): Promise<T> {
		const key = `subscription:edit:${subscriptionId}`;
		const token = randomUUID();
		let acquired = false;
		for (let attempt = 0; attempt < 30; attempt++) {
			if (await redis.set(key, token, "PX", 60_000, "NX")) {
				acquired = true;
				break;
			}
			await setTimeout(100);
		}
		if (!acquired) throw new SubscriptionEditConflictException();
		let lost = false;
		const renewal = globalThis.setInterval(() => {
			void redis
				.eval(
					"if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end",
					1,
					key,
					token,
					60_000,
				)
				.then((result) => {
					if (result !== 1) lost = true;
				})
				.catch(() => {
					lost = true;
				});
		}, 15_000);
		renewal.unref();
		try {
			const result = await action();
			if (lost) throw new SubscriptionEditConflictException();
			return result;
		} finally {
			clearInterval(renewal);
			await redis.eval(
				"if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
				1,
				key,
				token,
			);
		}
	}
}
