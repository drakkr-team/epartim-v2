import { Toggle as ToggleHeadless } from "@base-ui/react/toggle";
import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "../../icons";
import { Button } from "../button";
import { Input, type InputProps } from "../input";

export type PasswordInputRootProps = Omit<InputProps, "type" | "rightSlot"> & {
	defaultVisible?: boolean;
	visible?: boolean;
	showPasswordLabel?: string;
	hidePasswordLabel?: string;
	onVisibilityChange?: (visible: boolean, event: ToggleHeadless.ChangeEventDetails) => void;
};

export function PasswordInputRoot(props: PasswordInputRootProps) {
	const {
		disabled,
		defaultVisible,
		visible,
		showPasswordLabel = "Show password",
		hidePasswordLabel = "Hide password",
		onVisibilityChange,
		...rest
	} = props;

	const isControlled = visible !== undefined;
	const [unControlledVisible, setUnControlledVisible] = useState(defaultVisible ?? false);
	const hisPasswordVisible = isControlled ? visible : unControlledVisible;

	const handleOnVisibilityChange: ToggleHeadless.Props["onPressedChange"] = (visible, event) => {
		if (!isControlled) {
			setUnControlledVisible(visible);
		}
		onVisibilityChange?.(visible, event);
	};

	const Toggler = () => (
		<ToggleHeadless
			className="pointer-events-auto"
			defaultPressed={defaultVisible}
			pressed={visible}
			onPressedChange={handleOnVisibilityChange}
			disabled={disabled}
			render={(props, state) => {
				if (state.pressed) {
					return (
						<Button variant="ghost" size="icon-sm" {...props} aria-label={hidePasswordLabel}>
							<EyeIcon aria-hidden="true" />
						</Button>
					);
				}

				return (
					<Button variant="ghost" size="icon-sm" {...props} aria-label={showPasswordLabel}>
						<EyeOffIcon aria-hidden="true" />
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
