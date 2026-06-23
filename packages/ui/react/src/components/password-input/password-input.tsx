import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "../../icons";
import { Button } from "../button";
import { Input, type InputProps } from "../input";

export type PasswordInputRootProps = Omit<InputProps, "type" | "rightSlot"> & {
	defaultVisible?: boolean;
	visible?: boolean;
	onVisibilityChange?: (visible: boolean, event: TogglePrimitive.ChangeEventDetails) => void;
};

export function PasswordInputRoot(props: PasswordInputRootProps) {
	const { disabled, defaultVisible, visible, onVisibilityChange, ...rest } = props;

	const isControlled = visible !== undefined;
	const [unControlledVisible, setUnControlledVisible] = useState(defaultVisible ?? false);
	const hisPasswordVisible = isControlled ? visible : unControlledVisible;

	const handleOnVisibilityChange: TogglePrimitive.Props["onPressedChange"] = (visible, event) => {
		if (!isControlled) {
			setUnControlledVisible(visible);
		}
		onVisibilityChange?.(visible, event);
	};

	const Toggler = () => (
		<TogglePrimitive
			className="pointer-events-auto"
			tabIndex={-1}
			defaultPressed={defaultVisible}
			pressed={visible}
			onPressedChange={handleOnVisibilityChange}
			disabled={disabled}
			render={(props, state) => {
				if (state.pressed) {
					return (
						<Button variant="ghost" size="icon-sm" {...props}>
							<EyeIcon />
						</Button>
					);
				}

				return (
					<Button variant="ghost" size="icon-sm" {...props}>
						<EyeOffIcon />
					</Button>
				);
			}}
		/>
	);

	return (
		<Input
			type={hisPasswordVisible ? "text" : "password"}
			disabled={disabled}
			rightSlot={<Toggler />}
			{...rest}
		/>
	);
}
