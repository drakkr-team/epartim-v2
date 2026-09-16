import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionDocumentRequirementsService from "#features/client/subscriptions/services/documents/requirements.service";
import Subscription from "#models/subscription";
import AddressPresenter from "#presenters/address.presenter";
import CompanyPresenter from "#presenters/company.presenter";
import ContactPresenter from "#presenters/contact.presenter";
import FilePresenter from "#presenters/file.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
		protected contactPresenter: ContactPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
		protected documentRequirementsService: SubscriptionDocumentRequirementsService,
		protected filePresenter: FilePresenter,
	) {}

	async handle({ bouncer, params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		await subscription.load("company");
		const address = subscription.company.addressId
			? await subscription.company.related("address").query().first()
			: null;
		const paymentDetail = subscription.company.paymentDetailId
			? await subscription.company.related("paymentDetail").query().first()
			: null;
		const [legalAgent, signer, correspondent, authorizations, documents] = await Promise.all([
			subscription.company.related("legalAgent").query().first(),
			subscription.company.related("signer").query().first(),
			subscription.company.related("correspondent").query().first(),
			subscription.company
				.related("contacts")
				.query()
				.whereNotNull("authorizations")
				.orderBy("contacts.id"),
			this.documentRequirementsService.handle(subscription),
		]);

		return {
			...this.subscriptionPresenter.toJSON(subscription),
			legalIdentification: this.companyPresenter.toJSON(subscription.company),
			addressAndBankDetails: {
				address: address ? this.addressPresenter.toJSON(address) : null,
				paymentDetail: paymentDetail ? this.paymentDetailPresenter.toJSON(paymentDetail) : null,
			},
			representativesAndAuthorizations: {
				legalAgent: legalAgent ? this.contactPresenter.toJSON(legalAgent) : null,
				signer: signer ? this.contactPresenter.toJSON(signer) : null,
				correspondent: correspondent ? this.contactPresenter.toJSON(correspondent) : null,
				authorizations: authorizations.map((authorization) =>
					this.contactPresenter.toJSON(authorization),
				),
			},
			documents: await Promise.all(
				documents.map(async ({ document, label, type }) => ({
					type,
					label,
					status: document ? "attached" : "pending",
					file: document
						? await this.filePresenter.toJSON(document.file, { access: "download" })
						: null,
				})),
			),
		};
	}
}
