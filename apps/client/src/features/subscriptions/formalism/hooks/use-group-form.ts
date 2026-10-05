import type { routes } from "@workspace/api/registry";

import { useFormalismMutations } from "#/features/subscriptions/formalism/hooks/use-mutations";
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
export function useFormalismGroupForm(subscriptionId: string, group: FormalismGroup) {
	const mutations = useFormalismMutations(subscriptionId);
	const params = { subscriptionId, group: String(group.group) };
	type GroupBody = NonNullable<Parameters<typeof mutations.updateGroup.mutate>[0]>["body"];
	type MemberBody = NonNullable<Parameters<typeof mutations.updateMember.mutate>[0]>["body"];
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
						mutations.updateMember.mutate(
							{
								params: { ...params, memberId: String(member.id) },
								body: { [match[2]]: value } as MemberBody,
							},
							{ onSuccess },
						);
				} else
					mutations.updateGroup.mutate(
						{ params, body: { [fieldApi.name]: value } as GroupBody },
						{ onSuccess },
					);
			},
		},
	});
	function hasPeople() {
		const values = form.state.values;
		return !!(
			values.presidentFirstName ||
			values.presidentLastName ||
			values.presidentEmail ||
			values.mandatedMemberId ||
			values.members.some(
				(member) =>
					member.firstName ||
					member.lastName ||
					member.email ||
					member.function !== null ||
					member.attending !== null,
			)
		);
	}
	function changeMethod(method: NonNullable<FormalismGroup["method"]>) {
		mutations.updateGroup.mutate(
			{ params, body: { method } },
			{ onSuccess: (result) => form.reset(groupValues(result)) },
		);
	}
	function createMember() {
		mutations.createMember.mutate(
			{ params },
			{
				onSuccess: (member) =>
					form.setFieldValue("members", (current) => [...current, memberValues(member)]),
			},
		);
	}
	function deleteMember(memberId: number) {
		mutations.deleteMember.mutate(
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
		mutations.updateGroup.mutate(
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
	return { form, changeMethod, createMember, deleteMember, copyPeople, hasPeople };
}
