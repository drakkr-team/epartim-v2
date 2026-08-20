import { TanStackDevtools, type TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export function TanstackDevtoolsProvider() {
	const plugins: TanStackDevtoolsReactPlugin[] = [
		{
			name: "Tanstack Router",
			render: <TanStackRouterDevtoolsPanel />,
		},
		{
			name: "Tanstack Query",
			render: <ReactQueryDevtoolsPanel />,
		},
		{
			name: "Tanstack Form",
			render: <FormDevtoolsPanel />,
		},
	];

	return <TanStackDevtools plugins={plugins} />;
}
