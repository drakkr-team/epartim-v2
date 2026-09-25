import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionDocumentRequirementsService, {
	type SubscriptionDocumentRequirement,
} from "#features/client/subscriptions/services/documents/requirements.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import Subscription from "#models/subscription";
import AddressPresenter from "#presenters/address.presenter";
import CompanyPresenter from "#presenters/company.presenter";
import CompanyBeneficialOwnerPresenter from "#presenters/company_beneficial_owner.presenter";
import CompanyKycProfilePresenter from "#presenters/company_kyc_profile.presenter";
import ContactPresenter from "#presenters/contact.presenter";
import FilePresenter from "#presenters/file.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";
import SubscriptionPlanPresenter from "#presenters/subscription_plan.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
		protected companyKycProfilePresenter: CompanyKycProfilePresenter,
		protected companyBeneficialOwnerPresenter: CompanyBeneficialOwnerPresenter,
		protected contactPresenter: ContactPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
		protected documentRequirementsService: SubscriptionDocumentRequirementsService,
		protected filePresenter: FilePresenter,
		protected subscriptionPlanPresenter: SubscriptionPlanPresenter,
	) {}

	async handle({ bouncer, params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		await Promise.all([subscription.load("company"), subscription.load("creator")]);
		const address = subscription.company.addressId
			? await subscription.company.related("address").query().first()
			: null;
		const paymentDetail = subscription.company.paymentDetailId
			? await subscription.company.related("paymentDetail").query().first()
			: null;
		const [
			legalAgent,
			signer,
			correspondent,
			authorizations,
			documentRequirements,
			kycProfile,
			beneficialOwners,
			plan,
			existingAgreements,
		] = await Promise.all([
			subscription.company.related("legalAgent").query().first(),
			subscription.company.related("signer").query().first(),
			subscription.company.related("correspondent").query().first(),
			subscription.company
				.related("contacts")
				.query()
				.whereNotNull("authorizations")
				.orderBy("contacts.id"),
			this.documentRequirementsService.handle(subscription),
			subscription.company.related("kycProfile").query().first(),
			subscription.company
				.related("beneficialOwners")
				.query()
				.preload("address")
				.preload("roles")
				.orderBy("company_beneficial_owners.id"),
			subscription.related("plan").query().preload("adhesions").first(),
			subscription.related("existingAgreements").query().orderBy("type"),
		]);

		return {
			...this.subscriptionPresenter.toJSON(subscription),
			creator: {
				name: subscription.creator.name,
			},
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
			kyc: {
				profile: kycProfile ? this.companyKycProfilePresenter.toJSON(kycProfile) : null,
				owners: beneficialOwners.map((owner) =>
					this.companyBeneficialOwnerPresenter.toJSON(owner, owner.address, owner.roles),
				),
			},
			contractCharacteristics: plan
				? this.subscriptionPlanPresenter.toJSON(plan, plan.adhesions, existingAgreements)
				: {
						id: null,
						subscriptionId: subscription.id,
						existingDeviceTransfer: false,
						estimatedTransferAmount: null,
						adhesionTypes: [],
						existingAgreements: [],
						otherAgreementDetails: null,
						minimumSeniorityMonths: null,
					},
			documents: await this.#presentDocuments(
				documentRequirements.filter(
					(document) => document.step === SubscriptionStep.COMPANY_REFERENCES,
				),
			),
			kycDocuments: await this.#presentDocuments(
				documentRequirements.filter((document) => document.step === SubscriptionStep.KYC),
			),
			contractDocuments: await this.#presentDocuments(
				documentRequirements.filter(
					(document) => document.step === SubscriptionStep.CONTRACT_CHARACTERISTICS,
				),
			),
		};
	}

	async #presentDocuments(documents: SubscriptionDocumentRequirement[]) {
		return await Promise.all(
			documents.map(async ({ document, label, ownerId, type }) => ({
				file: document
					? await this.filePresenter.toJSON(document.file, { disposition: "attachment" })
					: null,
				label,
				ownerId,
				status: document ? "attached" : "pending",
				type,
			})),
		);
	}
}
