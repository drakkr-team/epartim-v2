import z from "zod";

import {
	getActiveFormalismGroups,
	getAvailableFormalismMethods,
	SubscriptionCseFunction,
	SubscriptionFormalismMethod,
} from "@workspace/api/constants/subscription_formalism";

import {
	calendarDate,
	email,
	headcount,
	requiredText,
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";

export type FormalismInput = Pick<SubscriptionSnapshot, "formalism"> & {
	legalIdentification: Pick<SubscriptionSnapshot["legalIdentification"], "companyHeadcount">;
	contractCharacteristics: Pick<SubscriptionSnapshot["contractCharacteristics"], "adhesionTypes">;
};

function cseFields(group: SubscriptionSnapshot["formalism"]["groups"][number]) {
	const votes = [group.votesFor, group.votesAgainst, group.votesAbstentions];
	const attendees = group.members.filter((member) => member.attending === true).length;
	const votesAreConsistent =
		group.members.every((member) => typeof member.attending === "boolean") &&
		votes.every((vote) => valid(z.number().int().min(0).max(2147483647), vote)) &&
		votes.reduce<number>((sum, vote) => sum + (vote ?? 0), 0) === attendees &&
		(group.votesFor ?? 0) > attendees / 2;
	const requirements = [
		valid(calendarDate, group.meetingDate),
		valid(z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/), group.closingTime),
		valid(requiredText.max(120), group.meetingCity),
		valid(requiredText, group.presidentFirstName),
		valid(requiredText, group.presidentLastName),
		valid(email, group.presidentEmail),
		group.members.some((member) => member.id === group.mandatedMemberId),
		...votes.map(
			(vote) => valid(z.number().int().min(0).max(2147483647), vote) && votesAreConsistent,
		),
	];
	for (const member of group.members) {
		requirements.push(
			valid(requiredText, member.firstName),
			valid(requiredText, member.lastName),
			valid(z.enum(SubscriptionCseFunction), member.function),
			valid(z.boolean(), member.attending),
		);
		if (member.id === group.mandatedMemberId) requirements.push(valid(email, member.email));
	}
	return requirements;
}

export function formalismCompletion(subscription: FormalismInput) {
	const employeeCount = subscription.legalIdentification.companyHeadcount;
	const activeGroups = getActiveFormalismGroups(subscription.contractCharacteristics.adhesionTypes);
	if (!valid(headcount, Number(employeeCount)) || activeGroups.length === 0) return null;
	const requirements: boolean[] = [];
	let requiresEmployees = false;
	for (const activeGroup of activeGroups) {
		const group = subscription.formalism.groups.find((group) => group.group === activeGroup);
		const availableMethods = getAvailableFormalismMethods(activeGroup, employeeCount);
		const methodValid =
			!!group &&
			!group.methodInvalidated &&
			group.method !== null &&
			availableMethods.includes(group.method);
		requirements.push(methodValid);
		if (!group || !methodValid) continue;
		if (group.method === SubscriptionFormalismMethod.CSE) requirements.push(...cseFields(group));
		if (group.method === SubscriptionFormalismMethod.RATIFICATION) requiresEmployees = true;
	}
	if (requiresEmployees) {
		const employees = subscription.formalism.employees;
		if (employees.length === 0) requirements.push(false, false, false);
		const emailCounts = new Map<string, number>();
		for (const employee of employees) {
			const normalized = employee.email?.trim().toLowerCase() ?? "";
			emailCounts.set(normalized, (emailCounts.get(normalized) ?? 0) + 1);
		}
		for (const employee of employees)
			requirements.push(
				valid(requiredText, employee.firstName),
				valid(requiredText, employee.lastName),
				valid(email, employee.email) &&
					emailCounts.get(employee.email?.trim().toLowerCase() ?? "") === 1,
			);
	}
	return summarizeCompletion(requirements);
}
