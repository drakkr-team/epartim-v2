import { inject } from "@adonisjs/core";

import InpiDocumentUnavailableException from "#exceptions/inpi_document_unavailable.exception";
import ChangeSubscriptionCompanyService from "#features/client/subscriptions/services/company_change.service";
import PreviewSubscriptionInpiService from "#features/client/subscriptions/services/inpi/preview.service";
import Subscription from "#models/subscription";
import InpiClientService from "#services/inpi/client.service";
import InpiMapperService from "#services/inpi/mapper.service";

@inject()
export default class SubscriptionInpiArticlesService {
	constructor(
		protected previewService: PreviewSubscriptionInpiService,
		protected client: InpiClientService,
		protected mapper: InpiMapperService,
		protected companyChangeService: ChangeSubscriptionCompanyService,
	) {}

	async preview(subscription: Subscription, previewId: string, actId: string) {
		this.companyChangeService.assertEditable(subscription);
		const preview = await this.previewService.find(subscription.id, previewId);
		if (!preview.articles.some((article) => article.id === actId))
			throw new InpiDocumentUnavailableException();
		const article = this.mapper.article(await this.client.article(actId), preview.siren);
		if (!article) throw new InpiDocumentUnavailableException();
		return { article, buffer: await this.client.download(actId) };
	}
}
