import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
	AUTHORIZATIONS_ACTIONS,
	AUTHORIZATIONS_RESOURCES,
	type AuthorizationActions,
	type AuthorizationOption,
	type AuthorizationResources,
} from "@workspace/api/constants/role";
import { Button } from "@workspace/ui-react/components/button";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Separator } from "@workspace/ui-react/components/separator";
import { Table } from "@workspace/ui-react/components/table";

import { type UseRoleFormParams, useRoleForm } from "#/features/roles/hooks/use-form";

type RoleFormProps = UseRoleFormParams;

export function RoleForm(props: RoleFormProps) {
	const { t } = useTranslation("features.roles.components.form");

	const form = useRoleForm(props);

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
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.general")}
				</h2>

				<div className="col-span-2">
					<form.AppField name="name">
						{(field) => (
							<field.TextField
								required
								label={t("field.name.label")}
								inputProps={{ type: "text", autoComplete: "off" }}
							/>
						)}
					</form.AppField>
				</div>
			</div>

			<Separator />

			<div className="grid gap-4">
				<h2 className="font-semibold text-lg text-secondary-12">{t("section.authorizations")}</h2>

				<form.AppField name="authorizations">
					{(field) => {
						const authorizations = field.state.value;

						const isResourceFullyChecked = (resource: AuthorizationResources) => {
							return AUTHORIZATIONS_ACTIONS.map((action) => `${action}:${resource}` as const).every(
								(authorization) => authorizations.includes(authorization),
							);
						};

						const isResourcePartiallyChecked = (resource: AuthorizationResources) => {
							return (
								AUTHORIZATIONS_ACTIONS.map((action) => `${action}:${resource}` as const).some(
									(authorization) => authorizations.includes(authorization),
								) && !isResourceFullyChecked(resource)
							);
						};

						const isActionFullyChecked = (action: AuthorizationActions) => {
							return AUTHORIZATIONS_RESOURCES.map(
								(resource) => `${action}:${resource}` as const,
							).every((authorization) => authorizations.includes(authorization));
						};

						const isActionPartiallyChecked = (action: AuthorizationActions) => {
							return (
								AUTHORIZATIONS_RESOURCES.map((resource) => `${action}:${resource}` as const).some(
									(authorization) => authorizations.includes(authorization),
								) && !isActionFullyChecked(action)
							);
						};

						const handleCheckedChange = (checked: boolean, authorization: AuthorizationOption) => {
							if (checked) {
								field.handleChange((prev) => [authorization, ...prev]);
							} else {
								field.handleChange((prev) =>
									prev.filter((prevOption) => prevOption !== authorization),
								);
							}
						};

						const handleResourceCheckedChange = (
							checked: boolean,
							resource: AuthorizationResources,
						) => {
							const resourceAuthorizations = AUTHORIZATIONS_ACTIONS.map(
								(action) => `${action}:${resource}` as const,
							);

							if (checked) {
								field.handleChange((prev) => [...prev, ...resourceAuthorizations]);
							} else {
								field.handleChange((prev) =>
									prev.filter((prevOption) => !resourceAuthorizations.includes(prevOption)),
								);
							}
						};

						const handleActionCheckedChange = (checked: boolean, action: AuthorizationActions) => {
							const actionAuthorizations = AUTHORIZATIONS_RESOURCES.map(
								(resource) => `${action}:${resource}` as const,
							);

							if (checked) {
								field.handleChange((prev) => [...prev, ...actionAuthorizations]);
							} else {
								field.handleChange((prev) =>
									prev.filter((prevOption) => !actionAuthorizations.includes(prevOption)),
								);
							}
						};

						return (
							<Table>
								<Table.Header>
									<Table.HeaderCell />
									<Table.HeaderCell className="text-center">
										<div className="flex flex-col items-center gap-2">
											{t("field.authorizations.action.read")}
											<Checkbox size="sm" disabled checked />
										</div>
									</Table.HeaderCell>
									{AUTHORIZATIONS_ACTIONS.map((action) => (
										<Table.HeaderCell key={action} className="text-center">
											<div className="flex flex-col items-center gap-2">
												{t(`field.authorizations.action.${action}`)}
												<Checkbox
													size="sm"
													indeterminate={isActionPartiallyChecked(action)}
													checked={isActionFullyChecked(action)}
													onCheckedChange={(checked) => handleActionCheckedChange(checked, action)}
												/>
											</div>
										</Table.HeaderCell>
									))}
								</Table.Header>
								<Table.Body>
									{AUTHORIZATIONS_RESOURCES.map((resource) => (
										<Table.Row key={resource}>
											<Table.Cell>
												<div className="flex items-center gap-2">
													<Checkbox
														size="sm"
														indeterminate={isResourcePartiallyChecked(resource)}
														checked={isResourceFullyChecked(resource)}
														onCheckedChange={(checked) =>
															handleResourceCheckedChange(checked, resource)
														}
													/>
													<span className="truncate font-bold text-neutral-9 text-xs uppercase">
														{t(`field.authorizations.resource.${resource}`)}
													</span>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div className="flex justify-center">
													<Checkbox size="sm" checked disabled />
												</div>
											</Table.Cell>
											{AUTHORIZATIONS_ACTIONS.map((action) => {
												const authorization = `${action}:${resource}` as const;

												return (
													<Table.Cell key={action}>
														<div className="flex justify-center">
															<Checkbox
																size="sm"
																checked={authorizations.includes(authorization)}
																onCheckedChange={(checked) =>
																	handleCheckedChange(checked, authorization)
																}
																onBlur={field.handleBlur}
															/>
														</div>
													</Table.Cell>
												);
											})}
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						);
					}}
				</form.AppField>
			</div>

			<div className="mt-2 flex justify-end gap-2">
				<Button variant="default" nativeButton={false} render={<Link to=".." />}>
					{t("action.cancel")}
				</Button>

				<form.AppForm>
					<form.Subscribe selector={(state) => state.isDirty}>
						{(isDirty) => (
							<form.SubmitButton
								variant="primary"
								className="flex-1"
								disabled={props.action === "update" && !isDirty}
							>
								{props.action === "create" ? t("action.create") : t("action.update")}
							</form.SubmitButton>
						)}
					</form.Subscribe>
				</form.AppForm>
			</div>
		</form>
	);
}
