import { createFileRoute, redirect } from "@tanstack/react-router";

import type { BreadcrumbStaticData } from "#/libs/breadcrumb";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/$id/")({
	staticData: {
		breadcrumb: { labelKey: "new-subscription", to: "/subscriptions/$id" },
	} satisfies BreadcrumbStaticData,
	loader: async ({ context, params }) => {
		const subscription = await context.queryClient.query({
			...api.subscriptions.view.queryOptions({ params: { subscriptionId: params.id } }),
			staleTime: "static",
		});
		const step = subscription.completedSteps?.includes(1) ? "2" : "1";

		throw redirect({
			to: "/subscriptions/$id/steps/$step",
			params: { id: params.id, step },
		});
	},
});
