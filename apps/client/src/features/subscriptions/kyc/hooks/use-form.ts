import type { CompanyBeneficialOwner, CompanyKycProfile } from "@workspace/api/data";

import type { CountryActivity } from "#/features/subscriptions/kyc/components/country-activity-breakdown";
import { useCreateKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-create-owner-mutation";
import { useDeleteKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-delete-owner-mutation";
import { useUpdateKycOwnerMutation } from "#/features/subscriptions/kyc/hooks/use-update-owner-mutation";
import { useUpdateKycProfileMutation } from "#/features/subscriptions/kyc/hooks/use-update-profile-mutation";
import { useAppForm } from "#/libs/form";

export type KycOwnerKind = CompanyBeneficialOwner["kind"];
export type KycOwnerRole = CompanyBeneficialOwner["roles"][number];

export const KYC_OWNER_KIND = {
	PHYSICAL_PERSON: 1,
	LEGAL_ENTITY: 2,
} as const satisfies Record<string, KycOwnerKind>;

export const KYC_OWNER_ROLES = [1, 2, 3, 4] as const satisfies KycOwnerRole[];

export type KycProfileValues = {
	regulatedActivity: boolean;
	regulatedActivityReference: string;
	listedCompany: boolean;
	listedCompanyReference: string;
	bicId: boolean;
	bearerBondsStructure: boolean;
	bearerBondsStructurePercentage: number | null;
	countryOfActivity: NonNullable<CompanyKycProfile["countryOfActivity"]>;
	countryOfActivityBreakdown: CountryActivity[];
	countryOfActivityReference: string;
	countryProvider: NonNullable<CompanyKycProfile["countryProvider"]>;
	countryProviderCountries: string[];
	countryProviderReference: string;
	mainMarkets: NonNullable<CompanyKycProfile["mainMarkets"]>;
	mainMarketsCountries: string[];
	mainMarketsReference: string;
};

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

export type KycValues = {
	kycProfile: KycProfileValues;
	owners: KycOwnerValues[];
};

type UpdateKycProfileRequest = Parameters<
	ReturnType<typeof useUpdateKycProfileMutation>["mutate"]
>[0];
type UpdateKycOwnerRequest = Parameters<ReturnType<typeof useUpdateKycOwnerMutation>["mutate"]>[0];
type KycProfileChanges = UpdateKycProfileRequest["body"]["kycProfile"];
export type KycOwnerChanges = UpdateKycOwnerRequest["body"]["owner"];

export type UseKycFormParams = {
	subscriptionId: string;
	profile: CompanyKycProfile | null;
	owners: CompanyBeneficialOwner[];
};

function getKycProfileValues(profile: CompanyKycProfile | null): KycProfileValues {
	return {
		regulatedActivity: profile?.regulatedActivity ?? false,
		regulatedActivityReference: profile?.regulatedActivityReference ?? "",
		listedCompany: profile?.listedCompany ?? false,
		listedCompanyReference: profile?.listedCompanyReference ?? "",
		bicId: profile?.bicId ?? false,
		bearerBondsStructure: profile?.bearerBondsStructure ?? false,
		bearerBondsStructurePercentage: profile?.bearerBondsStructurePercentage ?? null,
		countryOfActivity: profile?.countryOfActivity ?? "france_and_eu",
		countryOfActivityBreakdown: profile?.countryOfActivityBreakdown ?? [],
		countryOfActivityReference: profile?.countryOfActivityReference ?? "",
		countryProvider: profile?.countryProvider ?? "france_and_eu",
		countryProviderCountries: profile?.countryProviderCountries ?? [],
		countryProviderReference: profile?.countryProviderReference ?? "",
		mainMarkets: profile?.mainMarkets ?? "france_and_eu",
		mainMarketsCountries: profile?.mainMarketsCountries ?? [],
		mainMarketsReference: profile?.mainMarketsReference ?? "",
	};
}

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

export function useKycForm(params: UseKycFormParams) {
	const { subscriptionId, profile, owners } = params;
	const { mutate: createOwner } = useCreateKycOwnerMutation(subscriptionId);
	const { mutate: deleteOwner } = useDeleteKycOwnerMutation(subscriptionId);
	const { mutate: updateOwner } = useUpdateKycOwnerMutation(subscriptionId);
	const { mutate: updateProfile } = useUpdateKycProfileMutation(subscriptionId);

	const form = useAppForm({
		defaultValues: {
			kycProfile: getKycProfileValues(profile),
			owners: owners.map(getKycOwnerValues),
		},
	});

	function updateKycProfile(kycProfile: KycProfileChanges) {
		updateProfile({ body: { kycProfile }, params: { subscriptionId } });
	}

	function createKycOwner() {
		createOwner(
			{ params: { subscriptionId } },
			{
				onSuccess: (owner) => {
					form.setFieldValue("owners", (owners) => [...owners, getKycOwnerValues(owner)]);
				},
			},
		);
	}

	function updateKycOwner(ownerId: string, owner: KycOwnerChanges) {
		updateOwner({ body: { owner }, params: { ownerId, subscriptionId } });
	}

	function deleteKycOwner(ownerId: string) {
		deleteOwner(
			{ params: { ownerId, subscriptionId } },
			{
				onSuccess: () => {
					form.setFieldValue("owners", (owners) => owners.filter((owner) => owner.id !== ownerId));
				},
			},
		);
	}

	return { form, createKycOwner, deleteKycOwner, updateKycOwner, updateKycProfile };
}
