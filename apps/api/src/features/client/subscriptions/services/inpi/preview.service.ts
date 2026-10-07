import { randomUUID } from "node:crypto";

import { inject } from "@adonisjs/core";
import redis from "@adonisjs/redis/services/main";

import config from "#config/inpi";
import InpiPreviewExpiredException from "#exceptions/inpi_preview_expired.exception";
import ChangeSubscriptionCompanyService from "#features/client/subscriptions/services/company_change.service";
import Company from "#models/company";
import Subscription from "#models/subscription";
import InpiClientService from "#services/inpi/client.service";
import InpiMapperService from "#services/inpi/mapper.service";
import type { InpiArticle, InpiCompany, InpiCompanyValues } from "#services/inpi/types";

export type SubscriptionInpiPreview = InpiCompany & {
	id: string;
	subscriptionId: number;
	revision: number;
	expiresAt: string;
	currentSiren: string | null;
	currentName: string | null;
	currentValues: InpiCompanyValues;
	companyChangeRequired: boolean;
	articles: InpiArticle[];
};

export type InpiImportResult = {
	subscriptionId: number;
	companyChanged: boolean;
	createdOwnerIds: number[];
};

@inject()
export default class PreviewSubscriptionInpiService {
	constructor(
		protected client: InpiClientService,
		protected mapper: InpiMapperService,
		protected companyChangeService: ChangeSubscriptionCompanyService,
	) {}

	async handle(subscription: Subscription, siren: string) {
		this.companyChangeService.assertEditable(subscription);
		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const mapped = this.mapper.company(await this.client.company(siren), siren);
		let articles: InpiArticle[] = [];
		if (!mapped.warnings.includes("restricted_diffusion")) {
			try {
				articles = this.mapper.articles(await this.client.attachments(siren), siren);
			} catch {
				mapped.warnings.push("articles_unavailable");
			}
		}
		const address = await company.related("address").query().first();
		const preview: SubscriptionInpiPreview = {
			...mapped,
			id: randomUUID(),
			subscriptionId: subscription.id,
			revision: subscription.editRevision,
			expiresAt: new Date(Date.now() + config.previewTtl * 1000).toISOString(),
			currentSiren: company.siren,
			currentName: company.name,
			companyChangeRequired: await this.companyChangeService.requiresConfirmation(
				subscription,
				company,
				siren,
			),
			currentValues: {
				name: company.name,
				siret: company.siret,
				naf: company.naf,
				legalForm: company.legalForm,
				financialYearClosingDay: company.financialYearClosingDay,
				addressLineOne: address?.lineOne ?? null,
				addressLineTwo: address?.lineTwo ?? null,
				addressZip: address?.zip ?? null,
				addressCity: address?.city ?? null,
			},
			articles,
		};
		await redis
			.multi()
			.hset(`inpi:preview:${preview.id}`, {
				data: JSON.stringify(preview),
				state: "ready",
				subscriptionId: String(subscription.id),
			})
			.expire(`inpi:preview:${preview.id}`, config.previewTtl)
			.exec();
		return preview;
	}

	async find(subscriptionId: number, previewId: string) {
		const data = await redis.hget(`inpi:preview:${previewId}`, "data");
		if (!data) throw new InpiPreviewExpiredException();
		const preview = JSON.parse(data) as SubscriptionInpiPreview;
		if (preview.subscriptionId !== subscriptionId) throw new InpiPreviewExpiredException();
		return preview;
	}

	async claim(
		subscriptionId: number,
		previewId: string,
		selectionHash: string,
	): Promise<
		| { preview: SubscriptionInpiPreview; result?: never }
		| { result: InpiImportResult; preview?: never }
	> {
		const result = await redis.eval(
			`
			if redis.call('hget', KEYS[1], 'subscriptionId') ~= ARGV[1] then return {0} end
			local state = redis.call('hget', KEYS[1], 'state')
			if state == 'ready' then
				redis.call('hset', KEYS[1], 'state', 'applying', 'selectionHash', ARGV[2])
				return {1, redis.call('hget', KEYS[1], 'data')}
			end
			if state == 'applied' and redis.call('hget', KEYS[1], 'selectionHash') == ARGV[2] then
				return {2, redis.call('hget', KEYS[1], 'result')}
			end
			return {0}
		`,
			1,
			`inpi:preview:${previewId}`,
			String(subscriptionId),
			selectionHash,
		);
		if (!Array.isArray(result) || typeof result[1] !== "string")
			throw new InpiPreviewExpiredException();
		if (result[0] === 2) return { result: JSON.parse(result[1]) as InpiImportResult };
		if (result[0] !== 1) throw new InpiPreviewExpiredException();
		return { preview: JSON.parse(result[1]) as SubscriptionInpiPreview };
	}

	async complete(previewId: string, selectionHash: string, result: InpiImportResult) {
		await redis.eval(
			`
			if redis.call('hget', KEYS[1], 'state') ~= 'applying' or redis.call('hget', KEYS[1], 'selectionHash') ~= ARGV[1] then return 0 end
			redis.call('hset', KEYS[1], 'state', 'applied', 'result', ARGV[2])
			return 1
		`,
			1,
			`inpi:preview:${previewId}`,
			selectionHash,
			JSON.stringify(result),
		);
	}
}
