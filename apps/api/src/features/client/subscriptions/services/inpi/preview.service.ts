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
}
