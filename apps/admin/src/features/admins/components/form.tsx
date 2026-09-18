import { useTranslation } from "react-i18next";

import type { Role } from "@workspace/api/data";

import { type UseAdminFormParams, useAdminForm } from "#/features/admins/hooks/use-form";
import { RoleCombobox } from "#/features/roles/components/combobox.tsx";

type AdminFormProps = UseAdminFormParams & {
	defaultValues?: {
		role?: Role;
	};
};

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

			<form.AppField name="roleId">
				{(field) => (
					<field.GenericField label={t("field.role.label")}>
						<RoleCombobox
							defaultValue={props.defaultValues?.role}
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
