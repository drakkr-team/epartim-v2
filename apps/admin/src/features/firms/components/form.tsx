import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Network } from "@workspace/api/data";
import { Button } from "@workspace/ui-react/components/button";
import { Separator } from "@workspace/ui-react/components/separator";

import { type UseFirmFormParams, useFirmForm } from "#/features/firms/hooks/use-form";
import { NetworkCombobox } from "#/features/networks/components/combobox.tsx";

type FirmFormProps = UseFirmFormParams & {
	defaultValues?: {
		network: Network;
	};
};

export function FirmForm(props: FirmFormProps) {
	const { t } = useTranslation("features.firms.components.form");

	const form = useFirmForm(props);

	return (
		<form
			className="grid gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
		>
			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.general")}
				</h2>

				<form.AppField name="name">
					{(field) => (
						<field.TextField
							required
							label={t("field.name.label")}
							inputProps={{ type: "text", autoComplete: "organization" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="orias">
					{(field) => (
						<field.TextField
							required
							label={t("field.orias.label")}
							inputProps={{ type: "text", inputMode: "numeric" }}
						/>
					)}
				</form.AppField>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.network")}
				</h2>

				<div className="col-span-2">
					<form.AppField name="networkId">
						{(field) => (
							<field.GenericField>
								<NetworkCombobox
									defaultValue={props.defaultValues?.network}
									onValueChange={(value) =>
										field.handleChange(value === null ? null : Number(value.id))
									}
									onOpenChangeComplete={(open) => !open && field.handleBlur()}
								/>
							</field.GenericField>
						)}
					</form.AppField>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.address")}
				</h2>

				<form.AppField name="address.lineOne">
					{(field) => (
						<field.TextField
							required
							label={t("field.address.lineOne.label")}
							inputProps={{ type: "text", autoComplete: "address-line1" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="address.lineTwo">
					{(field) => (
						<field.TextField
							label={t("field.address.lineTwo.label")}
							inputProps={{ type: "text", autoComplete: "address-line2" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="address.zip">
					{(field) => (
						<field.TextField
							required
							label={t("field.address.zip.label")}
							inputProps={{ type: "text", autoComplete: "postal-code" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="address.city">
					{(field) => (
						<field.TextField
							required
							label={t("field.address.city.label")}
							inputProps={{ type: "text", autoComplete: "address-level2" }}
						/>
					)}
				</form.AppField>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.payment")}
				</h2>

				<form.AppField name="paymentDetail.iban">
					{(field) => (
						<field.TextField
							required
							label={t("field.paymentDetail.iban.label")}
							inputProps={{ type: "text", autoComplete: "off" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="paymentDetail.bic">
					{(field) => (
						<field.TextField
							required
							label={t("field.paymentDetail.bic.label")}
							inputProps={{ type: "text", autoComplete: "off" }}
						/>
					)}
				</form.AppField>
			</div>

			<div className="mt-2 flex justify-end gap-2">
				<Button variant="default" nativeButton={false} render={<Link to=".." />}>
					{t("action.cancel")}
				</Button>

				<form.AppForm>
					<form.SubmitButton variant="primary" className="flex-1">
						{props.action === "create" ? t("action.create") : t("action.update")}
					</form.SubmitButton>
				</form.AppForm>
			</div>
		</form>
	);
}
