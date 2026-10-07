import { useTranslation } from "react-i18next";

import { Select } from "@workspace/ui-react/components/select";

import type { InpiPreview } from "#/features/subscriptions/inpi/types";

type LegalAgentSelectionProps = {
	people: InpiPreview["people"];
	selected: string | null;
	onChange: (id: string | null) => void;
	disabled: boolean;
};

export function InpiLegalAgentSelection(props: LegalAgentSelectionProps) {
	const { people, selected, onChange, disabled } = props;
	const { t } = useTranslation("features.subscriptions.inpi");
	const name = (person: InpiPreview["people"][number]) =>
		person.legalName ?? [person.firstName, person.lastName].filter(Boolean).join(" ");

	return (
		<section className="grid gap-3" aria-labelledby="inpi-legal-agent-title">
			<h4 id="inpi-legal-agent-title" className="font-semibold">
				{t("people.legalAgent")}
			</h4>
			<p className="text-neutral-11 text-sm">{t("people.legalAgentDescription")}</p>
			{people.length === 0 ? (
				<p className="text-sm">{t("people.empty")}</p>
			) : (
				<Select
					items={[
						{ value: "", label: t("people.keepLegalAgent") },
						...people.map((person) => ({ value: person.id, label: name(person) })),
					]}
					value={selected ?? ""}
					onValueChange={(value) => onChange(value || null)}
					disabled={disabled}
				>
					<Select.Input id="inpi-legal-agent" aria-labelledby="inpi-legal-agent-title">
						<Select.Value />
					</Select.Input>
					<Select.Dropdown>
						<Select.Option value="" label={t("people.keepLegalAgent")}>
							{t("people.keepLegalAgent")}
						</Select.Option>
						{people.map((person) => (
							<Select.Option key={person.id} value={person.id} label={name(person)}>
								{name(person)}
								{person.functionLabel ? ` — ${person.functionLabel}` : ""}
							</Select.Option>
						))}
					</Select.Dropdown>
				</Select>
			)}
		</section>
	);
}
