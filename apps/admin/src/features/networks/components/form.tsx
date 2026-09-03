import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Separator } from "@workspace/ui-react/components/separator";

import { type UseNetworkFormParams, useNetworkForm } from "#/features/networks/hooks/use-form";

type NetworkFormProps = UseNetworkFormParams;

export function NetworkForm(props: NetworkFormProps) {
	const { t } = useTranslation("features.networks.components.form");

	const form = useNetworkForm(props);

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

				<div className="col-span-2">
					<form.AppField name="name">
						{(field) => (
							<field.TextField
								required
								label={t("field.name.label")}
								inputProps={{ type: "text", autoComplete: "organization" }}
							/>
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
					<form.Subscribe selector={(state) => state.isDirty}>
						<form.SubmitButton variant="primary" className="flex-1">
							{props.action === "create" ? t("action.create") : t("action.update")}
						</form.SubmitButton>
					</form.Subscribe>
				</form.AppForm>
			</div>
		</form>
	);
}
