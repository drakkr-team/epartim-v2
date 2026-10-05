import type { routes } from "@workspace/api/registry";

import { useCreateFormalismMemberMutation } from "#/features/subscriptions/formalism/hooks/use-create-member-mutation";
import { useDeleteFormalismMemberMutation } from "#/features/subscriptions/formalism/hooks/use-delete-member-mutation";
import { useUpdateFormalismMemberMutation } from "#/features/subscriptions/formalism/hooks/use-update-member-mutation";
import { useUpdateFormalismMutation } from "#/features/subscriptions/formalism/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

export type Formalism =
	(typeof routes)["client.subscriptions.view"]["types"]["response"]["formalism"];
export type FormalismGroup = Formalism["groups"][number];
export function groupValues(group: FormalismGroup) {
	return {
		...group,
		meetingDate: group.meetingDate ?? "",
		meetingCity: group.meetingCity ?? "",
		closingTime: group.closingTime ?? "",
		presidentFirstName: group.presidentFirstName ?? "",
		presidentLastName: group.presidentLastName ?? "",
		presidentEmail: group.presidentEmail ?? "",
		members: group.members.map(memberValues),
	};
}
function memberValues(member: FormalismGroup["members"][number]) {
	return {
		...member,
		firstName: member.firstName ?? "",
		lastName: member.lastName ?? "",
		email: member.email ?? "",
	};
}
export function useFormalismForm(subscriptionId: string, group: FormalismGroup) {
	const updateMutation = useUpdateFormalismMutation(subscriptionId);
	const createMemberMutation = useCreateFormalismMemberMutation(subscriptionId);
	const updateMemberMutation = useUpdateFormalismMemberMutation(subscriptionId);
	const deleteMemberMutation = useDeleteFormalismMemberMutation(subscriptionId);
	const params = { subscriptionId, group: String(group.group) };
	type GroupBody = NonNullable<Parameters<typeof updateMutation.mutate>[0]>["body"];
	type MemberBody = NonNullable<Parameters<typeof updateMemberMutation.mutate>[0]>["body"];
	const form = useAppForm({
		defaultValues: groupValues(group),
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				if (
					!fieldApi.state.meta.isDirty ||
					!fieldApi.state.meta.isValid ||
					fieldApi.name === "members"
				)
					return;
				const rawValue = fieldApi.state.value;
				const value = typeof rawValue === "string" ? rawValue.trim() || null : rawValue;
				const onSuccess = () => {
					if (Object.is(fieldApi.state.value, rawValue))
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
				};
				const match = fieldApi.name.match(/^members\[(\d+)\]\.(.+)$/);
				if (match) {
					const member = formApi.state.values.members[Number(match[1])];
					if (member)
						updateMemberMutation.mutate(
							{
								params: { ...params, memberId: String(member.id) },
								body: { [match[2]]: value } as MemberBody,
							},
							{ onSuccess },
						);
				} else
					updateMutation.mutate(
						{ params, body: { [fieldApi.name]: value } as GroupBody },
						{ onSuccess },
					);
			},
		},
	});
	function changeMethod(method: NonNullable<FormalismGroup["method"]>) {
		updateMutation.mutate(
			{ params, body: { method } },
			{ onSuccess: (result) => form.reset(groupValues(result)) },
		);
	}
	function createMember() {
		createMemberMutation.mutate(
			{ params },
			{
				onSuccess: (member) =>
					form.setFieldValue("members", (current) => [...current, memberValues(member)]),
			},
		);
	}
	function deleteMember(memberId: number) {
		deleteMemberMutation.mutate(
			{ params: { ...params, memberId: String(memberId) } },
			{
				onSuccess: () => {
					form.setFieldValue("members", (current) =>
						current.filter((member) => member.id !== memberId),
					);
					if (form.state.values.mandatedMemberId === memberId)
						form.setFieldValue("mandatedMemberId", null);
				},
			},
		);
	}
	function copyPeople(source: FormalismGroup) {
		updateMutation.mutate(
			{
				params,
				body: {
					presidentFirstName: source.presidentFirstName,
					presidentLastName: source.presidentLastName,
					presidentEmail: source.presidentEmail,
					members: source.members.map((member) => ({
						firstName: member.firstName,
						lastName: member.lastName,
						email: member.email,
						function: member.function,
						attending: member.attending,
						mandated: member.id === source.mandatedMemberId,
					})),
				},
			},
			{
				onSuccess: (result) => {
					const copied = groupValues(result);
					for (const name of [
						"presidentFirstName",
						"presidentLastName",
						"presidentEmail",
						"members",
						"mandatedMemberId",
					] as const) {
						form.setFieldValue(name, copied[name]);
						form.setFieldMeta(name, (meta) => ({ ...meta, errorMap: {}, isDirty: false }));
					}
				},
			},
		);
	}
	return { form, changeMethod, createMember, deleteMember, copyPeople };
}
