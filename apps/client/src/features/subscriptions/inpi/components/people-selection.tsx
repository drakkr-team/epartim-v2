import { useTranslation } from "react-i18next";

import { Checkbox } from "@workspace/ui-react/components/checkbox";

import type { InpiPreview } from "#/features/subscriptions/inpi/types";

type PeopleSelectionProps = {
	people: InpiPreview["people"];
	ownerIds: string[];
	onOwnersChange: (ids: string[]) => void;
	disabled: boolean;
};

export function InpiPeopleSelection(props: PeopleSelectionProps) {
	const { people, ownerIds, onOwnersChange, disabled } = props;
	const { t } = useTranslation("features.subscriptions.inpi");
	const name = (person: InpiPreview["people"][number]) =>
		person.legalName ?? [person.firstName, person.lastName].filter(Boolean).join(" ");
	return (
		<section className="grid gap-3" aria-labelledby="inpi-people-title">
			<h4 id="inpi-people-title" className="font-semibold">
				{t("people.owners")}
			</h4>
			<p className="text-neutral-11 text-sm">{t("people.description")}</p>
			{people.length === 0 ? (
				<p className="text-sm">{t("people.empty")}</p>
			) : (
				people.map((person) => (
					<label
						htmlFor={`inpi-select-${person.id}`}
						key={person.id}
						className="flex items-start gap-3 rounded-lg border border-neutral-5 p-3"
					>
						<Checkbox
							id={`inpi-select-${person.id}`}
							checked={ownerIds.includes(person.id)}
							disabled={disabled}
							onCheckedChange={(checked) =>
								onOwnersChange(
									checked ? [...ownerIds, person.id] : ownerIds.filter((id) => id !== person.id),
								)
							}
						/>
						<span>
							<span className="block font-medium">{name(person)}</span>
							<span className="block text-neutral-11 text-sm">
								{person.functionLabel ?? t("people.unknownFunction")}
							</span>
							<span className="block text-neutral-11 text-sm">
								{person.roles.map((role) => t(`roles.${role}`)).join(", ") ||
									t("people.rolesToComplete")}
							</span>
						</span>
					</label>
				))
			)}
		</section>
	);
}
