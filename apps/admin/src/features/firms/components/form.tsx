import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";

import { NetworkField } from "#/features/firms/components/network-field";
import { type UseFirmFormParams, useFirmForm } from "#/features/firms/hooks/use-form";

type FirmFormProps = UseFirmFormParams;

export function FirmForm(props: FirmFormProps) {
	const { t } = useTranslation("features.firms.components.form");
	const { form, isPending } = useFirmForm(props);

	return (
		<form
			className="grid gap-8"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
		>
			<fieldset className="grid gap-4">
				<legend className="mb-1 font-semibold text-lg text-secondary-12">
					{t("section.general")}
				</legend>
				<div className="grid gap-4 md:grid-cols-2">
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
					<form.AppField name="amundiOrgId">
						{(field) => (
							<field.TextField label={t("field.amundiOrgId.label")} inputProps={{ type: "text" }} />
						)}
					</form.AppField>
				</div>
			</fieldset>

			<fieldset className="grid gap-4 border-neutral-6 border-t pt-6">
				<legend className="font-semibold text-lg text-secondary-12">{t("section.network")}</legend>
				<form.AppField name="networkId">
					{(field) => (
						<NetworkField
							value={field.state.value}
							isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
							errorMessages={field.state.meta.errors.flatMap((error) =>
								error === undefined ? [] : [error.message],
							)}
							onChange={field.handleChange}
							onBlur={field.handleBlur}
						/>
					)}
				</form.AppField>
			</fieldset>

			<fieldset className="grid gap-4 border-neutral-6 border-t pt-6">
				<legend className="font-semibold text-lg text-secondary-12">{t("section.address")}</legend>
				<div className="grid gap-4 md:grid-cols-2">
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
			</fieldset>

			<fieldset className="grid gap-4 border-neutral-6 border-t pt-6">
				<legend className="font-semibold text-lg text-secondary-12">
					{t("section.coordinates")}
				</legend>
				<p className="text-neutral-11 text-sm">{t("section.coordinates-description")}</p>
				<div className="grid gap-4 md:grid-cols-2">
					<form.AppField name="address.coordinates.latitude">
						{(field) => (
							<field.NumberField
								label={t("field.address.coordinates.latitude.label")}
								inputProps={{ min: -90, max: 90, step: 0.000001 }}
							/>
						)}
					</form.AppField>
					<form.AppField name="address.coordinates.longitude">
						{(field) => (
							<field.NumberField
								label={t("field.address.coordinates.longitude.label")}
								inputProps={{ min: -180, max: 180, step: 0.000001 }}
							/>
						)}
					</form.AppField>
				</div>
			</fieldset>

			<fieldset className="grid gap-4 border-neutral-6 border-t pt-6">
				<legend className="font-semibold text-lg text-secondary-12">{t("section.payment")}</legend>
				<div className="grid gap-4 md:grid-cols-2">
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
			</fieldset>

			<div className="flex justify-end gap-2 border-neutral-6 border-t pt-6">
				<Button variant="default" nativeButton={false} render={<a href="/firms" />}>
					{t("action.cancel")}
				</Button>
				<form.AppForm>
					<form.SubmitButton className="text-secondary-12" variant="primary" disabled={isPending}>
						{props.action === "create" ? t("action.create") : t("action.update")}
					</form.SubmitButton>
				</form.AppForm>
			</div>
		</form>
	);
}
