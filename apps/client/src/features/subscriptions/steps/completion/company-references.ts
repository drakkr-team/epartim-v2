import { isPossiblePhoneNumber } from "react-phone-number-input/input";
import z from "zod";

import type { Contact } from "@workspace/api/data";

import {
	documentCompletion,
	email,
	headcount,
	postalCode,
	type RequiredDocument,
	requiredText,
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";
import { isValidIBAN } from "#/helpers/iban";

type ProgressContact = Pick<
	Contact,
	| "kind"
	| "legalName"
	| "civility"
	| "firstName"
	| "lastName"
	| "email"
	| "phoneNumber"
	| "function"
	| "isSameAsLegal"
	| "isSignatoryOnKbis"
	| "authorizations"
>;
type Company = Pick<
	SubscriptionSnapshot["legalIdentification"],
	"siren" | "siret" | "naf" | "name" | "legalForm" | "companyHeadcount" | "financialYearClosingDay"
>;
export type CompanyReferencesInput = {
	legalIdentification: Company;
	addressAndBankDetails: {
		address: Pick<
			NonNullable<SubscriptionSnapshot["addressAndBankDetails"]["address"]>,
			"lineOne" | "zip" | "city"
		> | null;
		paymentDetail: Pick<
			NonNullable<SubscriptionSnapshot["addressAndBankDetails"]["paymentDetail"]>,
			"iban" | "bic"
		> | null;
	};
	representativesAndAuthorizations: {
		legalAgent: ProgressContact | null;
		signer: ProgressContact | null;
		correspondent: ProgressContact | null;
		authorizations: ProgressContact[];
	};
	documents: RequiredDocument[];
};

function contactFields(contact: ProgressContact | null, includeFunction: boolean) {
	return [
		valid(z.literal([1, 2]), contact?.civility),
		valid(requiredText, contact?.firstName),
		valid(requiredText, contact?.lastName),
		valid(email, contact?.email),
		valid(z.string().trim().min(1).refine(isPossiblePhoneNumber), contact?.phoneNumber),
		...(includeFunction ? [valid(z.number().int().min(1).max(13), contact?.function)] : []),
	];
}

export function companyReferencesCompletion(subscription: CompanyReferencesInput) {
	const company = subscription.legalIdentification;
	const { address, paymentDetail } = subscription.addressAndBankDetails;
	const { legalAgent, signer, correspondent, authorizations } =
		subscription.representativesAndAuthorizations;
	const requirements = [
		valid(
			z
				.string()
				.trim()
				.regex(/^\d{9}$/),
			company.siren,
		),
		valid(
			z
				.string()
				.trim()
				.regex(/^\d{14}$/),
			company.siret,
		),
		valid(
			z
				.string()
				.trim()
				.regex(/^\d{4}[A-Z]$/),
			company.naf,
		),
		valid(requiredText, company.name),
		valid(z.number().int().min(1).max(24), company.legalForm),
		valid(headcount, Number(company.companyHeadcount)),
		valid(
			z
				.string()
				.trim()
				.regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/),
			company.financialYearClosingDay,
		),
		valid(requiredText, address?.lineOne),
		valid(postalCode, address?.zip),
		valid(requiredText, address?.city),
		valid(z.string().trim().min(1).refine(isValidIBAN), paymentDetail?.iban),
		valid(
			z
				.string()
				.trim()
				.toUpperCase()
				.regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/),
			paymentDetail?.bic,
		),
		valid(z.literal([1, 2]), legalAgent?.kind),
		...documentCompletion(subscription.documents),
	];
	if (legalAgent?.kind === 1) {
		requirements.push(
			...contactFields(legalAgent, true),
			valid(z.boolean(), legalAgent.isSameAsLegal),
		);
	} else if (legalAgent?.kind === 2) {
		requirements.push(
			valid(requiredText, legalAgent.legalName),
			valid(email, legalAgent.email),
			valid(z.number().int().min(1).max(13), legalAgent.function),
		);
	}
	if (legalAgent?.kind != null) requirements.push(valid(z.boolean(), signer?.isSignatoryOnKbis));
	if (signer?.isSignatoryOnKbis === false) requirements.push(...contactFields(signer, false));
	if (legalAgent?.kind === 2 || legalAgent?.isSameAsLegal === false)
		requirements.push(...contactFields(correspondent, true));
	for (const authorization of authorizations) {
		requirements.push(
			...contactFields(authorization, true),
			valid(z.array(z.literal([1, 2, 3])).min(1), authorization.authorizations),
		);
	}
	return summarizeCompletion(requirements);
}
