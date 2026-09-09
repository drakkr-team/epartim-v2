import type { Subscription } from "@workspace/api/data";

export function SubscriptionUpdatedAtCell({ updatedAt }: Pick<Subscription, "updatedAt">) {
	return (
		<span className="text-neutral-9 text-xs">
			{updatedAt.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
		</span>
	);
}
