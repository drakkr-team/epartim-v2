import { useIsMutating } from "@tanstack/react-query";

import { SubscriptionFormalismMethod } from "@workspace/api/constants/subscription_formalism";
import { Card } from "@workspace/ui-react/components/card";

import { CseSection } from "#/features/subscriptions/formalism/components/cse-section";
import { MethodSection } from "#/features/subscriptions/formalism/components/method-section";
import {
	type Formalism,
	type FormalismGroup,
	useFormalismGroupForm,
} from "#/features/subscriptions/formalism/hooks/use-group-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type FormalismFormProps = {
	subscriptionId: string;
	group: FormalismGroup;
	formalism: Formalism;
	headcount: string | null;
	devices: string;
};

export function FormalismForm({
	subscriptionId,
	group,
	formalism,
	headcount,
	devices,
}: FormalismFormProps) {
	const { form, changeMethod, createMember, deleteMember, copyPeople, hasPeople } =
		useFormalismGroupForm(subscriptionId, group);
	useRegisterSubscriptionStepForm(form);
	const busy =
		useIsMutating({
			predicate: (mutation) =>
				mutation.options.scope?.id === `subscription:${subscriptionId}:formalism`,
		}) > 0;

	return (
		<Card
			render={<form noValidate onSubmit={(event) => event.preventDefault()} />}
			className="grid gap-6 p-6 sm:p-8"
		>
			<MethodSection
				form={form}
				changeMethod={changeMethod}
				hasPeople={hasPeople}
				group={group}
				formalism={formalism}
				headcount={headcount}
				devices={devices}
				busy={busy}
			/>
			<form.Subscribe selector={(state) => state.values.method}>
				{(method) =>
					method === SubscriptionFormalismMethod.CSE && (
						<CseSection
							form={form}
							group={group.group}
							formalism={formalism}
							createMember={createMember}
							deleteMember={deleteMember}
							copyPeople={copyPeople}
							busy={busy}
						/>
					)
				}
			</form.Subscribe>
		</Card>
	);
}
