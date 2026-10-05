import { SubscriptionFormalismGroup } from "#constants/subscription_formalism";
import type SubscriptionCseMember from "#models/subscription_cse_member";
import type SubscriptionFormalism from "#models/subscription_formalism";
import type SubscriptionFormalismEmployee from "#models/subscription_formalism_employee";

export function presentFormalismPerson(
	person: SubscriptionFormalismEmployee | SubscriptionCseMember,
) {
	return {
		id: person.id,
		firstName: person.firstName,
		lastName: person.lastName,
		email: person.email,
	};
}
export function presentCseMember(member: SubscriptionCseMember) {
	return {
		...presentFormalismPerson(member),
		function: member.function,
		attending: member.attending,
	};
}
export function presentFormalismGroup(
	group: SubscriptionFormalismGroup,
	record: SubscriptionFormalism | null,
	members: SubscriptionCseMember[],
) {
	return {
		group,
		method: record?.method ?? null,
		methodInvalidated: record?.methodInvalidated ?? false,
		meetingDate: record?.meetingDate?.toISODate() ?? null,
		meetingCity: record?.meetingCity ?? null,
		closingTime: record?.closingTime ?? null,
		votesFor: record?.votesFor ?? null,
		votesAgainst: record?.votesAgainst ?? null,
		votesAbstentions: record?.votesAbstentions ?? null,
		presidentFirstName: record?.presidentFirstName ?? null,
		presidentLastName: record?.presidentLastName ?? null,
		presidentEmail: record?.presidentEmail ?? null,
		mandatedMemberId: members.find((member) => member.mandated)?.id ?? null,
		members: members.map(presentCseMember),
	};
}
export function presentFormalism(
	records: SubscriptionFormalism[],
	employees: SubscriptionFormalismEmployee[],
) {
	return {
		groups: Object.values(SubscriptionFormalismGroup).map((group) => {
			const record = records.find((record) => record.group === group) ?? null;
			return presentFormalismGroup(group, record, record?.members ?? []);
		}),
		employees: employees.map(presentFormalismPerson),
	};
}
