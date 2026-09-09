import type { Subscription } from "@workspace/api/data";

export function SubscriptionCreatedAtCell({ createdAt }: Pick<Subscription, "createdAt">) {
	return <span className="text-neutral-9 text-xs">{createdAt.toLocaleDateString("fr-FR")}</span>;
}
