import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Subscription } from "@workspace/api/data";
import { Button } from "@workspace/ui-react/components/button";
import { ChevronRightIcon } from "@workspace/ui-react/icons";

export function SubscriptionOpenCell({ createdAt, id }: Pick<Subscription, "createdAt" | "id">) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const reference = t("reference", { year: createdAt.getFullYear(), id });

	return (
		<Button
			aria-label={t("action.open", { reference })}
			nativeButton={false}
			render={
				<Link
					to="/subscriptions/$id"
					params={{ id: id.toString() }}
					onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
				/>
			}
			size="icon-sm"
			variant="ghost"
		>
			<ChevronRightIcon />
		</Button>
	);
}
