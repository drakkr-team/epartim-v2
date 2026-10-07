import assert from "node:assert/strict";
import { test } from "node:test";

import {
	type CompanyReferencesInput,
	companyReferencesCompletion,
} from "#/features/subscriptions/steps/completion/company-references";
import { summarizeCompletion } from "#/features/subscriptions/steps/completion/completion";
import {
	type ContractCharacteristicsInput,
	contractCharacteristicsCompletion,
} from "#/features/subscriptions/steps/completion/contract-characteristics";
import { contractFeesCompletion } from "#/features/subscriptions/steps/completion/contract-fees";
import {
	type FormalismInput,
	formalismCompletion,
} from "#/features/subscriptions/steps/completion/formalism";
import { type KycInput, kycCompletion } from "#/features/subscriptions/steps/completion/kyc";

function companyFixture(): CompanyReferencesInput {
	const contact: NonNullable<
		CompanyReferencesInput["representativesAndAuthorizations"]["legalAgent"]
	> = {
		kind: 1,
		legalName: null,
		civility: 1,
		firstName: "Alice",
		lastName: "Martin",
		email: "alice@example.test",
		phoneNumber: "+33612345678",
		function: 1,
		isSameAsLegal: true,
		isSignatoryOnKbis: true,
		authorizations: null,
	};
	return {
		legalIdentification: {
			siren: "123456789",
			siret: "12345678900001",
			naf: "6201Z",
			name: "Entreprise exemple",
			legalForm: 1,
			companyHeadcount: "10",
			financialYearClosingDay: "31/12",
		},
		addressAndBankDetails: {
			address: { lineOne: "1 rue Exemple", zip: "75001", city: "Paris" },
			paymentDetail: { iban: "FR1420041010050500013M02606", bic: "PSSTFRPP" },
		},
		representativesAndAuthorizations: {
			legalAgent: contact,
			signer: { ...contact },
			correspondent: null,
			authorizations: [],
		},
		documents: [{ status: "attached" }, { status: "attached" }],
	};
}

function kycFixture(): KycInput {
	return {
		kyc: {
			profile: {
				regulatedActivity: false,
				regulatedActivityReference: null,
				listedCompany: false,
				listedCompanyReference: null,
				bicId: false,
				bearerBondsStructure: false,
				bearerBondsStructurePercentage: null,
				countryOfActivity: "france_and_eu",
				countryOfActivityBreakdown: null,
				countryProvider: "france_and_eu",
				mainMarkets: "france_and_eu",
			},
			owners: [],
		},
		kycDocuments: [],
	};
}

function ownerFixture(): KycInput["kyc"]["owners"][number] {
	return {
		kind: 1,
		firstName: "Alice",
		lastName: "Martin",
		legalName: null,
		birthDate: "1990-01-01",
		birthCity: "Paris",
		nationality: "FR",
		roles: [1],
		function: "Direction",
		shareholdingPercentage: 0,
		address: { id: 1, lineOne: "1 rue Exemple", lineTwo: null, zip: "75001", city: "Paris" },
	};
}

function planFixture(): ContractCharacteristicsInput {
	const matching = () => ({
		ruleTypes: [],
		uniformRules: [],
		seniorityRules: [],
		unilateralRule: null,
		specificRule: false,
		specificRuleDetails: null,
	});
	return {
		contractCharacteristics: {
			existingDeviceTransfer: false,
			estimatedTransferAmount: null,
			adhesionTypes: [1],
			existingAgreements: [],
			otherAgreementDetails: null,
			minimumSeniorityMonths: 0,
			matchingCalculationMethod: 1,
			matchingDistributionPeriod: 1,
			matchingRules: { pei: matching(), per: matching() },
			voluntaryPaymentsLimitedToPeriod: false,
			voluntaryPaymentPeriodStartDate: null,
			voluntaryPaymentPeriodEndDate: null,
		},
		contractDocuments: [],
	};
}

function formalismFixture(): FormalismInput {
	return {
		legalIdentification: { companyHeadcount: "10" },
		contractCharacteristics: { adhesionTypes: [1] },
		formalism: {
			groups: [
				{
					group: 1,
					method: 3,
					methodInvalidated: false,
					meetingDate: null,
					meetingCity: null,
					closingTime: null,
					votesFor: null,
					votesAgainst: null,
					votesAbstentions: null,
					presidentFirstName: null,
					presidentLastName: null,
					presidentEmail: null,
					mandatedMemberId: null,
					members: [],
				},
			],
			employees: [],
		},
	};
}

test("rounds down and never reports 100 with an outstanding requirement", () => {
	assert.deepEqual(summarizeCompletion([true, true, false]), {
		completed: 2,
		required: 3,
		percentage: 66,
	});
	assert.equal(summarizeCompletion([...Array<boolean>(999).fill(true), false])?.percentage, 99);
	assert.equal(summarizeCompletion([]), null);
});

test("company references exclude optional data and count required documents individually", () => {
	const input = companyFixture();
	const complete = companyReferencesCompletion(input);
	assert.equal(complete?.percentage, 100);
	input.documents[0].status = "pending";
	assert.equal(companyReferencesCompletion(input)?.completed, (complete?.completed ?? 0) - 1);
	input.legalIdentification.siren = "invalid";
	assert.equal(companyReferencesCompletion(input)?.completed, (complete?.completed ?? 0) - 2);
});

