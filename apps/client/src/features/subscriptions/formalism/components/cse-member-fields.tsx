import { useTranslation } from "react-i18next";
import z from "zod";

import { SubscriptionCseFunction } from "@workspace/api/constants/subscription_formalism";
import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";
import { Trash2Icon } from "@workspace/ui-react/icons";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import type { useFormalismForm } from "#/features/subscriptions/formalism/hooks/use-form";

type CseMemberFieldsProps = {
	form: ReturnType<typeof useFormalismForm>["form"];
	member: ReturnType<typeof useFormalismForm>["form"]["state"]["values"]["members"][number];
	index: number;
	group: number;
	mandatedMemberId: number | null;
	busy: boolean;
	onRemove: () => void;
};

export function CseMemberFields({
	form,
	member,
	index,
	group,
	mandatedMemberId,
	busy,
	onRemove,
}: CseMemberFieldsProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const required = z
		.string()
		.trim()
		.min(1, t("validation.required"))
		.max(254, t("validation.length"));
	const email = z.string().trim().email(t("validation.email")).max(254, t("validation.length"));
	const functions = Object.values(SubscriptionCseFunction).map((value) => ({
		value,
		label: t(`function.${value}`),
	}));

	return (
		<section
			aria-label={t("cse.member", { index: index + 1 })}
			className="grid gap-4 rounded-md border border-neutral-5 p-4"
		>
			<div className="flex items-center justify-between gap-3">
				<h4 className="font-bold text-secondary-12 text-sm">
					{t("cse.member", { index: index + 1 })}
				</h4>
				<Button
					type="button"
					variant="ghost"
					size="icon-md"
					disabled={busy}
					aria-label={t("action.removeMember", { index: index + 1 })}
					onClick={onRemove}
				>
					<Trash2Icon />
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				{(["lastName", "firstName", "email"] as const).map((name) => (
					<form.AppField
						key={name}
						name={`members[${index}].${name}`}
						validators={{
							onBlur:
								name === "email"
									? z
											.string()
											.trim()
											.refine(
												(value) =>
													(!value && mandatedMemberId !== member.id) ||
													email.safeParse(value).success,
												t("validation.email"),
											)
									: required,
							onBlurListenTo: name === "email" ? ["mandatedMemberId"] : [],
						}}
					>
						{(field) => (
							<field.TextField
								id={`cse-${group}-member-${member.id}-${name}`}
								label={t(`field.${name}`)}
								required={name !== "email" || mandatedMemberId === member.id}
								inputProps={{ type: name === "email" ? "email" : "text" }}
							/>
						)}
					</form.AppField>
				))}
				<form.AppField
					name={`members[${index}].function`}
					validators={{
						onBlur: z
							.literal(Object.values(SubscriptionCseFunction), t("validation.required"))
							.nullable()
							.refine((value) => value !== null, t("validation.required")),
					}}
				>
					{(field) => {
						const invalid =
							field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;
						const id = `cse-${group}-member-${member.id}-function`;

						return (
							<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
								<Field.Label htmlFor={id} required>
									{t("field.function")}
								</Field.Label>
								<Select
									items={functions}
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
									onOpenChange={(open) => {
										if (!open) field.handleBlur();
									}}
								>
									<Select.Input id={id} name={field.name} aria-invalid={invalid} className="w-full">
										<Select.Value placeholder={t("field.function")} />
									</Select.Input>
									<Select.Dropdown>
										{functions.map((option) => (
											<Select.Option key={option.value} value={option.value} label={option.label}>
												{option.label}
											</Select.Option>
										))}
									</Select.Dropdown>
								</Select>
								{invalid &&
									field.state.meta.errorMap.onBlur?.map((error) => (
										<Field.Error key={error.message}>{error.message}</Field.Error>
									))}
							</Field>
						);
					}}
				</form.AppField>
				<form.AppField
					name={`members[${index}].attending`}
					validators={{ onBlur: z.boolean({ error: t("validation.required") }) }}
				>
					{(field) => (
						<BooleanField
							label={t("field.attending")}
							required
							yesLabel={t("cse.present")}
							noLabel={t("cse.absent")}
							value={field.state.value}
							onValueChange={(value) => {
								field.handleChange(value);
								field.handleBlur();
							}}
							invalid={field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined}
							errorMessages={field.state.meta.errorMap.onBlur?.map((error) => error.message)}
						/>
					)}
				</form.AppField>
			</div>
		</section>
	);
}
