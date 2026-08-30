import { useTranslation } from "react-i18next";

import { type UseAdminFormParams, useAdminForm } from "#/features/admins/hooks/use-form";

type AdminFormProps = UseAdminFormParams;

export function AdminForm(props: AdminFormProps) {
	const { t } = useTranslation("features.admins.components.form");

	const form = useAdminForm(props);

	return (
		<form
			className="grid gap-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
		>
			<form.AppField name="name">
				{(field) => <field.TextField label={t("field.name.label")} inputProps={{ type: "text" }} />}
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