test("a different signer adds only the applicable identity fields", () => {
	const input = companyFixture();
	const before = companyReferencesCompletion(input);
	assert.ok(input.representativesAndAuthorizations.signer);
	input.representativesAndAuthorizations.signer.isSignatoryOnKbis = false;
	const after = companyReferencesCompletion(input);
	assert.equal(after?.percentage, 100);
	assert.equal(after?.required, (before?.required ?? 0) + 5);
	input.representativesAndAuthorizations.signer.phoneNumber = null;
	assert.ok((companyReferencesCompletion(input)?.percentage ?? 100) < 100);
});

test("legal entities exclude physical identity and require a separate correspondent", () => {
	const input = companyFixture();
	assert.ok(input.representativesAndAuthorizations.legalAgent);
	Object.assign(input.representativesAndAuthorizations.legalAgent, {
		kind: 2,
		legalName: "Société exemple",
		civility: null,
		firstName: null,
		lastName: null,
		phoneNumber: null,
		isSameAsLegal: null,
	});
	assert.ok((companyReferencesCompletion(input)?.percentage ?? 100) < 100);
	input.representativesAndAuthorizations.correspondent =
		companyFixture().representativesAndAuthorizations.legalAgent;
	assert.equal(companyReferencesCompletion(input)?.percentage, 100);
});

test("each authorized person adds their required fields and authorization choices", () => {
	const input = companyFixture();
	const before = companyReferencesCompletion(input);
	const contact = input.representativesAndAuthorizations.legalAgent;
	assert.ok(contact);
	input.representativesAndAuthorizations.authorizations = [
		{ ...contact, authorizations: [1] },
		{ ...contact, authorizations: [] },
	];
	const after = companyReferencesCompletion(input);
	assert.equal(after?.required, (before?.required ?? 0) + 14);
	assert.equal(after?.completed, (before?.completed ?? 0) + 13);
});

test("saved KYC defaults count without any interaction; missing profile is incomplete", () => {
	const input = kycFixture();
	assert.deepEqual(kycCompletion(input), { completed: 7, required: 7, percentage: 100 });
	input.kyc.profile = null;
	assert.equal(kycCompletion(input)?.percentage, 0);
});

test("a conditional KYC reference lowers completion until saved", () => {
	const input = kycFixture();
	assert.ok(input.kyc.profile);
	input.kyc.profile.regulatedActivity = true;
	assert.deepEqual(kycCompletion(input), { completed: 7, required: 8, percentage: 87 });
	input.kyc.profile.regulatedActivityReference = "Référence";
	assert.equal(kycCompletion(input)?.percentage, 100);
	input.kyc.profile.regulatedActivity = false;
	input.kyc.profile.regulatedActivityReference = null;
	assert.equal(kycCompletion(input)?.required, 7);
});

test("each beneficial owner and identity document counts separately", () => {
	const input = kycFixture();
	input.kyc.owners = [ownerFixture(), { ...ownerFixture(), firstName: null }];
	input.kycDocuments = [{ status: "attached" }, { status: "pending" }];
	const result = kycCompletion(input);
	assert.equal(result?.required, 33);
	assert.equal(result?.completed, 31);
	input.kyc.owners[1].firstName = "Bob";
	input.kycDocuments[1].status = "attached";
	assert.equal(kycCompletion(input)?.percentage, 100);
});

test("shareholder function is optional and zero ownership is valid", () => {
	const input = kycFixture();
	input.kyc.owners = [{ ...ownerFixture(), roles: [4], function: null }];
	assert.equal(kycCompletion(input)?.percentage, 100);
	input.kyc.owners[0].roles = [1];
	assert.ok((kycCompletion(input)?.percentage ?? 100) < 100);
});

test("country breakdown requires countries, percentages and a coherent total", () => {
	const input = kycFixture();
	assert.ok(input.kyc.profile);
	input.kyc.profile.countryOfActivity = "other";
	assert.equal(kycCompletion(input)?.required, 9);
	input.kyc.profile.countryOfActivityBreakdown = [
		{ country: "FR", percentage: 60 },
		{ country: "US", percentage: 40 },
	];
	assert.equal(kycCompletion(input)?.percentage, 100);
	input.kyc.profile.countryOfActivityBreakdown[1].percentage = 20;
	assert.ok((kycCompletion(input)?.percentage ?? 100) < 100);
});

test("contract defaults and zero seniority count, optional transfer amount does not", () => {
	const input = planFixture();
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
	input.contractCharacteristics.existingDeviceTransfer = true;
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
	input.contractCharacteristics.adhesionTypes = [];
	assert.ok((contractCharacteristicsCompletion(input)?.percentage ?? 100) < 100);
});

