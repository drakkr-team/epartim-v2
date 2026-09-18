import type { CompanyBeneficialOwner } from "@workspace/api/data";

import { useCreateKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-create-owner-mutation";
import { useDeleteKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-delete-owner-mutation";
import { useUpdateKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-update-owner-mutation";
import { useAppForm } from "#/libs/form";

export type KycOwnerKind = CompanyBeneficialOwner["kind"];
export type KycOwnerRole = CompanyBeneficialOwner["roles"][number];

export const KYC_OWNER_KIND = {
	PHYSICAL_PERSON: 1,
	LEGAL_ENTITY: 2,
} as const satisfies Record<string, KycOwnerKind>;

export const KYC_OWNER_ROLES = [1, 2, 3, 4] as const satisfies KycOwnerRole[];

export type KycOwnerValues = {
	id: string;
	kind: KycOwnerKind;
	firstName: string;
	lastName: string;
	legalName: string;
	function: string;
	shareholdingPercentage: number | null;
	birthDate: string;
	birthCity: string;
	nationality: string | null;
	roles: KycOwnerRole[];
	address: {
		city: string;
		lineOne: string;
		zip: string;
	};
};

type UpdateKycOwnerRequest = Parameters<ReturnType<typeof useUpdateKycOwnerMutation>["mutate"]>[0];
export type KycOwnerChanges = UpdateKycOwnerRequest["body"]["owner"];

type UseKycOwnersFormParams = {
	subscriptionId: string;
	owners: CompanyBeneficialOwner[];
};

function getKycOwnerValues(owner: CompanyBeneficialOwner): KycOwnerValues {
	return {
		id: String(owner.id),
		kind: owner.kind,
		firstName: owner.firstName ?? "",
		lastName: owner.lastName ?? "",
		legalName: owner.legalName ?? "",
		function: owner.function ?? "",
		shareholdingPercentage: owner.shareholdingPercentage,
		birthDate: owner.birthDate ?? "",
		birthCity: owner.birthCity ?? "",
		nationality: owner.nationality,
		roles: owner.roles,
		address: {
			city: owner.address.city ?? "",
			lineOne: owner.address.lineOne ?? "",
			zip: owner.address.zip ?? "",
		},
	};
}

export function useKycOwnersForm(params: UseKycOwnersFormParams) {
	const { subscriptionId, owners } = params;
	const { mutate: createOwner } = useCreateKycOwnerMutation(subscriptionId);
	const { mutate: deleteOwner } = useDeleteKycOwnerMutation(subscriptionId);
	const { mutate: updateOwner } = useUpdateKycOwnerMutation(subscriptionId);

	function updateKycOwner(ownerId: string, owner: KycOwnerChanges, onSuccess?: () => void) {
		updateOwner({ body: { owner }, params: { ownerId, subscriptionId } }, { onSuccess });
	}

	const form = useAppForm({
		defaultValues: { owners: owners.map(getKycOwnerValues) },
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				if (!fieldApi.state.meta.isDirty || !fieldApi.state.meta.isValid) return;

				const ownerField = fieldApi.name.match(/^owners\[(\d+)\]\.(.+)$/);
				if (!ownerField) return;

				const rawValue = fieldApi.state.value;
				const value = typeof rawValue === "string" ? rawValue.trim() || null : rawValue;
				const markFieldAsSaved = () => {
					if (Object.is(fieldApi.state.value, rawValue)) {
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
					}
				};
				const [, ownerIndex, property] = ownerField;
				const owner = formApi.state.values.owners[Number(ownerIndex)];
				if (!owner) return;

				const changes = property.startsWith("address.")
					? { address: { [property.slice("address.".length)]: value } }
					: { [property]: value };

				updateKycOwner(owner.id, changes as KycOwnerChanges, markFieldAsSaved);
			},
		},
	});

	function createKycOwner() {
		createOwner(
			{ params: { subscriptionId } },
			{
				onSuccess: (owner) => {
					form.setFieldValue("owners", (currentOwners) => [
						...currentOwners,
						getKycOwnerValues(owner),
					]);
				},
			},
		);
	}

	function deleteKycOwner(ownerId: string) {
		deleteOwner(
			{ params: { ownerId, subscriptionId } },
			{
				onSuccess: () => {
					form.setFieldValue("owners", (currentOwners) =>
						currentOwners.filter((owner) => owner.id !== ownerId),
					);
				},
			},
		);
	}

	return { form, createKycOwner, deleteKycOwner, updateKycOwner };
}
