import { useTranslation } from "react-i18next";
import z from "zod";

import { SubscriptionPricingOffer } from "@workspace/api/constants/subscription_contract_fee";
import type { routes } from "@workspace/api/registry";
import { Field } from "@workspace/ui-react/components/field";

import { PricingTermsTable } from "#/features/subscriptions/contract_fees/components/pricing-terms-table";
import type { useContractFeesForm } from "#/features/subscriptions/contract_fees/hooks/use-form";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type PricingTermsSectionProps = {
	form: ReturnType<typeof useContractFeesForm>["form"];
	contractFees: Subscription["contractFees"];
};

export function PricingTermsSection({ form, contractFees }: PricingTermsSectionProps) {
	const { t } = useTranslation("features.subscriptions.contract_fees");
	const pricingOfferSchema = z.enum(SubscriptionPricingOffer, {
		error: t("validation.pricingOffer"),
	});

	return (
		<section aria-labelledby="pricing-terms-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("pricing.eyebrow")}
				</p>
				<h2 id="pricing-terms-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("pricing.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("pricing.description")}</p>
			</div>
			<form.AppField
				name="pricingOffer"
				validators={{ onBlur: pricingOfferSchema, onSubmit: pricingOfferSchema }}
			>
				{(field) => {
					const errors = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
					const invalid =
						(field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
						errors !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							aria-invalid={invalid}
							className="grid gap-3"
						>
							<Field.Label id="pricing-offer-label" required>
								{t("pricing.offer")}
							</Field.Label>
							<div
								role="radiogroup"
								aria-labelledby="pricing-offer-label"
								aria-required="true"
								className="grid gap-3 xl:grid-cols-3"
							>
								{Object.values(SubscriptionPricingOffer).map((offer) => (
									<label
										key={offer}
										className={[
											"flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
											field.state.value === offer
												? "border-secondary-10 bg-secondary-2"
												: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
										].join(" ")}
									>
										<input
											type="radio"
											name={field.name}
											value={offer}
											checked={field.state.value === offer}
											required
											aria-invalid={invalid}
											className="mt-0.5 size-4 shrink-0 cursor-pointer accent-secondary-10"
											onBlur={field.handleBlur}
											onChange={() => {
												field.handleChange(offer);
												field.handleBlur();
											}}
										/>
										<span className="font-semibold text-secondary-12 text-xs">
											{t(`pricing.offers.${offer}`)}
										</span>
									</label>
								))}
								<label className="flex min-h-16 cursor-not-allowed items-start gap-3 rounded-sm border border-neutral-4 bg-neutral-2 p-4 text-neutral-9">
									<input
										type="radio"
										name={field.name}
										value="free"
										disabled
										className="mt-0.5 size-4 shrink-0"
									/>
									<span className="grid gap-1 text-xs">
										<span className="font-semibold">{t("pricing.freeOffer")}</span>
										<span>{t("pricing.adminOnly")}</span>
									</span>
								</label>
							</div>
							{invalid &&
								errors?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
			<form.Subscribe selector={(state) => state.values}>
				{({ pricingOffer, entryFeePayer, entryFeeRate }) => (
					<PricingTermsTable
						pricingOffer={pricingOffer}
						entryFeePayer={entryFeePayer}
						entryFeeRate={entryFeeRate}
						contractFees={contractFees}
					/>
				)}
			</form.Subscribe>
		</section>
	);
}
