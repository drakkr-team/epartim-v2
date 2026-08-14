import { NumberField as NumberInputHeadless } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "../button";
import { Input } from "../input";

export type NumberInputRootProps = Pick<
	NumberInputHeadless.Root.Props,
	| "name"
	| "defaultValue"
	| "value"
	| "onValueChange"
	| "onValueCommitted"
	| "onBlur"
	| "allowOutOfRange"
	| "form"
	| "locale"
	| "snapOnStep"
	| "step"
	| "smallStep"
	| "largeStep"
	| "min"
	| "max"
	| "allowWheelScrub"
	| "format"
	| "disabled"
	| "readOnly"
	| "required"
	| "inputRef"
	| "id"
	| "className"
	| "style"
	| "render"
>;

export function NumberInputRoot(props: NumberInputRootProps) {
	return (
		<NumberInputHeadless.Root {...props}>
			<NumberInputHeadless.Input
				render={
					<Input
						className="text-center"
						leftSlot={
							<NumberInputHeadless.Decrement
								className="pointer-events-auto"
								render={
									<Button variant="ghost" size="icon-sm">
										<MinusIcon />
									</Button>
								}
							/>
						}
						rightSlot={
							<NumberInputHeadless.Increment
								className="pointer-events-auto"
								render={
									<Button variant="ghost" size="icon-sm">
										<PlusIcon />
									</Button>
								}
							/>
						}
					/>
				}
			/>
		</NumberInputHeadless.Root>
	);
}
