import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)")({
	staticData: {
		breadcrumb: { labelKey: "operations", to: "/client-portfolio" },
	} satisfies BreadcrumbStaticData,
	component: Outlet,
});
