import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/")({ component: DashboardPage });

function DashboardPage() {
	return (
		<div>
			<h1 className="font-bold text-4xl">Tableau de bord</h1>
		</div>
	);
}
