import type { PropsWithChildren } from "react";

const navigationItems = [
	{ label: "Tableau de bord", href: "/" },
	{ label: "Utilisateurs", href: "/users" },
];

export function AdminShell({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen bg-neutral-2 text-neutral-12">
			<aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-primary-12 text-primary-1">
				<div className="border-primary-11 border-b px-6 py-6">
					<div className="font-bold font-display text-2xl tracking-tight">
						epartim<span className="text-gold-8">.</span>
					</div>
					<div className="mt-1 font-semibold text-[10px] text-gold-8 uppercase tracking-[0.2em]">
						Administration
					</div>
				</div>
				<nav className="space-y-1 p-3">
					{navigationItems.map((item) => (
						<a
							className="block rounded-md px-3 py-2 font-medium text-primary-4 text-sm transition-colors hover:bg-primary-11 hover:text-primary-1"
							href={item.href}
							key={item.href}
						>
							{item.label}
						</a>
					))}
				</nav>
			</aside>
			<main className="ml-64 p-8 lg:p-10">{children}</main>
		</div>
	);
}
