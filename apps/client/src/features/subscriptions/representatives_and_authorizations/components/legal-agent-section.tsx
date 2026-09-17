import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import { ContactFields } from "#/features/subscriptions/representatives_and_authorizations/components/contact-fields";
import { ContactFunctionField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-function-field";
import {
	CONTACT_KIND,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type LegalAgentSectionProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	onUpdateLegalAgent: ReturnType<
		typeof useRepresentativesAndAuthorizationsForm
	>["updateLegalAgent"];
	onUpdateSigner: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["updateSigner"];
	onUpdateCorrespondent: ReturnType<
		typeof useRepresentativesAndAuthorizationsForm
	>["updateCorrespondent"];
};

export function LegalAgentSection(props: LegalAgentSectionProps) {
	const { form, onUpdateLegalAgent, onUpdateSigner, onUpdateCorrespondent } = props;
	const { t } = useTranslation(translationNamespace);
	const kindOptions = [
		{ value: CONTACT_KIND.PHYSICAL_PERSON, label: t("kind.physical") },
		{ value: CONTACT_KIND.LEGAL_ENTITY, label: t("kind.legalEntity") },
	];
	const legalAgentSchema = {
		kind: z
			.literal([CONTACT_KIND.PHYSICAL_PERSON, CONTACT_KIND.LEGAL_ENTITY], t("validation.required"))
			.nullable()
			.refine((value) => value !== null, t("validation.required")),
		legalName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		email: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.max(254, t("validation.max"))
			.pipe(z.email({ error: t("validation.email") })),
	};
	const requiredBooleanSchema = z
		.boolean()
		.nullable()
		.refine((value) => value !== null, t("validation.required"));

	return (
		<section aria-labelledby="legal-agent-heading" className="grid gap-4">
			<div>
				<h3 id="legal-agent-heading" className="font-bold text-base text-secondary-12">
					{t("legalAgent.title")}
				</h3>
				<p className="mt-1 text-neutral-11 text-sm">{t("legalAgent.description")}</p>
			</div>

			<form.AppField name="legalAgent.kind" validators={{ onBlur: legalAgentSchema.kind }}>
				{(field) => {
					const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
							<Field.Label htmlFor={field.name} required>
								{t("legalAgent.kind")}
							</Field.Label>
							<Select
								items={kindOptions}
								value={field.state.value}
								onValueChange={(kind) => {
									if (kind !== null) {
										field.handleChange(kind);
										form.setFieldValue("legalAgent", (legalAgent) =>
											kind === CONTACT_KIND.LEGAL_ENTITY
												? {
														...legalAgent,
														kind,
														civility: null,
														firstName: "",
														lastName: "",
														phoneNumber: "",
													}
												: { ...legalAgent, kind, legalName: "" },
										);
										if (kind === CONTACT_KIND.LEGAL_ENTITY) {
											form.setFieldValue("correspondent.isDifferent", true);
										}
										onUpdateLegalAgent({ kind });
										field.handleBlur();
									}
								}}
							>
								<Select.Input id={field.name} aria-invalid={invalid} className="w-full">
									<Select.Value placeholder={t("legalAgent.kind")} />
								</Select.Input>
								<Select.Dropdown>
									{kindOptions.map((option) => (
										<Select.Option key={option.value} value={option.value} label={option.label}>
											{option.label}
										</Select.Option>
									))}
								</Select.Dropdown>
							</Select>
							{invalid &&
								field.state.meta.errors
									.flat()
									.filter((error) => error !== undefined)
									.map((error) => <Field.Error key={error.message}>{error.message}</Field.Error>)}
						</Field>
					);
				}}
			</form.AppField>

			<form.Subscribe selector={(state) => state.values.legalAgent.kind}>
				{(legalAgentKind) => (
					<>
						{legalAgentKind === CONTACT_KIND.PHYSICAL_PERSON && (
							<ContactFields
								form={form}
								fields="legalAgent"
								idPrefix="legal-agent"
								onUpdate={onUpdateLegalAgent}
								includeFunction
								phoneRequired
							/>
						)}

						{legalAgentKind === CONTACT_KIND.LEGAL_ENTITY && (
							<div className="grid gap-4 md:grid-cols-6">
								<form.AppField
									name="legalAgent.legalName"
									validators={{ onBlur: legalAgentSchema.legalName }}
									listeners={{
										onBlur: ({ value: legalName, fieldApi }) => {
											if (legalName.trim().length === 0) {
												onUpdateLegalAgent({ legalName: null });
												return;
											}
											if (fieldApi.state.meta.isValid) {
												onUpdateLegalAgent({ legalName: legalName.trim() });
											}
										},
									}}
								>
									{(field) => (
										<div className="md:col-span-3">
											<field.TextField label={t("field.legalName")} required />
										</div>
									)}
								</form.AppField>
								<form.AppField
									name="legalAgent.email"
									validators={{ onBlur: legalAgentSchema.email }}
									listeners={{
										onBlur: ({ value: email, fieldApi }) => {
											if (email.trim().length === 0) {
												onUpdateLegalAgent({ email: null });
												return;
											}
											if (fieldApi.state.meta.isValid) {
												onUpdateLegalAgent({ email: email.trim() });
											}
										},
									}}
								>
									{(field) => (
										<div className="md:col-span-3">
											<field.TextField
												label={t("field.email")}
												required
												inputProps={{ type: "email" }}
											/>
										</div>
									)}
								</form.AppField>
								<ContactFunctionField
									form={form}
									fields={{ function: "legalAgent.function" }}
									id="legal-agent-function"
									onUpdate={onUpdateLegalAgent}
									className="md:col-span-2"
								/>
							</div>
						)}

						{legalAgentKind !== null && (
							<div className="grid gap-4 rounded-md border border-secondary-3 p-4">
								<form.AppField
									name="signer.isSignatoryOnKbis"
									validators={{ onBlur: requiredBooleanSchema }}
								>
									{(field) => {
										const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
										const errorMessages = field.state.meta.errors
											.flat()
											.filter((error) => error !== undefined)
											.map((error) => (typeof error === "string" ? error : error.message));

										return (
											<BooleanField
												errorMessages={errorMessages}
												invalid={invalid}
												label={t("signer.onKbis")}
												noLabel={t("answer.no")}
												onBlur={field.handleBlur}
												onValueChange={(value) => {
													field.handleChange(value);
													onUpdateSigner({ isSignatoryOnKbis: value });
													field.handleBlur();
												}}
												required
												value={field.state.value}
												yesLabel={t("answer.yes")}
											/>
										);
									}}
								</form.AppField>
							</div>
						)}

						{legalAgentKind === CONTACT_KIND.PHYSICAL_PERSON && (
							<div className="grid gap-4 rounded-md border border-secondary-3 p-4">
								<form.AppField
									name="correspondent.isDifferent"
									validators={{ onBlur: requiredBooleanSchema }}
								>
									{(field) => {
										const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
										const errorMessages = field.state.meta.errors
											.flat()
											.filter((error) => error !== undefined)
											.map((error) => (typeof error === "string" ? error : error.message));

										return (
											<BooleanField
												errorMessages={errorMessages}
												invalid={invalid}
												label={t("correspondent.isDifferent")}
												noLabel={t("answer.no")}
												onBlur={field.handleBlur}
												onValueChange={(value) => {
													field.handleChange(value);
													if (!value) {
														form.setFieldValue("correspondent", {
															civility: null,
															firstName: "",
															lastName: "",
															email: "",
															phoneNumber: "",
															function: null,
															amundiPortalId: "",
															isDifferent: false,
														});
													}
													onUpdateCorrespondent({ isSameAsLegal: !value });
													field.handleBlur();
												}}
												required
												value={field.state.value}
												yesLabel={t("answer.yes")}
											/>
										);
									}}
								</form.AppField>
							</div>
						)}
					</>
				)}
			</form.Subscribe>
		</section>
	);
}
