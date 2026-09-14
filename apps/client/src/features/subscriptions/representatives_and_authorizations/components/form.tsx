import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Field } from "@workspace/ui-react/components/field";
import { Input } from "@workspace/ui-react/components/input";
import { Select } from "@workspace/ui-react/components/select";
import { PlusIcon, Trash2Icon } from "@workspace/ui-react/icons";

import {
	type AuthorizationValues,
	CONTACT_AUTHORIZATIONS,
	CONTACT_CIVILITIES,
	CONTACT_FUNCTIONS,
	CONTACT_KIND,
	type RepresentativesAndAuthorizations,
	type RepresentativesAndAuthorizationsValues,
	useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

type RepresentativesAndAuthorizationsFormProps = {
	subscriptionId: string;
	representativesAndAuthorizations: RepresentativesAndAuthorizations;
};

type PersonValues = Omit<AuthorizationValues, "authorizations">;

type ChoiceOption<T extends boolean | number> = {
	value: T;
	label: string;
};

function ChoiceGroup<T extends boolean | number>(props: {
	label: string;
	value: T | null;
	options: ChoiceOption<T>[];
	onValueChange: (value: T) => void;
	required?: boolean;
}) {
	const { label, value, options, onValueChange, required } = props;

	return (
		<Field className="flex flex-col gap-2">
			<Field.Label required={required}>{label}</Field.Label>
			<div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
				{options.map((option) => (
					<Button
						key={String(option.value)}
						type="button"
						role="radio"
						aria-checked={value === option.value}
						variant={value === option.value ? "primary" : "default"}
						onClick={() => onValueChange(option.value)}
					>
						{option.label}
					</Button>
				))}
			</div>
		</Field>
	);
}

function ContactFunctionSelect(props: {
	id: string;
	label: string;
	value: AuthorizationValues["function"];
	onValueChange: (value: AuthorizationValues["function"]) => void;
	onBlur: () => void;
	required?: boolean;
}) {
	const { id, label, value, onValueChange, onBlur, required } = props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);
	const options = CONTACT_FUNCTIONS.map((functionValue) => ({
		value: functionValue,
		label: String(t(`function.${functionValue}` as never)),
	}));

	return (
		<Field name={id} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Select
				items={options}
				value={value}
				onValueChange={onValueChange}
				onOpenChange={(open) => {
					if (!open) onBlur();
				}}
			>
				<Select.Input id={id} className="w-full">
					<Select.Value placeholder={label} />
				</Select.Input>
				<Select.Dropdown>
					{options.map((option) => (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					))}
				</Select.Dropdown>
			</Select>
		</Field>
	);
}

function CivilitySelect(props: {
	id: string;
	label: string;
	value: AuthorizationValues["civility"];
	onValueChange: (value: AuthorizationValues["civility"]) => void;
	onBlur: () => void;
	required?: boolean;
}) {
	const { id, label, value, onValueChange, onBlur, required } = props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);
	const options = CONTACT_CIVILITIES.map((civility) => ({
		value: civility,
		label: String(t(`civility.${civility}` as never)),
	}));

	return (
		<Field name={id} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Select
				items={options}
				value={value}
				onValueChange={(civility) => {
					if (civility !== null) {
						onValueChange(civility);
						queueMicrotask(onBlur);
					}
				}}
			>
				<Select.Input id={id} className="w-full">
					<Select.Value placeholder={label} />
				</Select.Input>
				<Select.Dropdown>
					{options.map((option) => (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					))}
				</Select.Dropdown>
			</Select>
		</Field>
	);
}

