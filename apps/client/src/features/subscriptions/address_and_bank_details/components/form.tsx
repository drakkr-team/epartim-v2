import { useTranslation } from "react-i18next";
import z from "zod";

import type { Address, PaymentDetail } from "@workspace/api/data";

import { useAddressAndBankDetailsForm } from "#/features/subscriptions/address_and_bank_details/hooks/use-form";
import { isValidIBAN } from "#/helpers/iban";

type AddressAndBankDetailsFormProps = {
	subscriptionId: string;
	address: Address | null;
	paymentDetail: PaymentDetail | null;
};

export function AddressAndBankDetailsForm(props: AddressAndBankDetailsFormProps) {
	const { subscriptionId, address, paymentDetail } = props;
	const { t } = useTranslation(
		"features.subscriptions.address_and_bank_details.components.address-and-bank-details-form",
	);
	const { form, updateAddressAndBankDetails } = useAddressAndBankDetailsForm({
		subscriptionId,
		address,
		paymentDetail,
	});
	const addressAndBankDetailsSchema = z.object({
		lineOne: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		lineTwo: z.string().trim().max(254, t("validation.max")),
		zip: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^\d{5}$/, t("validation.zip")),
		city: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		iban: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.refine((value) => value.length === 0 || isValidIBAN(value), t("validation.iban")),
		bic: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.refine(
				(value) =>
					value.length === 0 || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.toUpperCase()),
				t("validation.bic"),
			),
	});

	return (
		<form noValidate className="grid gap-6">
			<section aria-labelledby="address-and-bank-details-heading" className="grid gap-5">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h2
						id="address-and-bank-details-heading"
						className="mt-2 font-bold text-secondary-12 text-xl"
					>
						{t("title")}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{t("description")}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-6">
					<form.AppField
						name="lineOne"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.lineOne }}
						listeners={{
							onBlur: ({ value: lineOne, fieldApi }) => {
								if (lineOne.trim().length === 0) {
									updateAddressAndBankDetails({ address: { lineOne: null } });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ address: { lineOne: lineOne.trim() } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-3">
								<field.TextField
									label={t("field.lineOne.label")}
									required
									inputProps={{ autoComplete: "address-line1", maxLength: 254 }}
								/>
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="lineTwo"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.lineTwo }}
						listeners={{
							onBlur: ({ value: lineTwo, fieldApi }) => {
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ address: { lineTwo: lineTwo.trim() || null } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-3">
								<field.TextField
									label={t("field.lineTwo.label")}
									inputProps={{ autoComplete: "address-line2", maxLength: 254 }}
								/>
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="zip"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.zip }}
						listeners={{
							onBlur: ({ value: zip, fieldApi }) => {
								if (zip.trim().length === 0) {
									updateAddressAndBankDetails({ address: { zip: null } });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ address: { zip: zip.trim() } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-2">
								<field.TextField
									label={t("field.zip.label")}
									required
									inputProps={{ autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 }}
								/>
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="city"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.city }}
						listeners={{
							onBlur: ({ value: city, fieldApi }) => {
								if (city.trim().length === 0) {
									updateAddressAndBankDetails({ address: { city: null } });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ address: { city: city.trim() } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-4">
								<field.TextField
									label={t("field.city.label")}
									required
									inputProps={{ autoComplete: "address-level2", maxLength: 254 }}
								/>
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="iban"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.iban }}
						listeners={{
							onBlur: ({ value: iban, fieldApi }) => {
								if (iban.trim().length === 0) {
									updateAddressAndBankDetails({ paymentDetail: { iban: null } });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ paymentDetail: { iban: iban.trim().toUpperCase() } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-4">
								<field.TextField
									label={t("field.iban.label")}
									required
									inputProps={{ autoComplete: "off" }}
								/>
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="bic"
						validators={{ onBlur: addressAndBankDetailsSchema.shape.bic }}
						listeners={{
							onBlur: ({ value: bic, fieldApi }) => {
								if (bic.trim().length === 0) {
									updateAddressAndBankDetails({ paymentDetail: { bic: null } });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateAddressAndBankDetails({ paymentDetail: { bic: bic.trim().toUpperCase() } });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-2">
								<field.TextField
									label={t("field.bic.label")}
									required
									inputProps={{ autoComplete: "off", maxLength: 11 }}
								/>
							</div>
						)}
					</form.AppField>
				</div>
			</section>
		</form>
	);
}
