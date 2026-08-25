import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import type { Admin, AdminFieldErrors } from "#/features/admins/model";
import {
	adminCreateSchema,
	adminUpdateSchema,
	isUnchangedAdminName,
} from "#/features/admins/model";
import { useAppForm } from "#/libs/form";

type CreateAdminFormProps = {
	readonly mode: "create";
	readonly admin?: never;
	readonly apiErrors: AdminFieldErrors;
	readonly isPending: boolean;
	readonly cancelAction: ReactNode;
	readonly onSubmit: (payload: z.infer<typeof adminCreateSchema>) => Promise<void>;
};

type UpdateAdminFormProps = {
	readonly mode: "update";
	readonly admin: Admin;
	readonly apiErrors: AdminFieldErrors;
	readonly isPending: boolean;
	readonly cancelAction: ReactNode;
	readonly onSubmit: (payload: z.infer<typeof adminUpdateSchema>) => Promise<void>;
};

type AdminFormProps = CreateAdminFormProps | UpdateAdminFormProps;

export function AdminForm(props: AdminFormProps) {
	const { mode, apiErrors, isPending, cancelAction } = props;
	const admin = mode === "update" ? props.admin : undefined;
	const { t } = useTranslation("features.admins");
	const pendingLabel = mode === "create" ? t("create.pending") : t("update.pending");

	const nameSchema = z
		.string()
		.trim()
		.min(1, t("form.validation.nameRequired"))
		.max(255, t("form.validation.nameMax"));
	const emailSchema = z
		.string()
		.trim()
		.email(t("form.validation.emailInvalid"))
		.max(254, t("form.validation.emailMax"));

	const form = useAppForm({
		defaultValues: {
			name: admin?.name ?? "",
			email: admin?.email ?? "",
		},
		onSubmit: async ({ value }) => {
			if (mode === "create") {
				await props.onSubmit(adminCreateSchema.parse(value));
				return;
			}

			if (isUnchangedAdminName(value.name, props.admin.name)) {
				return;
			}

			await props.onSubmit(adminUpdateSchema.parse({ name: value.name }));
		},
	});

	return (
		<form
			className="space-y-5"
			noValidate
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
		>
			<p aria-live="polite" className="sr-only" role="status">
				{isPending ? pendingLabel : ""}
			</p>
			<form.AppField name="name" validators={{ onSubmit: nameSchema }}>
				{(field) => (
					<field.TextField
						label={t("form.name")}
						required
						disabled={isPending}
						error={apiErrors.name}
						inputProps={{ autoComplete: "name", maxLength: 255 }}
					/>
				)}
			</form.AppField>

			{mode === "create" ? (
				<form.AppField name="email" validators={{ onSubmit: emailSchema }}>
					{(field) => (
						<field.TextField
							label={t("form.email")}
							required
							disabled={isPending}
							error={apiErrors.email}
							inputProps={{
								autoComplete: "email",
								inputMode: "email",
								maxLength: 254,
								type: "email",
							}}
						/>
					)}
				</form.AppField>
			) : (
				<div className="space-y-2">
					<p className="font-medium text-neutral-12 text-sm">{t("form.email")}</p>
					<p className="rounded-md border border-neutral-7 bg-neutral-3 px-3 py-2 text-sm">
						{admin?.email}
					</p>
					<p className="text-neutral-11 text-xs">{t("form.emailReadonly")}</p>
				</div>
			)}

			<div className="flex flex-wrap justify-end gap-2 pt-2">
				{cancelAction}
				<form.AppForm>
					<form.Subscribe
						selector={(state) =>
							!state.canSubmit ||
							(mode === "update" && isUnchangedAdminName(state.values.name, props.admin.name))
						}
					>
						{(isDisabled) => (
							<form.SubmitButton disabled={isDisabled || isPending} variant="primary">
								{isPending
									? pendingLabel
									: mode === "create"
										? t("actions.create")
										: t("actions.save")}
							</form.SubmitButton>
						)}
					</form.Subscribe>
				</form.AppForm>
			</div>
		</form>
	);
}
