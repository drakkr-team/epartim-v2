import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";

import "#/styles/globals.css";
import "#/libs/i18n/config";
import { Providers } from "#/providers";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Epartim Admin" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative bg-neutral-2 antialiased">
				<div className="isolate">
					<Providers>{children}</Providers>
				</div>

				<Scripts />
			</body>
		</html>
	);
}