function PersonFields(props: {
	idPrefix: string;
	value: PersonValues;
	onChange: (changes: Partial<PersonValues>) => void;
	onBlur: () => void;
	includeFunction?: boolean;
	includePortalId?: boolean;
	phoneRequired?: boolean;
}) {
	const { idPrefix, value, onChange, onBlur, includeFunction, includePortalId, phoneRequired } =
		props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);

	return (
		<div className="grid gap-4 md:grid-cols-6">
			<div className="md:col-span-2">
				<CivilitySelect
					id={`${idPrefix}-civility`}
					label={t("field.civility")}
					value={value.civility}
					required
					onValueChange={(civility) => onChange({ civility })}
					onBlur={onBlur}
				/>
			</div>

			<TextInput
				id={`${idPrefix}-first-name`}
				label={t("field.firstName")}
				value={value.firstName}
				onChange={(firstName) => onChange({ firstName })}
				onBlur={onBlur}
				required
				className="md:col-span-2"
			/>
			<TextInput
				id={`${idPrefix}-last-name`}
				label={t("field.lastName")}
				value={value.lastName}
				onChange={(lastName) => onChange({ lastName })}
				onBlur={onBlur}
				required
				className="md:col-span-2"
			/>
			<TextInput
				id={`${idPrefix}-email`}
				label={t("field.email")}
				value={value.email}
				onChange={(email) => onChange({ email })}
				onBlur={onBlur}
				type="email"
				required
				className="md:col-span-3"
			/>
			<TextInput
				id={`${idPrefix}-phone`}
				label={t("field.phoneNumber")}
				value={value.phoneNumber}
				onChange={(phoneNumber) => onChange({ phoneNumber })}
				onBlur={onBlur}
				type="tel"
				placeholder="+33612345678"
				required={phoneRequired}
				className="md:col-span-3"
			/>

			{includeFunction && (
				<div className="md:col-span-3">
					<ContactFunctionSelect
						id={`${idPrefix}-function`}
						label={t("field.function")}
						value={value.function}
						required
						onValueChange={(functionValue) => onChange({ function: functionValue })}
						onBlur={onBlur}
					/>
				</div>
			)}

			{includePortalId && (
				<TextInput
					id={`${idPrefix}-portal-id`}
					label={t("field.amundiPortalId")}
					value={value.amundiPortalId}
					onChange={(amundiPortalId) => onChange({ amundiPortalId })}
					onBlur={onBlur}
					className="md:col-span-3"
				/>
			)}
		</div>
	);
}

function TextInput(props: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
	type?: "email" | "tel" | "text";
	placeholder?: string;
	required?: boolean;
	className?: string;
}) {
	const {
		id,
		label,
		value,
		onChange,
		onBlur,
		type = "text",
		placeholder,
		required,
		className,
	} = props;

	return (
		<Field name={id} className={`flex flex-col gap-2${className ? ` ${className}` : ""}`}>
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Input
				id={id}
				type={type}
				value={value}
				placeholder={placeholder}
				required={required}
				onChange={(event) => onChange(event.target.value)}
				onBlur={onBlur}
			/>
		</Field>
	);
}

function AuthorizationCard(props: {
	index: number;
	value: AuthorizationValues;
	onChange: (changes: Partial<AuthorizationValues>) => void;
	onBlur: () => void;
	onRemove: () => void;
}) {
	const { index, value, onChange, onBlur, onRemove } = props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);
	const authorizationOptions = CONTACT_AUTHORIZATIONS.map((authorization) => ({
		value: authorization,
		label: String(t(`authorization.${authorization}` as never)),
	}));

	return (
		<section
			aria-labelledby={`authorization-${index}-heading`}
			className="grid gap-4 rounded-md border border-primary-3 bg-primary-2 p-4"
		>
			<div className="flex items-center justify-between gap-4">
				<h4 id={`authorization-${index}-heading`} className="font-bold text-secondary-12 text-sm">
					{t("authorizations.item", { index: index + 1 })}
				</h4>
				<Button
					type="button"
					variant="ghost"
					size="icon-md"
					aria-label={t("authorizations.remove")}
					onClick={onRemove}
				>
					<Trash2Icon />
				</Button>
			</div>

			<PersonFields
				idPrefix={`authorization-${index}`}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				includeFunction
				includePortalId
			/>

			<Field className="flex flex-col gap-3">
				<Field.Label required>{t("authorizations.rights")}</Field.Label>
				<div className="flex flex-wrap gap-3">
					{authorizationOptions.map((option) => {
						const checked = value.authorizations.includes(option.value);

						return (
							<Button
								key={option.value}
								type="button"
								variant={checked ? "secondary" : "default"}
								className={`rounded-full px-4${checked ? "" : "text-secondary-11"}`}
								aria-pressed={checked}
								onClick={() => {
									onChange({
										authorizations: checked
											? value.authorizations.filter(
													(authorization) => authorization !== option.value,
												)
											: [...value.authorizations, option.value],
									});
									queueMicrotask(onBlur);
								}}
							>
								{option.label}
							</Button>
						);
					})}
				</div>
			</Field>
		</section>
	);
}

