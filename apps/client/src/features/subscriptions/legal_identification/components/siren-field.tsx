import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Dialog } from "@workspace/ui-react/components/dialog";
import { Field } from "@workspace/ui-react/components/field";
import { Input } from "@workspace/ui-react/components/input";

import type { InpiPreview } from "#/features/subscriptions/inpi/types";
import { useSirenField } from "#/features/subscriptions/legal_identification/hooks/use-siren-field";

type SirenFieldProps = {
	subscriptionId: string;
	currentSiren: string | null;
	currentName: string | null;
	inpiEnabled: boolean;
	label: string;
	onPreview: (preview: InpiPreview) => void;
	onCompanyChange: () => void;
};

export function SirenField(props: SirenFieldProps) {
	const { label, currentName, currentSiren, inpiEnabled } = props;
	const { t } = useTranslation("features.subscriptions.inpi");
	const { field, pending, error, companyChange, search, save, blur, cancelCompanyChange } =
		useSirenField(props);
	const isInvalid = field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

	return (
		<>
			<Field name={field.name} invalid={isInvalid} className="flex flex-col gap-2 md:col-span-3">
				<Field.Label htmlFor={field.name} required>
					{label}
				</Field.Label>
				<fieldset
					aria-label={label}
					className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-3 md:gap-4"
					onBlur={(event) => {
						if (!event.currentTarget.contains(event.relatedTarget)) blur();
					}}
				>
					<Input
						id={field.name}
						name={field.name}
						value={field.state.value}
						inputMode="numeric"
						maxLength={9}
						aria-invalid={isInvalid}
						disabled={pending}
						onChange={(event) => field.handleChange(event.target.value)}
					/>
					{inpiEnabled && (
						<Button
							type="button"
							variant="primary"
							className="w-full sm:w-auto sm:justify-self-start md:col-span-2"
							aria-busy={pending}
							disabled={pending || !/^\d{9}$/.test(field.state.value.trim())}
							focusableWhenDisabled
							onClick={() => void search()}
						>
							{t("button")}
						</Button>
					)}
				</fieldset>
				{isInvalid &&
					field.state.meta.errorMap.onBlur?.map((error: { message: string }) => (
						<Field.Error key={error.message}>{error.message}</Field.Error>
					))}
				{error && !companyChange && (
					<p role="alert" className="text-error-11 text-sm">
						{error}
					</p>
				)}
			</Field>
			<Dialog
				open={companyChange !== null}
				onOpenChange={(open) => {
					if (!open && !pending) cancelCompanyChange();
				}}
			>
				<Dialog.Content className="w-[calc(100%-2rem)] max-w-lg p-6 sm:p-8">
					<div className="grid gap-4">
						<Dialog.Title className="font-bold text-xl">{t("change.title")}</Dialog.Title>
						<p className="font-semibold text-sm">
							{t("change.companies", {
								previous: currentName ?? currentSiren ?? t("empty"),
								next: companyChange,
							})}
						</p>
						<Dialog.Description className="text-neutral-11 text-sm">
							{t("change.manualDescription")}
						</Dialog.Description>
						<p className="text-sm">{t("change.confirm")}</p>
						{error && (
							<p role="alert" className="text-error-11 text-sm">
								{error}
							</p>
						)}
						<div className="flex flex-wrap justify-end gap-2">
							<Button onClick={cancelCompanyChange} disabled={pending}>
								{t("cancel")}
							</Button>
							<Button variant="primary" onClick={() => void save(true)} disabled={pending}>
								{t(pending ? "applying" : "change.action")}
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
