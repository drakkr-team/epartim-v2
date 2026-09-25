import { useTranslation } from "react-i18next";
import z from "zod";

import { Card } from "@workspace/ui-react/components/card";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { HeadphonesIcon, MailIcon } from "@workspace/ui-react/icons";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import type {
	SubscriptionPlanAdhesionType,
	useContractCharacteristicsForm,
} from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const namespace = "features.subscriptions.contract_characteristics";
const adhesionOptions = [
	{ value: 1, label: "peiEpartim" },
	{ value: 2, label: "perColiEpartim" },
	{ value: 3, label: "voluntaryParticipationAgreement" },
] as const;

type DevicesSectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
	updateContractCharacteristics: ReturnType<
		typeof useContractCharacteristicsForm
	>["updateContractCharacteristics"];
};

export function DispositivesSection(props: DevicesSectionProps) {
	const { form, updateContractCharacteristics } = props;
	const { t } = useTranslation(namespace);
	const estimatedTransferAmountSchema = z
		.number({ error: t("validation.estimatedTransferAmount") })
		.positive(t("validation.estimatedTransferAmount"))
		.refine(
			(value) =>
				Number.isSafeInteger(Math.round(value * 100)) &&
				Math.abs(value * 100 - Math.round(value * 100)) <= Number.EPSILON * 100,
			t("validation.estimatedTransferAmount"),
		)
		.nullable();

	function updateExistingDeviceTransfer(value: boolean) {
		form.setFieldValue("existingDeviceTransfer", value);
		if (!value) {
			form.setFieldValue("estimatedTransferAmount", null);
			updateContractCharacteristics({
				existingDeviceTransfer: false,
				estimatedTransferAmount: null,
			});
			return;
		}

		updateContractCharacteristics({ existingDeviceTransfer: true });
	}

	function updateAdhesionTypes(
		type: SubscriptionPlanAdhesionType,
		checked: boolean,
		adhesionTypes: SubscriptionPlanAdhesionType[],
	) {
		const nextAdhesionTypes = checked
			? [...adhesionTypes, type]
			: adhesionTypes.filter((value) => value !== type);
		form.setFieldValue("adhesionTypes", nextAdhesionTypes);
		updateContractCharacteristics({ adhesionTypes: nextAdhesionTypes });
	}

	return (
		<form.Subscribe selector={(state) => state.values}>
			{(contractCharacteristics) => (
				<section aria-labelledby="devices-heading" className="grid gap-6">
					<div className="border-neutral-4 border-b pb-4">
						<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
							{t("devices.eyebrow")}
						</p>
						<h2 id="devices-heading" className="mt-2 font-bold text-secondary-12 text-xl">
							{t("devices.title")}
						</h2>
						<p className="mt-1 text-neutral-11 text-sm">{t("devices.description")}</p>
					</div>

					<div className="grid gap-6">
						<BooleanField
							label={t("field.existingDeviceTransfer")}
							noLabel={t("action.no")}
							onValueChange={updateExistingDeviceTransfer}
							value={contractCharacteristics.existingDeviceTransfer}
							yesLabel={t("action.yes")}
						/>

						{contractCharacteristics.existingDeviceTransfer && (
							<div className="grid gap-5">
								<form.AppField
									name="estimatedTransferAmount"
									validators={{ onBlur: estimatedTransferAmountSchema }}
								>
									{(field) => (
										<field.NumberField
											label={t("field.estimatedTransferAmount")}
											inputProps={{
												locale: "fr-FR",
												min: 0.01,
												step: 0.01,
												format: {
													style: "currency",
													currency: "EUR",
													currencyDisplay: "symbol",
													maximumFractionDigits: 2,
												},
											}}
										/>
									)}
								</form.AppField>

								<Card
									role="note"
									className="grid gap-4 rounded-sm border border-neutral-5 bg-neutral-2 p-5 sm:grid-cols-[auto_1fr]"
								>
									<div className="flex size-9 items-center justify-center rounded-full bg-secondary-12 text-primary-7">
										<HeadphonesIcon aria-hidden="true" className="size-4" />
									</div>
									<div>
										<h3 className="font-bold text-secondary-12 text-sm">
											{t("transferInformation.title")}
										</h3>
										<p className="mt-1 text-neutral-11 text-sm">
											{t("transferInformation.description")}
										</p>
										<a
											href="mailto:admin@epartim.fr"
											className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary-7 px-2 py-1 font-medium text-secondary-12 text-sm"
										>
											<MailIcon aria-hidden="true" className="size-3 text-primary-9" />
											admin@epartim.fr
										</a>
									</div>
								</Card>
							</div>
						)}

						<fieldset className="grid gap-3">
							<legend className="font-bold text-primary-9 text-xs uppercase tracking-widest">
								{t("field.adhesionTypes")}
							</legend>
							<div className="grid gap-3 md:grid-cols-3">
								{adhesionOptions.map((option) => {
									const checked = contractCharacteristics.adhesionTypes.includes(option.value);
									const id = `adhesion-${option.value}`;

									return (
										<label
											key={option.value}
											htmlFor={id}
											className={[
												"flex min-h-24 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
												checked
													? "border-primary-8 bg-primary-2"
													: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
											].join(" ")}
										>
											<Checkbox
												id={id}
												checked={checked}
												onCheckedChange={(value) =>
													updateAdhesionTypes(
														option.value,
														value,
														contractCharacteristics.adhesionTypes,
													)
												}
											/>
											<span className="font-semibold text-secondary-12 text-sm">
												{t(`adhesion.${option.label}`)}
											</span>
										</label>
									);
								})}
							</div>
						</fieldset>
					</div>
				</section>
			)}
		</form.Subscribe>
	);
}
