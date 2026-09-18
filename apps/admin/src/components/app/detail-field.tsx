import type { ReactNode } from "react";

import { Field } from "@workspace/ui-react/components/field";

type DetailFieldProps = {
	label: string;
	value: ReactNode;
};

export function DetailField(props: DetailFieldProps) {
	const { label, value } = props;

	return (
		<Field>
			<Field.Label>{label}</Field.Label>
			<p className="text-neutral-12 text-sm">{value}</p>
		</Field>
	);
}
