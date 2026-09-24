import { test } from "@japa/runner";

import { AddressFactory } from "#database/factories/address.factory";
import { AdminFactory } from "#database/factories/admin.factory";
import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import CompanyKycProfile from "#models/company_kyc_profile";
import File from "#models/file";
import Role from "#models/role";

test.group("Features / Admin / Companies / Controllers / View Controller", () => {
	test("it should return a company and permitted actions", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:company"];
		await role.save();
		const company = await CompanyFactory.with("subscription").create();

		const response = await client
			.visit("admin.companies.view", { companyId: company.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		response.assertBodyContains({
			id: company.id,
			subscriptionId: company.subscriptionId,
			address: null,
			paymentDetail: null,
			legalAgent: null,
			correspondent: null,
			signer: null,
			contacts: [],
			kycProfile: null,
			bankDetailsDocument: null,
			legalAgentIdDocument: null,
			companyDetailsDocument: null,
			contactsStatusDocument: null,
			meta: { canUpdate: true },
		});
		assert.notProperty(response.body(), "subscription");
	});

	test("it should return not found for an unknown company", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const response = await client
			.visit("admin.companies.view", { companyId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});

	test("it should return the company's populated relations", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const address = await AddressFactory.create();
		const paymentDetail = await PaymentDetailFactory.create();
		const legalAgent = await ContactFactory.create();
		const correspondent = await ContactFactory.create();
		const signer = await ContactFactory.create();
		const contact = await ContactFactory.apply("withAuthorizations").create();
		const file = await File.create({
			key: "companies/bank-details.pdf",
			name: "RIB.pdf",
			size: 1024,
			type: "application/pdf",
		});
		const company = await CompanyFactory.merge({
			addressId: address.id,
			paymentDetailId: paymentDetail.id,
			companyLegalAgentId: legalAgent.id,
			companyCorrespondentId: correspondent.id,
			companySignerId: signer.id,
			bankDetailsDocumentId: file.id,
		})
			.with("subscription")
			.create();
		const profile = await CompanyKycProfile.create({ companyId: company.id });
		await company.related("contacts").attach([contact.id]);

		const response = await client
			.visit("admin.companies.view", { companyId: company.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		response.assertBodyContains({
			address: { id: address.id, city: address.city },
			paymentDetail: { id: paymentDetail.id, iban: paymentDetail.iban },
			legalAgent: { id: legalAgent.id },
			correspondent: { id: correspondent.id },
			signer: { id: signer.id },
			contacts: [{ id: contact.id, authorizations: contact.authorizations }],
			kycProfile: { id: profile.id, companyId: company.id },
			bankDetailsDocument: { id: file.id, name: file.name },
		});
	});
});
