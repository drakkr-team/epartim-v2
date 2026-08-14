import { createHmac } from "node:crypto";

import StringHelpers from "@adonisjs/core/helpers/string";
import redis from "@adonisjs/redis/services/main";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import env from "#start/env";

export default class OtpService<Data = unknown> {
	async generate(options: {
		type: "numeric" | "alphanumeric";
		length: number;
		expireIn: number;
		data: Data;
	}) {
		const otp = this.#createOtp(options.type, options.length);
		const hashedOtp = this.#createHash(otp);

		await redis.setex(`otp:${hashedOtp}`, options.expireIn, JSON.stringify(options.data));

		return otp;
	}

	async verify(otp: string) {
		const hashedOtp = this.#createHash(otp);
		const data = await redis.getdel(`otp:${hashedOtp}`);
		if (!data) throw new InvalidTokenException();

		return JSON.parse(data) as Data;
	}

	#createOtp(type: "numeric" | "alphanumeric", length: number) {
		if (type === "numeric") {
			const min = 10 ** (length - 1);
			const max = 10 ** length - 1;

			return String(Math.floor(Math.random() * (max - min + 1)) + min);
		}

		return StringHelpers.random(length);
	}

	#createHash(otp: string) {
		return createHmac("sha256", env.get("APP_KEY")).update(otp).digest("hex");
	}
}
