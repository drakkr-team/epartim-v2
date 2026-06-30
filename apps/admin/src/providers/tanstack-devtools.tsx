import { TanStackDevtools, type TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export function TanstackDevtoolsProvider() {
	if (import.meta.env.PROD) {
		return null;
	}

	const plugins: TanStackDevtoolsReactPlugin[] = [
		{
			name: "Tanstack Router",
			render: <TanStackRouterDevtoolsPanel />,
		},
		{
			name: "Tanstack Query",
			render: <ReactQueryDevtoolsPanel />,
		},
	];

	return <TanStackDevtools plugins={plugins} />;
}
