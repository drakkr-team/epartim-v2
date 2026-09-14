import type { Contact } from "@workspace/api/data";

import { useUpdateRepresentativesAndAuthorizationsMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type ContactKind = NonNullable<Contact["kind"]>;
type ContactCivility = NonNullable<Contact["civility"]>;
type ContactFunction = NonNullable<Contact["function"]>;
type ContactAuthorization = NonNullable<Contact["authorizations"]>[number];

export const CONTACT_KIND = {
	PHYSICAL_PERSON: 1,
	LEGAL_ENTITY: 2,
} as const satisfies Record<string, ContactKind>;

export const CONTACT_CIVILITIES = [1, 2] as const satisfies ContactCivility[];

export const CONTACT_FUNCTIONS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
] as const satisfies ContactFunction[];

export const CONTACT_AUTHORIZATIONS = [1, 2, 3] as const satisfies ContactAuthorization[];

export type AuthorizationValues = {
	key: string;
	civility: ContactCivility | null;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	function: ContactFunction | null;
	amundiPortalId: string;
	authorizations: ContactAuthorization[];
};

export type RepresentativesAndAuthorizationsValues = {
	legalAgentKind: ContactKind | null;
	legalAgentCivility: ContactCivility | null;
	legalAgentFirstName: string;
	legalAgentLastName: string;
	legalAgentLegalName: string;
	legalAgentEmail: string;
	legalAgentPhoneNumber: string;
	legalAgentFunction: ContactFunction | null;
	signerCivility: ContactCivility | null;
	signerFirstName: string;
	signerLastName: string;
	signerEmail: string;
	signerPhoneNumber: string;
	signerOnKbis: boolean | null;
	correspondentIsDifferent: boolean | null;
	correspondentCivility: ContactCivility | null;
	correspondentFirstName: string;
	correspondentLastName: string;
	correspondentEmail: string;
	correspondentPhoneNumber: string;
	correspondentFunction: ContactFunction | null;
	correspondentAmundiPortalId: string;
	authorizations: AuthorizationValues[];
};

type UpdateRepresentativesAndAuthorizationsRequest = Parameters<
	ReturnType<typeof useUpdateRepresentativesAndAuthorizationsMutation>["mutate"]
>[0];

type RepresentativesAndAuthorizationsChanges =
	UpdateRepresentativesAndAuthorizationsRequest["body"];

export type RepresentativesAndAuthorizations = {
	legalAgent: Contact | null;
	signer: Contact | null;
	correspondent: Contact | null;
	authorizations: Contact[];
};

export type UseRepresentativesAndAuthorizationsFormParams = {
	subscriptionId: string;
	representativesAndAuthorizations: RepresentativesAndAuthorizations;
};

function toNullable(value: string) {
	return value.trim() || null;
}

function hasValues(values: Record<string, unknown>) {
	return Object.values(values).some(
		(value) => value !== null && value !== "" && value !== undefined,
	);
}

function authorizationValues(contact: Contact): AuthorizationValues {
	return {
		key: String(contact.id),
		civility: contact.civility,
		firstName: contact.firstName ?? "",
		lastName: contact.lastName ?? "",
		email: contact.email ?? "",
		phoneNumber: contact.phoneNumber ?? "",
		function: contact.function,
		amundiPortalId: contact.amundiPortalId ?? "",
		authorizations: contact.authorizations ?? [],
	};
}

function toPayload(values: RepresentativesAndAuthorizationsValues) {
	const legalAgent =
		values.legalAgentKind === null
			? undefined
			: {
					kind: values.legalAgentKind,
					civility: values.legalAgentCivility,
					firstName: toNullable(values.legalAgentFirstName),
					lastName: toNullable(values.legalAgentLastName),
					legalName: toNullable(values.legalAgentLegalName),
					email: toNullable(values.legalAgentEmail),
					phoneNumber: toNullable(values.legalAgentPhoneNumber),
					function: values.legalAgentFunction,
				};
	const signer = {
		civility: values.signerCivility,
		firstName: toNullable(values.signerFirstName),
		lastName: toNullable(values.signerLastName),
		email: toNullable(values.signerEmail),
		phoneNumber: toNullable(values.signerPhoneNumber),
		isSignatoryOnKbis: values.signerOnKbis,
	};
	const correspondent = {
		civility: values.correspondentCivility,
		firstName: toNullable(values.correspondentFirstName),
		lastName: toNullable(values.correspondentLastName),
		email: toNullable(values.correspondentEmail),
		phoneNumber: toNullable(values.correspondentPhoneNumber),
		function: values.correspondentFunction,
		amundiPortalId: toNullable(values.correspondentAmundiPortalId),
		isSameAsLegal:
			values.correspondentIsDifferent === null ? null : !values.correspondentIsDifferent,
	};

	return {
		...(legalAgent ? { legalAgent } : {}),
		...(hasValues(signer) ? { signer } : {}),
		...(values.correspondentIsDifferent !== null || hasValues(correspondent)
			? { correspondent }
			: {}),
		authorizations: values.authorizations.map((authorization) => ({
			civility: authorization.civility,
			firstName: toNullable(authorization.firstName),
			lastName: toNullable(authorization.lastName),
			email: toNullable(authorization.email),
			phoneNumber: toNullable(authorization.phoneNumber),
			function: authorization.function,
			amundiPortalId: toNullable(authorization.amundiPortalId),
			authorizations: authorization.authorizations,
		})),
	} satisfies RepresentativesAndAuthorizationsChanges;
}

