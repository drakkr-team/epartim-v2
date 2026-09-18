import type { CompanyKycProfile } from "@workspace/api/data";

import type { CountryActivity } from "#/features/subscriptions/kyc/components/country-activity-breakdown";
import { useUpdateKycProfileMutation } from "#/features/subscriptions/kyc/hooks/use-update-profile-mutation";
import { useAppForm } from "#/libs/form";

type UpdateKycProfileRequest = Parameters<
	ReturnType<typeof useUpdateKycProfileMutation>["mutate"]
>[0];
type KycProfileChanges = UpdateKycProfileRequest["body"]["kycProfile"];

type UseKycProfileFormParams = {
	subscriptionId: string;
	profile: CompanyKycProfile | null;
};

export function useKycProfileForm(params: UseKycProfileFormParams) {
	const { subscriptionId, profile } = params;
	const { mutate: updateProfile } = useUpdateKycProfileMutation(subscriptionId);

	function updateKycProfile(kycProfile: KycProfileChanges, onSuccess?: () => void) {
		updateProfile({ body: { kycProfile }, params: { subscriptionId } }, { onSuccess });
	}

	const form = useAppForm({
		defaultValues: {
			regulatedActivity: profile?.regulatedActivity ?? false,
			regulatedActivityReference: profile?.regulatedActivityReference ?? "",
			listedCompany: profile?.listedCompany ?? false,
			listedCompanyReference: profile?.listedCompanyReference ?? "",
			bicId: profile?.bicId ?? false,
			bearerBondsStructure: profile?.bearerBondsStructure ?? false,
			bearerBondsStructurePercentage: profile?.bearerBondsStructurePercentage ?? null,
			countryOfActivity: profile?.countryOfActivity ?? "france_and_eu",
			countryOfActivityBreakdown: (profile?.countryOfActivityBreakdown ?? []) as CountryActivity[],
			countryOfActivityReference: profile?.countryOfActivityReference ?? "",
			countryProvider: profile?.countryProvider ?? "france_and_eu",
			countryProviderCountries: profile?.countryProviderCountries ?? [],
			countryProviderReference: profile?.countryProviderReference ?? "",
			mainMarkets: profile?.mainMarkets ?? "france_and_eu",
			mainMarketsCountries: profile?.mainMarketsCountries ?? [],
			mainMarketsReference: profile?.mainMarketsReference ?? "",
		},
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				if (!fieldApi.state.meta.isDirty || !fieldApi.state.meta.isValid) return;

				const rawValue = fieldApi.state.value;
				const value = typeof rawValue === "string" ? rawValue.trim() || null : rawValue;
				const markFieldAsSaved = () => {
					if (Object.is(fieldApi.state.value, rawValue)) {
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
					}
				};

				if (
					fieldApi.name === "countryOfActivity" ||
					fieldApi.name === "countryProvider" ||
					fieldApi.name === "mainMarkets"
				) {
					if (value === "other") {
						updateKycProfile({ [fieldApi.name]: value } as KycProfileChanges, markFieldAsSaved);
						return;
					}

					if (fieldApi.name === "countryOfActivity") {
						formApi.setFieldValue("countryOfActivityBreakdown", []);
						formApi.setFieldValue("countryOfActivityReference", "");
						updateKycProfile(
							{
								countryOfActivity: value as NonNullable<CompanyKycProfile["countryOfActivity"]>,
								countryOfActivityBreakdown: null,
								countryOfActivityReference: null,
							},
							markFieldAsSaved,
						);
						return;
					}

					if (fieldApi.name === "countryProvider") {
						formApi.setFieldValue("countryProviderCountries", []);
						formApi.setFieldValue("countryProviderReference", "");
						updateKycProfile(
							{
								countryProvider: value as NonNullable<CompanyKycProfile["countryProvider"]>,
								countryProviderCountries: null,
								countryProviderReference: null,
							},
							markFieldAsSaved,
						);
						return;
					}

					formApi.setFieldValue("mainMarketsCountries", []);
					formApi.setFieldValue("mainMarketsReference", "");
					updateKycProfile(
						{
							mainMarkets: value as NonNullable<CompanyKycProfile["mainMarkets"]>,
							mainMarketsCountries: null,
							mainMarketsReference: null,
						},
						markFieldAsSaved,
					);
					return;
				}

				if (fieldApi.name === "countryOfActivityBreakdown") {
					formApi.setFieldValue("countryOfActivityReference", "");
				}

				const profileValue =
					fieldApi.name === "countryProviderCountries" || fieldApi.name === "mainMarketsCountries"
						? Array.isArray(value) && value.length === 0
							? null
							: value
						: value;

				updateKycProfile({ [fieldApi.name]: profileValue } as KycProfileChanges, markFieldAsSaved);
			},
		},
	});

	return { form, updateKycProfile };
}