export function RepresentativesAndAuthorizationsForm(
	props: RepresentativesAndAuthorizationsFormProps,
) {
	const { subscriptionId, representativesAndAuthorizations } = props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);
	const {
		form,
		save,
		setLegalAgentKind,
		setCorrespondentIsDifferent,
		setSignerOnKbis,
		addAuthorization,
		removeAuthorization,
		updateAuthorization,
	} = useRepresentativesAndAuthorizationsForm({
		subscriptionId,
		representativesAndAuthorizations,
	});

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<section aria-labelledby="representatives-and-authorizations-heading" className="grid gap-6">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h2
						id="representatives-and-authorizations-heading"
						className="mt-2 font-bold text-secondary-12 text-xl"
					>
						{t("title")}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{t("description")}</p>
				</div>

				<form.Subscribe selector={(state) => state.values}>
					{(values: RepresentativesAndAuthorizationsValues) => {
						const isPhysicalPerson = values.legalAgentKind === CONTACT_KIND.PHYSICAL_PERSON;
						const isLegalEntity = values.legalAgentKind === CONTACT_KIND.LEGAL_ENTITY;
						const showsCorrespondent = isLegalEntity || values.correspondentIsDifferent === true;
						const legalAgentKindOptions = [
							{ value: CONTACT_KIND.PHYSICAL_PERSON, label: t("kind.physical") },
							{ value: CONTACT_KIND.LEGAL_ENTITY, label: t("kind.legalEntity") },
						];

						return (
							<>
								<section aria-labelledby="legal-agent-heading" className="grid gap-4">
									<div>
										<h3 id="legal-agent-heading" className="font-bold text-base text-secondary-12">
											{t("legalAgent.title")}
										</h3>
										<p className="mt-1 text-neutral-11 text-sm">{t("legalAgent.description")}</p>
									</div>

									<Field name="legal-agent-kind" className="flex flex-col gap-2">
										<Field.Label htmlFor="legal-agent-kind" required>
											{t("legalAgent.kind")}
										</Field.Label>
										<Select
											items={legalAgentKindOptions}
											value={values.legalAgentKind}
											onValueChange={(kind) => {
												if (kind !== null) setLegalAgentKind(kind);
											}}
										>
											<Select.Input id="legal-agent-kind" className="w-full">
												<Select.Value placeholder={t("legalAgent.kind")} />
											</Select.Input>
											<Select.Dropdown>
												{legalAgentKindOptions.map((option) => (
													<Select.Option
														key={option.value}
														value={option.value}
														label={option.label}
													>
														{option.label}
													</Select.Option>
												))}
											</Select.Dropdown>
										</Select>
									</Field>

									{isPhysicalPerson && (
										<PersonFields
											idPrefix="legal-agent"
											value={{
												civility: values.legalAgentCivility,
												firstName: values.legalAgentFirstName,
												lastName: values.legalAgentLastName,
												email: values.legalAgentEmail,
												phoneNumber: values.legalAgentPhoneNumber,
												function: values.legalAgentFunction,
												amundiPortalId: "",
											}}
											onChange={(changes) => {
												if (changes.civility !== undefined) {
													form.setFieldValue("legalAgentCivility", changes.civility);
												}
												if (changes.firstName !== undefined) {
													form.setFieldValue("legalAgentFirstName", changes.firstName);
												}
												if (changes.lastName !== undefined) {
													form.setFieldValue("legalAgentLastName", changes.lastName);
												}
												if (changes.email !== undefined) {
													form.setFieldValue("legalAgentEmail", changes.email);
												}
												if (changes.phoneNumber !== undefined) {
													form.setFieldValue("legalAgentPhoneNumber", changes.phoneNumber);
												}
												if (changes.function !== undefined) {
													form.setFieldValue("legalAgentFunction", changes.function);
												}
											}}
											onBlur={save}
											includeFunction
											phoneRequired
										/>
									)}

									{isLegalEntity && (
										<div className="grid gap-4 md:grid-cols-6">
											<TextInput
												id="legal-agent-legal-name"
												label={t("field.legalName")}
												value={values.legalAgentLegalName}
												onChange={(legalAgentLegalName) =>
													form.setFieldValue("legalAgentLegalName", legalAgentLegalName)
												}
												onBlur={save}
												required
												className="md:col-span-3"
											/>
											<TextInput
												id="legal-agent-email"
												label={t("field.email")}
												value={values.legalAgentEmail}
												onChange={(legalAgentEmail) =>
													form.setFieldValue("legalAgentEmail", legalAgentEmail)
												}
												onBlur={save}
												type="email"
												required
												className="md:col-span-3"
											/>
											<div className="md:col-span-2">
												<ContactFunctionSelect
													id="legal-agent-function"
													label={t("field.function")}
													value={values.legalAgentFunction}
													required
													onValueChange={(legalAgentFunction) =>
														form.setFieldValue("legalAgentFunction", legalAgentFunction)
													}
													onBlur={save}
												/>
											</div>
										</div>
									)}
								</section>

								<section
									aria-labelledby="signer-heading"
									className="border-neutral-4 border-t pt-6"
								>
									<div>
										<h3 id="signer-heading" className="font-bold text-base text-secondary-12">
											{t("signer.title")}
										</h3>
										<p className="mt-1 text-neutral-11 text-sm">{t("signer.description")}</p>
									</div>

									<div className="mt-4 grid gap-4 rounded-md border border-primary-3 bg-primary-2 p-4">
										<ChoiceGroup
											label={t("signer.onKbis")}
											value={values.signerOnKbis}
											required
											options={[
												{ value: true, label: t("answer.yes") },
												{ value: false, label: t("answer.no") },
											]}
											onValueChange={setSignerOnKbis}
										/>
										<PersonFields
											idPrefix="signer"
											value={{
												civility: values.signerCivility,
												firstName: values.signerFirstName,
												lastName: values.signerLastName,
												email: values.signerEmail,
												phoneNumber: values.signerPhoneNumber,
												function: null,
												amundiPortalId: "",
											}}
											onChange={(changes) => {
												if (changes.civility !== undefined) {
													form.setFieldValue("signerCivility", changes.civility);
												}
												if (changes.firstName !== undefined) {
													form.setFieldValue("signerFirstName", changes.firstName);
												}
												if (changes.lastName !== undefined) {
													form.setFieldValue("signerLastName", changes.lastName);
												}
												if (changes.email !== undefined) {
													form.setFieldValue("signerEmail", changes.email);
												}
												if (changes.phoneNumber !== undefined) {
													form.setFieldValue("signerPhoneNumber", changes.phoneNumber);
												}
											}}
											onBlur={save}
											phoneRequired
										/>
									</div>
								</section>

								<section
									aria-labelledby="correspondent-heading"
									className="border-neutral-4 border-t pt-6"
								>
									<div>
										<h3
											id="correspondent-heading"
											className="font-bold text-base text-secondary-12"
										>
											{t("correspondent.title")}
										</h3>
										<p className="mt-1 text-neutral-11 text-sm">{t("correspondent.description")}</p>
									</div>

									<div className="mt-4 grid gap-4 rounded-md border border-primary-3 bg-primary-2 p-4">
										{isPhysicalPerson && (
											<ChoiceGroup
												label={t("correspondent.isDifferent")}
												value={values.correspondentIsDifferent}
												required
												options={[
													{ value: true, label: t("answer.yes") },
													{ value: false, label: t("answer.no") },
												]}
												onValueChange={setCorrespondentIsDifferent}
											/>
										)}

										{isLegalEntity && (
											<p className="text-primary-11 text-sm">
												{t("correspondent.forcedDifferent")}
											</p>
										)}

										{showsCorrespondent && (
											<PersonFields
												idPrefix="correspondent"
												value={{
													civility: values.correspondentCivility,
													firstName: values.correspondentFirstName,
													lastName: values.correspondentLastName,
													email: values.correspondentEmail,
													phoneNumber: values.correspondentPhoneNumber,
													function: values.correspondentFunction,
													amundiPortalId: values.correspondentAmundiPortalId,
												}}
												onChange={(changes) => {
													if (changes.civility !== undefined) {
														form.setFieldValue("correspondentCivility", changes.civility);
													}
													if (changes.firstName !== undefined) {
														form.setFieldValue("correspondentFirstName", changes.firstName);
													}
													if (changes.lastName !== undefined) {
														form.setFieldValue("correspondentLastName", changes.lastName);
													}
													if (changes.email !== undefined) {
														form.setFieldValue("correspondentEmail", changes.email);
													}
													if (changes.phoneNumber !== undefined) {
														form.setFieldValue("correspondentPhoneNumber", changes.phoneNumber);
													}
													if (changes.function !== undefined) {
														form.setFieldValue("correspondentFunction", changes.function);
													}
													if (changes.amundiPortalId !== undefined) {
														form.setFieldValue(
															"correspondentAmundiPortalId",
															changes.amundiPortalId,
														);
													}
												}}
												onBlur={save}
												includeFunction
												includePortalId
												phoneRequired
											/>
										)}
									</div>
								</section>

								<section
									aria-labelledby="authorizations-heading"
									className="border-neutral-4 border-t pt-6"
								>
									<div className="flex flex-wrap items-start justify-between gap-4">
										<div>
											<h3
												id="authorizations-heading"
												className="font-bold text-base text-secondary-12"
											>
												{t("authorizations.title")}
											</h3>
											<p className="mt-1 text-neutral-11 text-sm">
												{t("authorizations.description")}
											</p>
										</div>
										<Button type="button" onClick={addAuthorization}>
											<PlusIcon />
											{t("authorizations.add")}
										</Button>
									</div>

									{values.authorizations.length === 0 ? (
										<p className="mt-4 text-neutral-11 text-sm">{t("authorizations.empty")}</p>
									) : (
										<div className="mt-4 grid gap-4">
											{values.authorizations.map((authorization, index) => (
												<AuthorizationCard
													key={authorization.key}
													index={index}
													value={authorization}
													onChange={(changes) => updateAuthorization(index, changes)}
													onBlur={save}
													onRemove={() => removeAuthorization(index)}
												/>
											))}
										</div>
									)}
								</section>
							</>
						);
					}}
				</form.Subscribe>
			</section>
		</Card>
	);
}
