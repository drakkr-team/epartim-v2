import type { Contact } from "@workspace/api/data";

import { useUpdateRepresentativesAndAuthorizationsMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

export type ContactKind = NonNullable<Contact["kind"]>;
export type ContactCivility = NonNullable<Contact["civility"]>;
export type ContactFunction = NonNullable<Contact["function"]>;
export type ContactAuthorization = NonNullable<Contact["authorizations"]>[number];

export const CONTACT_KIND = {
	PHYSICAL_PERSON: 1,
	LEGAL_ENTITY: 2,
} as const satisfies Record<string, ContactKind>;

export const CONTACT_CIVILITIES = [1, 2] as const satisfies ContactCivility[];

export const CONTACT_FUNCTIONS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
] as const satisfies ContactFunction[];

export const CONTACT_AUTHORIZATIONS = [1, 2, 3] as const satisfies ContactAuthorization[];

export type PersonValues = {
	civility: ContactCivility | null;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	function: ContactFunction | null;
	amundiPortalId: string;
};

export type LegalAgentValues = PersonValues & {
	kind: ContactKind | null;
	legalName: string;
};

export type SignerValues = PersonValues & {
	isSignatoryOnKbis: boolean | null;
};

export type CorrespondentValues = PersonValues & {
	isDifferent: boolean | null;
};

export type AuthorizationValues = PersonValues & {
	key: string;
	authorizations: ContactAuthorization[];
};

export type RepresentativesAndAuthorizationsValues = {
	legalAgent: LegalAgentValues;
	signer: SignerValues;
	correspondent: CorrespondentValues;
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

export function useRepresentativesAndAuthorizationsForm(
	params: UseRepresentativesAndAuthorizationsFormParams,
) {
	const { subscriptionId, representativesAndAuthorizations } = params;
	const { legalAgent, signer, correspondent, authorizations } = representativesAndAuthorizations;
	const { mutate: update } = useUpdateRepresentativesAndAuthorizationsMutation(subscriptionId);

	const form = useAppForm({
		defaultValues: {
			legalAgent: {
				civility: legalAgent?.civility ?? null,
				firstName: legalAgent?.firstName ?? "",
				lastName: legalAgent?.lastName ?? "",
				email: legalAgent?.email ?? "",
				phoneNumber: legalAgent?.phoneNumber ?? "",
				function: legalAgent?.function ?? null,
				amundiPortalId: legalAgent?.amundiPortalId ?? "",
				kind: legalAgent?.kind ?? null,
				legalName: legalAgent?.legalName ?? "",
			},
			signer: {
				civility: signer?.civility ?? null,
				firstName: signer?.firstName ?? "",
				lastName: signer?.lastName ?? "",
				email: signer?.email ?? "",
				phoneNumber: signer?.phoneNumber ?? "",
				function: signer?.function ?? null,
				amundiPortalId: signer?.amundiPortalId ?? "",
				isSignatoryOnKbis: signer?.isSignatoryOnKbis ?? null,
			},
			correspondent: {
				civility: correspondent?.civility ?? null,
				firstName: correspondent?.firstName ?? "",
				lastName: correspondent?.lastName ?? "",
				email: correspondent?.email ?? "",
				phoneNumber: correspondent?.phoneNumber ?? "",
				function: correspondent?.function ?? null,
				amundiPortalId: correspondent?.amundiPortalId ?? "",
				isDifferent:
					legalAgent?.isSameAsLegal === null || legalAgent?.isSameAsLegal === undefined
						? null
						: !legalAgent.isSameAsLegal,
			},
			authorizations: authorizations.map((authorization) => ({
				civility: authorization.civility,
				firstName: authorization.firstName ?? "",
				lastName: authorization.lastName ?? "",
				email: authorization.email ?? "",
				phoneNumber: authorization.phoneNumber ?? "",
				function: authorization.function,
				amundiPortalId: authorization.amundiPortalId ?? "",
				key: String(authorization.id),
				authorizations: authorization.authorizations ?? [],
			})),
		},
	});

	function updateRepresentativesAndAuthorizations(
		representativesAndAuthorizations: RepresentativesAndAuthorizationsChanges,
	) {
		update({
			params: { subscriptionId },
			body: representativesAndAuthorizations,
		});
	}

	return {
		form,
		updateRepresentativesAndAuthorizations,
	};
}
