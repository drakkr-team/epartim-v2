import type { ErrorComponentProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";

export function UnexpectedPage(props: ErrorComponentProps) {
	const { reset } = props;

	const { t } = useTranslation("componoent.pages.unexpected");

	return (
		<main className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
			<h1 className="mb-2 font-serif text-5xl text-primary-11">{t("title")}</h1>
			<p className="mb-8 text-neutral-11 text-sm">{t("description")}</p>
			<Button variant="primary" onClick={reset}>
				{t("retry")}
			</Button>
		</main>
	);
}
