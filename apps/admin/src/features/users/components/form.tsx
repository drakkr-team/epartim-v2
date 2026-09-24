import { useTranslation } from "react-i18next";

import { USER_ROLES } from "@workspace/api/constants/user";
import type { Firm } from "@workspace/api/data";
import { Select } from "@workspace/ui-react/components/select";

import { FirmCombobox } from "#/features/firms/components/combobox.tsx";
import { type UseUserFormParams, useUserForm } from "#/features/users/hooks/use-form";

type UserFormProps = UseUserFormParams & {
	defaultValues?: {
		firm?: Firm | null;
	};
};

export function UserForm(props: UserFormProps) {
	const { t } = useTranslation("features.users.components.form");

	const form = useUserForm(props);

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
				<form.AppField name="firstName">
					{(field) => (
						<field.TextField label={t("field.firstName.label")} inputProps={{ type: "text" }} />
					)}
				</form.AppField>

				<form.AppField name="lastName">
					{(field) => (
						<field.TextField label={t("field.lastName.label")} inputProps={{ type: "text" }} />
					)}
				</form.AppField>
			</div>

			<form.AppField name="email">
				{(field) => (
					<field.TextField
						label={t("field.email.label")}
						inputProps={{ type: "email" }}
						disabled={props.action === "update"}
					/>
				)}
			</form.AppField>

			<form.AppField name="role">
				{(field) => {
					const roleOptions = Object.values(USER_ROLES).map((role) => {
						const roleKey = Object.keys(USER_ROLES).find(
							(key) => USER_ROLES[key as keyof typeof USER_ROLES] === role,
						) as keyof typeof USER_ROLES;

						return {
							label: t(`field.role.option.${roleKey}`),
							value: role,
						};
					});

					return (
						<field.GenericField label={t("field.role.label")}>
							<Select
								items={roleOptions}
								value={field.state.value}
								onValueChange={(value) => value !== null && field.handleChange(value)}
								onOpenChangeComplete={(open) => !open && field.handleBlur()}
							>
								<Select.Input>
									<Select.Value />
								</Select.Input>

								<Select.Dropdown>
									{roleOptions.map((option) => (
										<Select.Option key={option.value} value={option.value}>
											{option.label}
										</Select.Option>
									))}
								</Select.Dropdown>
							</Select>
						</field.GenericField>
					);
				}}
			</form.AppField>

			<form.AppField name="firmId">
				{(field) => (
					<field.GenericField label={t("field.firm.label")}>
						<FirmCombobox
							defaultValue={props.defaultValues?.firm}
							onValueChange={(value) =>
								field.handleChange(value === null ? null : Number(value.id))
							}
							onOpenChangeComplete={(open) => !open && field.handleBlur()}
						/>
					</field.GenericField>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variant="primary" className="mt-2">
					{props.action === "create" ? t("action.create") : t("action.update")}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
