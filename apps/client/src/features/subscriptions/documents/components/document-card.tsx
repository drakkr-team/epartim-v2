import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";
import { Button } from "@workspace/ui-react/components/button";
import { Link } from "@workspace/ui-react/components/link";
import { FileTextIcon, Trash2Icon, UploadIcon } from "@workspace/ui-react/icons";

import { useDeleteSubscriptionDocumentMutation } from "#/features/subscriptions/documents/hooks/use-delete-mutation";
import { useUploadSubscriptionDocumentMutation } from "#/features/subscriptions/documents/hooks/use-upload-mutation";

const acceptedExtensions = ["pdf", "png", "jpg", "jpeg", "csv", "xlsx"];
const acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.csv,.xlsx";
const maximumFileSize = 10 * 1024 * 1024;

type SubscriptionDocument =
	(typeof routes)["client.subscriptions.view"]["types"]["response"]["documents"][number];

type DocumentCardProps = {
	document: SubscriptionDocument;
	showRequiredError?: boolean;
	subscriptionId: string;
};

export function DocumentCard(props: DocumentCardProps) {
	const { document, showRequiredError = false, subscriptionId } = props;
	const { t } = useTranslation("features.subscriptions.documents.components.documents-section");
	const inputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);
	const upload = useUploadSubscriptionDocumentMutation(subscriptionId);
	const remove = useDeleteSubscriptionDocumentMutation(subscriptionId);
	const isPending = upload.isPending || remove.isPending;

	function uploadFile(file: File) {
		const extension = file.name.split(".").pop()?.toLowerCase();

		if (!extension || !acceptedExtensions.includes(extension)) {
			setError(t("error.format"));
			return;
		}

		if (file.size > maximumFileSize) {
			setError(t("error.size"));
			return;
		}

		setError(null);
		upload.mutate(
			{
				params: { documentType: document.type, subscriptionId },
				body: { file },
			},
			{
				onError: () => setError(t("error.upload")),
			},
		);
	}

	function removeFile() {
		setError(null);
		remove.mutate(
			{ params: { documentType: document.type, subscriptionId } },
			{
				onError: () => setError(t("error.delete")),
			},
		);
	}

	const isMissing = showRequiredError && document.status === "pending";

	return (
		<article
			aria-invalid={isMissing}
			className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-sm border border-neutral-6 border-dashed px-3 py-2.5 sm:px-4 sm:py-3"
		>
			<FileTextIcon className="mt-0.5 size-5 shrink-0 text-primary-9" aria-hidden="true" />
			<div className="min-w-0">
				<h3
					className="truncate font-semibold text-secondary-12 text-xs leading-5"
					title={document.label}
				>
					{document.label}
				</h3>
				{document.file ? (
					<Link
						download={document.file.name}
						href={document.file.url}
						aria-label={t("action.download", { document: document.file.name })}
						className="mt-0.5 block truncate text-xs"
					>
						{document.file.name}
					</Link>
				) : (
					<p className="mt-0.5 truncate text-neutral-10 text-xs">{t("status.pending")}</p>
				)}
				{error && (
					<p role="alert" className="mt-1 text-error-10 text-xs">
						{error}
					</p>
				)}
				{isMissing && (
					<p role="alert" className="mt-1 text-error-10 text-xs">
						{t("validation.required-document")}
					</p>
				)}
			</div>
			<div className="flex items-start gap-1">
				<input
					ref={inputRef}
					type="file"
					accept={acceptedFileTypes}
					aria-label={t(document.file ? "action.replace" : "action.upload", {
						document: document.label,
					})}
					className="sr-only"
					onChange={(event) => {
						const [file] = Array.from(event.currentTarget.files ?? []);
						event.currentTarget.value = "";

						if (file) uploadFile(file);
					}}
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label={t(document.file ? "action.replace" : "action.upload", {
						document: document.label,
					})}
					disabled={isPending}
					onClick={() => inputRef.current?.click()}
				>
					<UploadIcon aria-hidden="true" />
				</Button>
				{document.file && (
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label={t("action.delete", { document: document.label })}
						disabled={isPending}
						onClick={removeFile}
					>
						<Trash2Icon aria-hidden="true" />
					</Button>
				)}
			</div>
		</article>
	);
}
