import { useTranslation } from "react-i18next";

import { type UseUserFormParams, useUserForm } from "#/features/users/hooks/use-form";

export function UserForm(props: UseUserFormParams) {
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

			<form.AppField name="email">
				{(field) => (
					<field.TextField
						label={t("field.email.label")}
						inputProps={{ type: "email" }}
						disabled={props.action === "update"}
					/>
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
