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
		links: [
			{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
			{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
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
			<body className="relative bg-primary-2 antialiased">
				<div className="isolate">
					<Providers>{children}</Providers>
				</div>

				<Scripts />
			</body>
		</html>
	);
}
