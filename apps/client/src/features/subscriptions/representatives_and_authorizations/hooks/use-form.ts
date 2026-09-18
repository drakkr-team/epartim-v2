import type { Contact } from "@workspace/api/data";

import { useUpdateAuthorizationsMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-authorizations-mutation";
import { useUpdateCorrespondentMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-correspondent-mutation";
import { useUpdateLegalAgentMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-legal-agent-mutation";
import { useUpdateSignerMutation } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-update-signer-mutation";
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

export type ContactValues = {
	civility: ContactCivility | null;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	function: ContactFunction | null;
	amundiPortalId: string;
};

export type LegalAgentValues = ContactValues & {
	kind: ContactKind | null;
	legalName: string;
};

export type SignerValues = ContactValues & {
	isSignatoryOnKbis: boolean | null;
};

export type CorrespondentValues = ContactValues & {
	isDifferent: boolean | null;
};

export type AuthorizationValues = ContactValues & {
	key: string;
	authorizations: ContactAuthorization[];
};

export type RepresentativesAndAuthorizationsValues = {
	legalAgent: LegalAgentValues;
	signer: SignerValues;
	correspondent: CorrespondentValues;
	authorizations: AuthorizationValues[];
};

type UpdateLegalAgentRequest = Parameters<
	ReturnType<typeof useUpdateLegalAgentMutation>["mutate"]
>[0];
type UpdateSignerRequest = Parameters<ReturnType<typeof useUpdateSignerMutation>["mutate"]>[0];
type UpdateCorrespondentRequest = Parameters<
	ReturnType<typeof useUpdateCorrespondentMutation>["mutate"]
>[0];
type LegalAgentChanges = UpdateLegalAgentRequest["body"];
type SignerChanges = UpdateSignerRequest["body"];
type CorrespondentChanges = UpdateCorrespondentRequest["body"];

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
	const { mutate: updateLegalAgent } = useUpdateLegalAgentMutation(subscriptionId);
	const { mutate: updateSigner } = useUpdateSignerMutation(subscriptionId);
	const { mutate: updateCorrespondent } = useUpdateCorrespondentMutation(subscriptionId);
	const { mutate: updateAuthorizations } = useUpdateAuthorizationsMutation(subscriptionId);

	function updateLegalAgentChanges(legalAgent: LegalAgentChanges) {
		updateLegalAgent({
			params: { subscriptionId },
			body: legalAgent,
		});
	}

	function updateSignerChanges(signer: SignerChanges) {
		updateSigner({ params: { subscriptionId }, body: signer });
	}

	function updateCorrespondentChanges(correspondent: CorrespondentChanges) {
		updateCorrespondent({ params: { subscriptionId }, body: correspondent });
	}

	function updateAuthorizationsChanges(authorizations: AuthorizationValues[]) {
		updateAuthorizations({
			params: { subscriptionId },
			body: {
				authorizations: authorizations.map((authorization) => ({
					civility: authorization.civility,
					firstName: authorization.firstName.trim() || null,
					lastName: authorization.lastName.trim() || null,
					email: authorization.email.trim() || null,
					phoneNumber: authorization.phoneNumber.trim() || null,
					function: authorization.function,
					amundiPortalId: authorization.amundiPortalId.trim() || null,
					authorizations: authorization.authorizations,
				})),
			},
		});
	}

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
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				const { name } = fieldApi;
				const rawValue = fieldApi.state.value;
				const isEmptyText = typeof rawValue === "string" && rawValue.trim().length === 0;

				if (!isEmptyText && !fieldApi.state.meta.isValid) return;

				if (name.startsWith("authorizations[")) {
					updateAuthorizationsChanges(formApi.state.values.authorizations);
					return;
				}

				if (
					name === "legalAgent.kind" ||
					name === "signer.isSignatoryOnKbis" ||
					name === "correspondent.isDifferent"
				) {
					return;
				}

				const value = isEmptyText
					? null
					: typeof rawValue === "string"
						? rawValue.trim()
						: rawValue;

				if (name.startsWith("legalAgent.")) {
					updateLegalAgentChanges({
						[name.slice("legalAgent.".length)]: value,
					} as LegalAgentChanges);
					return;
				}

				if (name.startsWith("signer.")) {
					updateSignerChanges({
						[name.slice("signer.".length)]: value,
					} as SignerChanges);
					return;
				}

				if (name.startsWith("correspondent.")) {
					updateCorrespondentChanges({
						[name.slice("correspondent.".length)]: value,
					} as CorrespondentChanges);
				}
			},
		},
	});

	return {
		form,
		updateLegalAgent: updateLegalAgentChanges,
		updateSigner: updateSignerChanges,
		updateCorrespondent: updateCorrespondentChanges,
		updateAuthorizations: updateAuthorizationsChanges,
	};
}