test("limited payment periods require valid ordered dates", () => {
	const input = planFixture();
	input.contractCharacteristics.voluntaryPaymentsLimitedToPeriod = true;
	assert.equal(contractCharacteristicsCompletion(input)?.required, 8);
	input.contractCharacteristics.voluntaryPaymentPeriodStartDate = "2026-10-05";
	input.contractCharacteristics.voluntaryPaymentPeriodEndDate = "2026-10-04";
	assert.ok((contractCharacteristicsCompletion(input)?.percentage ?? 100) < 100);
	input.contractCharacteristics.voluntaryPaymentPeriodEndDate = "2026-10-06";
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
});

test("active matching rules require payments, rates and limits; hidden rules do not count", () => {
	const input = planFixture();
	const matching = input.contractCharacteristics.matchingRules.pei;
	matching.ruleTypes = [1];
	assert.ok((contractCharacteristicsCompletion(input)?.percentage ?? 100) < 100);
	matching.uniformRules = [{ paymentType: 1, rate: 100, limitKind: 1, limitAmount: 1000 }];
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
	matching.uniformRules[0].rate = 301;
	assert.ok((contractCharacteristicsCompletion(input)?.percentage ?? 100) < 100);
	input.contractCharacteristics.adhesionTypes = [3];
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
});

test("seniority periods must be continuous and the fifth period has no end", () => {
	const input = planFixture();
	const matching = input.contractCharacteristics.matchingRules.pei;
	matching.ruleTypes = [2];
	matching.seniorityRules = [
		{
			paymentType: 1,
			periods: Array.from({ length: 5 }, (_, index) => ({
				fromYears: index,
				toYears: index === 4 ? null : index + 1,
				rate: 100,
				limitKind: 1,
				limitAmount: 1000,
			})),
		},
	];
	assert.equal(contractCharacteristicsCompletion(input)?.percentage, 100);
	matching.seniorityRules[0].periods[1].fromYears = 2;
	assert.ok((contractCharacteristicsCompletion(input)?.percentage ?? 100) < 100);
});

test("zero entry fee is complete, with a known headcount and saved payer", () => {
	const input: Parameters<typeof contractFeesCompletion>[0] = {
		legalIdentification: { companyHeadcount: "10" },
		contractFees: { pricingOffer: 1, entryFeePayer: 1, entryFeeRate: 0 },
	};
	assert.equal(contractFeesCompletion(input)?.percentage, 100);
	input.contractFees.entryFeeRate = 4.51;
	assert.equal(contractFeesCompletion(input)?.percentage, 66);
	assert.equal(
		contractFeesCompletion({ ...input, legalIdentification: { companyHeadcount: null } }),
		null,
	);
});

test("formalism is unavailable until headcount and devices are known", () => {
	const input = formalismFixture();
	input.legalIdentification.companyHeadcount = null;
	assert.equal(formalismCompletion(input), null);
	input.legalIdentification.companyHeadcount = "10";
	input.contractCharacteristics.adhesionTypes = [];
	assert.equal(formalismCompletion(input), null);
});

test("DUE has no additional fields and becomes incomplete when no longer available", () => {
	const input = formalismFixture();
	assert.equal(formalismCompletion(input)?.percentage, 100);
	input.legalIdentification.companyHeadcount = "50";
	assert.equal(formalismCompletion(input)?.percentage, 0);
});

test("ratification requires employees, counts shared employees once and rejects duplicate emails", () => {
	const input = formalismFixture();
	input.formalism.groups[0].method = 2;
	assert.ok((formalismCompletion(input)?.percentage ?? 100) < 100);
	input.formalism.employees = [
		{ id: 1, firstName: "Alice", lastName: "Martin", email: "alice@example.test" },
	];
	assert.equal(formalismCompletion(input)?.percentage, 100);
	input.contractCharacteristics.adhesionTypes = [1, 3];
	input.formalism.groups.push({ ...input.formalism.groups[0], group: 2 });
	assert.equal(formalismCompletion(input)?.required, 5);
	input.formalism.employees.push({
		...input.formalism.employees[0],
		id: 2,
		email: "ALICE@example.test",
	});
	assert.ok((formalismCompletion(input)?.percentage ?? 100) < 100);
});

test("CSE requires a mandated member email and coherent majority votes, including zeroes", () => {
	const input = formalismFixture();
	const group = input.formalism.groups[0];
	Object.assign(group, {
		method: 1,
		meetingDate: "2026-10-05",
		meetingCity: "Paris",
		closingTime: "17:00",
		presidentFirstName: "Alice",
		presidentLastName: "Martin",
		presidentEmail: "alice@example.test",
		votesFor: 1,
		votesAgainst: 0,
		votesAbstentions: 0,
		mandatedMemberId: 1,
	});
	group.members = [
		{
			id: 1,
			firstName: "Bob",
			lastName: "Martin",
			email: "bob@example.test",
			function: 1,
			attending: true,
		},
		{ id: 2, firstName: "Eve", lastName: "Martin", email: null, function: 2, attending: false },
	];
	assert.equal(formalismCompletion(input)?.percentage, 100);
	group.votesAgainst = 1;
	assert.ok((formalismCompletion(input)?.percentage ?? 100) < 100);
	group.votesAgainst = 0;
	group.members[0].email = null;
	assert.ok((formalismCompletion(input)?.percentage ?? 100) < 100);
});
