import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { ToastProvider } from "@workspace/ui-react/components/toast";
import { Tooltip } from "@workspace/ui-react/components/tooltip";

import { TanstackDevtoolsProvider } from "#/providers/tanstack-devtools";

export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider disableTransitionOnChange>
			<Tooltip.Provider>
				{children}
				<TanstackDevtoolsProvider />
				<ToastProvider />
			</Tooltip.Provider>
		</ThemeProvider>
	);
}
