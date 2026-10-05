import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { DownloadIcon, UploadIcon } from "@workspace/ui-react/icons";

import type { useFormalismEmployeesForm } from "#/features/subscriptions/formalism/hooks/use-employees-form";

type EmployeesImportProps = Pick<
	ReturnType<typeof useFormalismEmployeesForm>,
	"importMutation" | "mergeImportedEmployees"
> & { subscriptionId: string; busy: boolean };

export function EmployeesImport({
	subscriptionId,
	importMutation,
	mergeImportedEmployees,
	busy,
}: EmployeesImportProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const input = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);
	function importFile(file: File) {
		if (busy) return;
		setResult(null);
		if (!file.name.toLowerCase().endsWith(".csv")) {
			setErrors([t("import.format")]);
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setErrors([t("import.size")]);
			return;
		}
		setErrors([]);
		importMutation.mutate(
			{ params: { subscriptionId }, body: { file } },
			{
				onSuccess: (response) => {
					mergeImportedEmployees(response.employees);
					setResult(response);
				},
				onError: (error) =>
					setErrors(
						error.isValidationError()
							? error.response.errors.map((item) => item.message)
							: [t("error.retry")],
					),
			},
		);
	}
	return (
		<fieldset
			aria-label={t("action.import")}
			className="grid gap-4 rounded-md border border-neutral-6 border-dashed bg-neutral-2 p-5"
			onDragOver={(event) => event.preventDefault()}
			onDrop={(event) => {
				event.preventDefault();
				const file = event.dataTransfer.files[0];
				if (file) importFile(file);
			}}
		>
			<p className="text-neutral-11 text-sm">{t("import.description")}</p>
			<div className="flex flex-wrap gap-3">
				<Button
					nativeButton={false}
					variant="default"
					render={<a href="/templates/salaries-ratification.csv" download />}
				>
					<DownloadIcon />
					{t("action.downloadTemplate")}
				</Button>
				<Button
					type="button"
					variant="default"
					disabled={busy}
					onClick={() => input.current?.click()}
				>
					<UploadIcon />
					{t(importMutation.isPending ? "import.pending" : "action.import")}
				</Button>
				<input
					ref={input}
					type="file"
					accept=".csv,text/csv"
					aria-label={t("action.import")}
					className="sr-only"
					disabled={busy}
					onChange={(event) => {
						const file = event.currentTarget.files?.[0];
						event.currentTarget.value = "";
						if (file) importFile(file);
					}}
				/>
			</div>
			{errors.length > 0 && (
				<ul role="alert" className="list-inside list-disc text-error-10 text-sm">
					{[...new Set(errors)].map((error) => (
						<li key={error}>{error}</li>
					))}
				</ul>
			)}
			{result && (
				<p role="status" className="text-secondary-12 text-sm">
					{t("import.result", result)}
				</p>
			)}
		</fieldset>
	);
}
