import redis from "@adonisjs/redis/services/main";
import ky, { HTTPError } from "ky";

import config from "#config/inpi";
import InpiCompanyNotFoundException from "#exceptions/inpi_company_not_found.exception";
import InpiDocumentUnavailableException from "#exceptions/inpi_document_unavailable.exception";
import InpiUnavailableException from "#exceptions/inpi_unavailable.exception";
import TooManyRequestsException from "#exceptions/too_many_requests.exception";

export default class InpiClientService {
	protected client = ky.create({
		baseUrl: config.baseUrl,
		timeout: config.timeout,
		retry: 0,
		redirect: "error",
	});

	async company(siren: string) {
		return this.#json(`/api/companies/${encodeURIComponent(siren)}`);
	}

	async attachments(siren: string) {
		return this.#json(`/api/companies/${encodeURIComponent(siren)}/attachments`);
	}

	async article(id: string) {
		return this.#json(`/api/actes/${encodeURIComponent(id)}`);
	}

	async #json(path: string) {
		const response = await this.#request(path);
		try {
			return (await response.json()) as unknown;
		} catch {
			throw new InpiUnavailableException();
		}
	}

	async download(id: string) {
		const response = await this.#request(`/api/actes/${encodeURIComponent(id)}/download`);
		if (Number(response.headers.get("content-length")) > config.maxDocumentSize) {
			await response.body?.cancel();
			throw new InpiDocumentUnavailableException();
		}
		if (!response.body) throw new InpiDocumentUnavailableException();
		const reader = response.body.getReader();
		const chunks: Uint8Array[] = [];
		let size = 0;
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				size += value.length;
				if (size > config.maxDocumentSize) throw new InpiDocumentUnavailableException();
				chunks.push(value);
			}
		} catch (error) {
			if (error instanceof InpiDocumentUnavailableException) throw error;
			throw new InpiUnavailableException();
		} finally {
			await reader.cancel().catch(() => {});
		}
		const buffer = Buffer.concat(chunks);
		if (!buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
			throw new InpiDocumentUnavailableException();
		}
		return buffer;
	}

	async #token(refresh = false) {
		if (!config.username || !config.password) throw new InpiUnavailableException();
		const key = "inpi:authentication";
		if (refresh) await redis.del(key);
		const cached = await redis.get(key);
		if (cached) return cached;
		const result = await this.client
			.post("/api/sso/login", {
				json: { username: config.username, password: config.password },
			})
			.json<{ token?: unknown }>();
		if (typeof result.token !== "string" || !result.token) throw new InpiUnavailableException();
		await redis.setex(key, config.tokenTtl, result.token);
		return result.token;
	}

	async #request(path: string) {
		try {
			const token = await this.#token();
			try {
				return await this.client.get(path, {
					headers: { Authorization: `Bearer ${token}` },
					signal: AbortSignal.timeout(config.timeout),
				});
			} catch (error) {
				if (!(error instanceof HTTPError) || error.response.status !== 401) throw error;
				const renewed = await this.#token(true);
				return await this.client.get(path, {
					headers: { Authorization: `Bearer ${renewed}` },
					signal: AbortSignal.timeout(config.timeout),
				});
			}
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 404) {
				if (path.startsWith("/api/actes/")) throw new InpiDocumentUnavailableException();
				throw new InpiCompanyNotFoundException();
			}
			if (error instanceof HTTPError && error.response.status === 429) {
				throw new TooManyRequestsException();
			}
			throw new InpiUnavailableException();
		}
	}
}