export function useRepresentativesAndAuthorizationsForm(
	params: UseRepresentativesAndAuthorizationsFormParams,
) {
	const { subscriptionId, representativesAndAuthorizations } = params;
	const { legalAgent, signer, correspondent, authorizations } = representativesAndAuthorizations;
	const { mutate: update } = useUpdateRepresentativesAndAuthorizationsMutation(subscriptionId);

	const form = useAppForm({
		defaultValues: {
			legalAgentKind: legalAgent?.kind ?? null,
			legalAgentCivility: legalAgent?.civility ?? null,
			legalAgentFirstName: legalAgent?.firstName ?? "",
			legalAgentLastName: legalAgent?.lastName ?? "",
			legalAgentLegalName: legalAgent?.legalName ?? "",
			legalAgentEmail: legalAgent?.email ?? "",
			legalAgentPhoneNumber: legalAgent?.phoneNumber ?? "",
			legalAgentFunction: legalAgent?.function ?? null,
			signerCivility: signer?.civility ?? null,
			signerFirstName: signer?.firstName ?? "",
			signerLastName: signer?.lastName ?? "",
			signerEmail: signer?.email ?? "",
			signerPhoneNumber: signer?.phoneNumber ?? "",
			signerOnKbis: signer?.isSignatoryOnKbis ?? null,
			correspondentIsDifferent:
				legalAgent?.isSameAsLegal === null || legalAgent?.isSameAsLegal === undefined
					? null
					: !legalAgent.isSameAsLegal,
			correspondentCivility: correspondent?.civility ?? null,
			correspondentFirstName: correspondent?.firstName ?? "",
			correspondentLastName: correspondent?.lastName ?? "",
			correspondentEmail: correspondent?.email ?? "",
			correspondentPhoneNumber: correspondent?.phoneNumber ?? "",
			correspondentFunction: correspondent?.function ?? null,
			correspondentAmundiPortalId: correspondent?.amundiPortalId ?? "",
			authorizations: authorizations.map(authorizationValues),
		},
	});

	function save() {
		update({
			params: { subscriptionId },
			body: toPayload(form.state.values),
		});
	}

	function setLegalAgentKind(kind: ContactKind) {
		form.setFieldValue("legalAgentKind", kind);

		if (kind === CONTACT_KIND.LEGAL_ENTITY) {
			form.setFieldValue("legalAgentCivility", null);
			form.setFieldValue("legalAgentFirstName", "");
			form.setFieldValue("legalAgentLastName", "");
			form.setFieldValue("legalAgentPhoneNumber", "");
			form.setFieldValue("correspondentIsDifferent", true);
		} else {
			form.setFieldValue("legalAgentLegalName", "");
		}

		queueMicrotask(save);
	}

	function setCorrespondentIsDifferent(isDifferent: boolean) {
		form.setFieldValue("correspondentIsDifferent", isDifferent);

		if (!isDifferent) {
			form.setFieldValue("correspondentCivility", null);
			form.setFieldValue("correspondentFirstName", "");
			form.setFieldValue("correspondentLastName", "");
			form.setFieldValue("correspondentEmail", "");
			form.setFieldValue("correspondentPhoneNumber", "");
			form.setFieldValue("correspondentFunction", null);
			form.setFieldValue("correspondentAmundiPortalId", "");
		}

		queueMicrotask(save);
	}

	function setSignerOnKbis(isSignerOnKbis: boolean) {
		form.setFieldValue("signerOnKbis", isSignerOnKbis);
		queueMicrotask(save);
	}

	function addAuthorization() {
		form.setFieldValue("authorizations", (authorizations) => [
			...authorizations,
			{
				key: crypto.randomUUID(),
				civility: null,
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				function: null,
				amundiPortalId: "",
				authorizations: [],
			},
		]);
		queueMicrotask(save);
	}

	function removeAuthorization(index: number) {
		form.setFieldValue("authorizations", (authorizations) =>
			authorizations.filter((_, authorizationIndex) => authorizationIndex !== index),
		);
		queueMicrotask(save);
	}

	function updateAuthorization(index: number, changes: Partial<AuthorizationValues>) {
		form.setFieldValue("authorizations", (authorizations) =>
			authorizations.map((authorization, authorizationIndex) =>
				authorizationIndex === index ? { ...authorization, ...changes } : authorization,
			),
		);
	}

	return {
		form,
		save,
		setLegalAgentKind,
		setCorrespondentIsDifferent,
		setSignerOnKbis,
		addAuthorization,
		removeAuthorization,
		updateAuthorization,
	};
}
