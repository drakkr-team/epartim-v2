import { useTranslation } from "react-i18next";
import z from "zod";

import {
	SubscriptionFormalismGroup,
	SubscriptionFormalismMethod,
} from "@workspace/api/constants/subscription_formalism";
import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";
import { CopyIcon, PlusIcon } from "@workspace/ui-react/icons";

import { CseMeetingFields } from "#/features/subscriptions/formalism/components/cse-meeting-fields";
import { CseMemberFields } from "#/features/subscriptions/formalism/components/cse-member-fields";
import { CsePresidentFields } from "#/features/subscriptions/formalism/components/cse-president-fields";
import { CseVoteFields } from "#/features/subscriptions/formalism/components/cse-vote-fields";
import type {
	Formalism,
	useFormalismGroupForm,
} from "#/features/subscriptions/formalism/hooks/use-group-form";

type CseSectionProps = Pick<
	ReturnType<typeof useFormalismGroupForm>,
	"form" | "createMember" | "deleteMember" | "copyPeople"
> & { group: number; formalism: Formalism; busy: boolean };

export function CseSection({
	form,
	group,
	formalism,
	createMember,
	deleteMember,
	copyPeople,
	busy,
}: CseSectionProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const source = formalism.groups.find(
		(other) =>
			other.group === SubscriptionFormalismGroup.PEI_PER &&
			other.method === SubscriptionFormalismMethod.CSE,
	);
	const selected = z.number({ error: t("validation.required") });
	function validateComposition() {
		const values = form.state.values;
		if (values.members.length === 0) return t("validation.members");
		const counts = [values.votesFor, values.votesAgainst, values.votesAbstentions];
		if (
			counts.some((value) => value === null) ||
			values.members.some((member) => member.attending === null)
		)
			return;
		const present = values.members.filter((member) => member.attending).length;
		if (counts.reduce<number>((sum, value) => sum + (value ?? 0), 0) !== present)
			return t("validation.voteTotal", { count: present });
		if ((values.votesFor ?? 0) <= present / 2) return t("validation.voteMajority");
	}

	return (
		<section className="grid gap-6">
			{group === SubscriptionFormalismGroup.PARTICIPATION && source && (
				<Button
					type="button"
					variant="default"
					disabled={busy}
					className="w-fit"
					onClick={() => copyPeople(source)}
				>
					<CopyIcon />
					{t("action.copyPeople")}
				</Button>
			)}
			<div className="grid gap-5 border-neutral-4 border-t pt-6">
				<h3 className="font-bold text-lg text-secondary-12">{t("cse.meeting")}</h3>
				<CseMeetingFields form={form} group={group} />
			</div>
			<div className="grid gap-5 border-neutral-4 border-t pt-6">
				<div>
					<h3 className="font-bold text-lg text-secondary-12">{t("cse.president")}</h3>
					<p className="mt-1 text-neutral-11 text-sm">{t("cse.presidentDescription")}</p>
				</div>
				<CsePresidentFields form={form} group={group} />
			</div>
			<form.Subscribe selector={(state) => state.values}>
				{(values) => {
					const dependencies = [
						"votesFor",
						"votesAgainst",
						"votesAbstentions",
						...values.members.map((_, index) => `members[${index}].attending` as const),
					] as const;
					return (
						<section className="grid gap-5 border-neutral-4 border-t pt-6">
							<div>
								<h3 className="font-bold text-lg text-secondary-12">{t("cse.members")}</h3>
								<p className="mt-1 text-neutral-11 text-sm">{t("cse.membersDescription")}</p>
							</div>
							<form.AppField
								name="members"
								mode="array"
								validators={{
									onBlur: validateComposition,
									onChange: validateComposition,
									onBlurListenTo: [...dependencies],
									onChangeListenTo: [...dependencies],
								}}
							>
								{(membersField) => (
									<>
										{values.members.map((member, index) => (
											<CseMemberFields
												key={member.id}
												form={form}
												member={member}
												index={index}
												group={group}
												mandatedMemberId={values.mandatedMemberId}
												busy={busy}
												onRemove={() => deleteMember(member.id)}
											/>
										))}
										<Button
											type="button"
											variant="default"
											disabled={busy}
											className="w-fit rounded-full"
											onClick={createMember}
										>
											<PlusIcon />
											{t("action.addMember")}
										</Button>
										<form.AppField
											name="mandatedMemberId"
											validators={{
												onBlur: selected.refine(
													(id) => values.members.some((member) => member.id === id),
													t("validation.mandated"),
												),
												onBlurListenTo: ["members"],
											}}
										>
											{(field) => {
												const invalid =
													field.state.meta.isTouched &&
													field.state.meta.errorMap.onBlur !== undefined;
												const id = `cse-${group}-mandated`;
												const memberOptions = values.members.map((member, index) => ({
													value: member.id,
													label:
														[member.firstName, member.lastName].filter(Boolean).join(" ") ||
														t("cse.member", { index: index + 1 }),
												}));
												return (
													<Field
														name={field.name}
														invalid={invalid}
														className="flex flex-col gap-2"
													>
														<Field.Label htmlFor={id} required>
															{t("field.mandatedMember")}
														</Field.Label>
														<Select
															items={memberOptions}
															value={field.state.value}
															onValueChange={(value) => field.handleChange(value)}
															onOpenChange={(open) => {
																if (!open) field.handleBlur();
															}}
														>
															<Select.Input
																id={id}
																name={field.name}
																aria-invalid={invalid}
																className="w-full"
															>
																<Select.Value placeholder={t("field.mandatedMember")} />
															</Select.Input>
															<Select.Dropdown>
																{memberOptions.map((option) => (
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
														{invalid &&
															field.state.meta.errorMap.onBlur?.map((error) => (
																<Field.Error key={error.message}>{error.message}</Field.Error>
															))}
													</Field>
												);
											}}
										</form.AppField>
										<div className="grid gap-4 border-neutral-4 border-t pt-6">
											<div>
												<h3 className="font-bold text-lg text-secondary-12">{t("cse.votes")}</h3>
												<p className="mt-1 text-neutral-11 text-sm">
													{t("cse.votesDescription", {
														count: values.members.filter((member) => member.attending).length,
													})}
												</p>
											</div>
											<CseVoteFields form={form} group={group} />
											<Field
												name={membersField.name}
												invalid={!membersField.state.meta.isValid}
												aria-invalid={!membersField.state.meta.isValid}
											>
												{!membersField.state.meta.isValid && (
													<Field.Error>
														{membersField.state.meta.errorMap.onBlur ??
															membersField.state.meta.errorMap.onChange}
													</Field.Error>
												)}
											</Field>
										</div>
									</>
								)}
							</form.AppField>
						</section>
					);
				}}
			</form.Subscribe>
		</section>
	);
}
