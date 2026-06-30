import type { PropsWithChildren } from "react";

const navigationItems = [
	{ label: "Tableau de bord", href: "/" },
	{ label: "Utilisateurs", href: "/users" },
	{ label: "Invitations", href: "/invitations" },
	{ label: "Roles", href: "/roles" },
	{ label: "Cabinets", href: "/firms" },
	{ label: "Reseaux", href: "/networks" },
];

export function AdminShell({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen bg-neutral-2">
			<aside className="fixed inset-y-0 left-0 w-64 border-neutral-6 border-r bg-neutral-1">
				<div className="border-neutral-6 border-b px-5 py-4">
					<div className="font-semibold text-neutral-12">Epartim Admin</div>
				</div>
				<nav className="space-y-1 p-3">
					{navigationItems.map((item) => (
						<a
							className="block rounded-md px-3 py-2 text-neutral-11 text-sm hover:bg-neutral-3 hover:text-neutral-12"
							href={item.href}
							key={item.href}
						>
							{item.label}
						</a>
					))}
				</nav>
			</aside>
			<main className="ml-64 p-8">{children}</main>
		</div>
	);
}
