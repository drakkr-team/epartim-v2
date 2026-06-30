import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/(dashboard)/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<section className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl text-neutral-12">Administration</h1>
				<p className="mt-2 max-w-2xl text-neutral-11">
					Socle admin dedie aux comptes, invitations, roles, cabinets et reseaux.
				</p>
			</div>
		</section>
	);
}
