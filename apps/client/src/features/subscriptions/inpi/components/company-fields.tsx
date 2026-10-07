import { useTranslation } from "react-i18next";

import { Checkbox } from "@workspace/ui-react/components/checkbox";

import type { InpiFieldKey, InpiPreview } from "#/features/subscriptions/inpi/types";

type CompanyFieldsProps = {
	preview: InpiPreview;
	selected: InpiFieldKey[];
	onChange: (fields: InpiFieldKey[]) => void;
	disabled: boolean;
};

export function InpiCompanyFields({ preview, selected, onChange, disabled }: CompanyFieldsProps) {
	const { t } = useTranslation("features.subscriptions.inpi");
	const { t: legal } = useTranslation(
		"features.subscriptions.legal_identification.components.legal-identification-form",
	);
	function display(key: InpiFieldKey, value: string | number | null) {
		if (value === null) return t("empty");
		return key === "legalForm"
			? legal(`legalForm.${value}`, { defaultValue: String(value) })
			: String(value);
	}
	return (
		<section className="grid gap-3" aria-labelledby="inpi-company-title">
			<h4 id="inpi-company-title" className="font-semibold">
				{t("company.title")}
			</h4>
			<p className="text-neutral-11 text-sm">{t("company.description")}</p>
			{preview.fields.map((field) => (
				<label
					key={field.key}
					htmlFor={`inpi-select-${field.key}`}
					className="flex items-start gap-3 rounded-lg border border-neutral-5 p-3"
				>
					<Checkbox
						id={`inpi-select-${field.key}`}
						checked={selected.includes(field.key)}
						disabled={disabled || field.proposed === null}
						onCheckedChange={(checked) =>
							onChange(
								checked ? [...selected, field.key] : selected.filter((key) => key !== field.key),
							)
						}
					/>
					<span className="min-w-0 flex-1">
						<span className="block font-medium text-sm">{t(`fields.${field.key}`)}</span>
						<span className="block break-words text-neutral-11 text-sm">
							{t("company.current", { value: display(field.key, field.current) })}
						</span>
						<span className="block break-words text-sm">
							{t("company.proposed", { value: display(field.key, field.proposed) })}
						</span>
					</span>
				</label>
			))}
		</section>
	);
}
