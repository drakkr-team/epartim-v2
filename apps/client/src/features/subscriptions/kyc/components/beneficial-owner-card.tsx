import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Trash2Icon } from "@workspace/ui-react/icons";

import { BeneficialOwnerAddressFields } from "#/features/subscriptions/kyc/components/beneficial-owner-address-fields";
import { BeneficialOwnerIdentityFields } from "#/features/subscriptions/kyc/components/beneficial-owner-identity-fields";
import { BeneficialOwnerKindField } from "#/features/subscriptions/kyc/components/beneficial-owner-kind-field";
import { BeneficialOwnerOwnershipFields } from "#/features/subscriptions/kyc/components/beneficial-owner-ownership-fields";
import {
	KYC_OWNER_ROLES,
	type KycOwnerChanges,
	type KycOwnerValues,
	type useKycForm,
} from "#/features/subscriptions/kyc/hooks/use-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerCardProps = {
	form: ReturnType<typeof useKycForm>["form"];
	index: number;
	onRemove: () => void;
	onUpdate: (changes: KycOwnerChanges) => void;
	owner: KycOwnerValues;
};

export function BeneficialOwnerCard(props: BeneficialOwnerCardProps) {
	const { form, index, onRemove, onUpdate, owner } = props;
	const { t } = useTranslation(namespace);
	const hasShareholder = owner.roles.includes(KYC_OWNER_ROLES[3]);

	return (
		<section
			aria-labelledby={`owner-${index}-heading`}
			className="grid gap-4 rounded-md border border-secondary-3 p-4"
		>
			<div className="flex items-center justify-between gap-4">
				<h4 id={`owner-${index}-heading`} className="font-bold text-secondary-12 text-sm">
					{t("owners.item", { index: index + 1 })}
				</h4>
				<Button
					type="button"
					variant="ghost"
					size="icon-md"
					aria-label={t("owners.remove")}
					onClick={onRemove}
				>
					<Trash2Icon />
				</Button>
			</div>
			<BeneficialOwnerKindField
				form={form}
				index={index}
				onUpdate={onUpdate}
				ownerKind={owner.kind}
			/>
			<BeneficialOwnerIdentityFields
				form={form}
				index={index}
				onUpdate={onUpdate}
				ownerKind={owner.kind}
			/>
			<BeneficialOwnerOwnershipFields
				form={form}
				hasShareholder={hasShareholder}
				index={index}
				onUpdate={onUpdate}
				ownerKind={owner.kind}
				ownerRoles={owner.roles}
			/>
			<BeneficialOwnerAddressFields form={form} index={index} onUpdate={onUpdate} />
		</section>
	);
}
