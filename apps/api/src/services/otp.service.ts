import { createHmac } from "node:crypto";

import StringHelpers from "@adonisjs/core/helpers/string";
import redis from "@adonisjs/redis/services/main";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import env from "#start/env";

export default class OtpService<Data = unknown> {
	async generate(options: {
		key: string;
		type: "numeric" | "alphanumeric";
		length: number;
		expireIn: number;
		data: Data;
	}) {
		const otp = this.#createOtp(options.type, options.length);
		const hashedOtp = this.#hash(otp);

		const tokenKey = this.#createTokenKey(hashedOtp);
		const groupKey = this.#createGroupKey(options.key);

		await this.revoke(options.key);
		await redis
			.multi()
			.setex(tokenKey, options.expireIn, JSON.stringify(options.data))
			.sadd(groupKey, tokenKey)
			.expire(groupKey, options.expireIn)
			.exec();

		return otp;
	}

	async verify(otp: string) {
		const hashedOtp = this.#hash(otp);
		const data = await redis.getdel(this.#createTokenKey(hashedOtp));
		if (!data) throw new InvalidTokenException();

		return JSON.parse(data) as Data;
	}

	async revoke(key: string) {
		const groupKey = this.#createGroupKey(key);
		const tokenKeys = await redis.smembers(groupKey);

		await redis.del(groupKey, ...tokenKeys);
	}

	#createOtp(type: "numeric" | "alphanumeric", length: number) {
		if (type === "numeric") {
			const min = 10 ** (length - 1);
			const max = 10 ** length - 1;

			return String(Math.floor(Math.random() * (max - min + 1)) + min);
		}

		return StringHelpers.random(length);
	}

	#hash(value: string) {
		return createHmac("sha256", env.get("APP_KEY")).update(value).digest("hex");
	}

	#createTokenKey(hashedOtp: string) {
		return `otp:token:${hashedOtp}`;
	}

	#createGroupKey(key: string) {
		return `otp:group:${key}`;
	}
}
